package handlers_test 

import (
	"testing"
	"net/http"
	"net/http/httptest"
	"strconv"
	"strings"

	"chinese-heritage-backend/server"
	"chinese-heritage-backend/store/mock"
	"chinese-heritage-backend/models"
	"chinese-heritage-backend/tests"
	"time"

	"chinese-heritage-backend/handlers"
	"github.com/golang-jwt/jwt/v5"
)

func TestAdminOnlyMiddleware(t *testing.T) {
    // Dummy handler to wrap
    handler := handlers.AdminOnly(func(w http.ResponseWriter, r *http.Request) {
        w.WriteHeader(http.StatusOK)
        w.Write([]byte("success"))
    })

    t.Run("missing token", func(t *testing.T) {
        req := httptest.NewRequest(http.MethodGet, "/", nil)
        rr := httptest.NewRecorder()

        handler(rr, req)

        if rr.Code != http.StatusUnauthorized {
            t.Errorf("expected 401, got %d", rr.Code)
        }
    })

    t.Run("invalid token", func(t *testing.T) {
        req := httptest.NewRequest(http.MethodGet, "/", nil)
        req.Header.Set("Authorization", "invalid-token")
        rr := httptest.NewRecorder()

        handler(rr, req)

        if rr.Code != http.StatusUnauthorized {
            t.Errorf("expected 401, got %d", rr.Code)
        }
    })

    t.Run("valid admin token", func(t *testing.T) {
        token := jwt.NewWithClaims(jwt.SigningMethodHS256, &handlers.Claims{
            IsAdmin: true,
        })
        tokenStr, _ := token.SignedString(handlers.JwtKey)

        req := httptest.NewRequest(http.MethodGet, "/", nil)
        req.Header.Set("Authorization", tokenStr)
        rr := httptest.NewRecorder()

        handler(rr, req)

        if rr.Code != http.StatusOK {
            t.Errorf("expected 200, got %d", rr.Code)
        }
    })

    t.Run("non-admin token", func(t *testing.T) {
        token := jwt.NewWithClaims(jwt.SigningMethodHS256, &handlers.Claims{
            IsAdmin: false,
        })
        tokenStr, _ := token.SignedString(handlers.JwtKey)

        req := httptest.NewRequest(http.MethodGet, "/", nil)
        req.Header.Set("Authorization", tokenStr)
        rr := httptest.NewRecorder()

        handler(rr, req)

        if rr.Code != http.StatusForbidden {
            t.Errorf("expected 403, got %d", rr.Code)
        }
    })
}


var events = []models.Event{{
		Name        : "Event 1",
		Description : "Description for Event 1",
		Date        : models.DateYMD(time.Now()),
		Location    : "Location 1",
		ExpiresAt   : models.DateYMD(time.Now()),
		Link        : "#",
	},{
		Name        : "Event 2",
		Description : "Description for Event 2",
		Date        : models.DateYMD(time.Now().Add(48 * time.Hour)),
		Location    : "Location 2",
		ExpiresAt   : models.DateYMD(time.Now()),
		Link        : "#",	
	}, {
		Name        : "Event 3",	
		Description : "Description for Event 3",
		Date        : models.DateYMD(time.Now()),
		Location    : "Location 3",
		ExpiresAt   : models.DateYMD(time.Now()),
		Link        : "#",	
},}

func TestEventCreation(t *testing.T) {
	t.Run("it create a new event", func(t *testing.T){
		store := mock.NewMockStore()
		f, ok := store.EventStore().(*mock.FakeEventStore)
		if !ok {
			t.Fatalf("store is not a FakeEventStore")
		}
		s, err := server.NewServer(store)
		if err != nil {
			t.Fatalf("failed to create server: %v", err)
		}
		response := httptest.NewRecorder()
		request := tests.CreateEventRequest(t, http.MethodPost, events[0])
		s.ServeHTTP(response, request)
		tests.AssertStatusCode(t, response.Code, http.StatusCreated)
		if (f.Len() < 1) {
			t.Errorf("new event was not added %v", response.Body)
		}
	})

	t.Run("it should store expire_date less than event date", func(t *testing.T){
		var invalidEvent = models.Event {
			Name        : "Event 1",
			Description : "Description for Event 1",
			Date        : models.DateYMD(time.Now().Add(48 * time.Hour)),
			Location    : "Location 1",
			ExpiresAt   : models.DateYMD(time.Now()),
			Link        : "#",
		}
		store := mock.NewMockStore()
		s, err := server.NewServer(store)
		if err != nil {
			t.Fatalf("failed to create server: %v", err)
		}
		response := httptest.NewRecorder()
		request := tests.CreateEventRequest(t, http.MethodPost, invalidEvent)
		s.ServeHTTP(response, request)
		tests.AssertStatusCode(t, response.Code, http.StatusCreated)
		if (store.EventStore().(*mock.FakeEventStore).Len() == 0) {
			t.Errorf("event should be created on invalid date %v", response.Body)
		}
	})

	t.Run("it should default expire date to event date if not provided", func(t *testing.T){
		var eventWithoutExpireDate = models.Event {
			Name        : "Event 1",
			Description : "Description for Event 1",
			Date        : models.DateYMD(time.Now().Add(48 * time.Hour)),
			Location    : "Location 1",
			Link        : "#",
		}

		store := mock.NewMockStore()
		s, err := server.NewServer(store)
		if err != nil {
			t.Fatalf("failed to create server: %v", err)
		}
		response := httptest.NewRecorder()
		request := tests.CreateEventRequest(t, http.MethodPost, eventWithoutExpireDate)
		s.ServeHTTP(response, request)
		tests.AssertStatusCode(t, response.Code, http.StatusCreated)
		fakeStore := store.EventStore().(*mock.FakeEventStore)
		createdEvent, err := fakeStore.GetEventByID(nil, 0)
		if err != nil {
			t.Fatalf("failed to get created event: %v", err)
		}
		if time.Time(createdEvent.Date).After(time.Time(createdEvent.ExpiresAt)) {
			t.Errorf("expire date not defaulted to event date")
		}
	})


	t.Run("it create mutiple events", func(t *testing.T) {
		store := mock.NewMockStore()
		f, ok := store.EventStore().(*mock.FakeEventStore)
		if !ok {
			t.Fatalf("store is not a FakeEventStore")
		}
		s, err := server.NewServer(store)
		if err != nil {
			t.Fatalf("failed to create server: %v", err)
		}
		response := httptest.NewRecorder()
		request := tests.CreateEventAllRequest(t, http.MethodPost, events)
		s.ServeHTTP(response, request)
		tests.AssertStatusCode(t, response.Code, http.StatusCreated)
		if (f.Len() < len(events)) {
			t.Errorf("new events were not added %v", response.Body)
		}
	})
}

func TestEventDeletion(t *testing.T) {

	t.Run("it delete an event by id", func(t *testing.T){
		store := mock.NewMockStore()
		f, ok := store.EventStore().(*mock.FakeEventStore)
		if !ok {
			t.Fatalf("store is not a FakeEventStore")
		}
		s, err := server.NewServer(store)
		if err != nil {
			t.Fatalf("failed to create server: %v", err)
		}
		// First create an event to delete
		id, err := f.CreateEvent(nil, events[0])
		if err != nil {
			t.Fatalf("failed to create event: %v", err)
		}

		response := httptest.NewRecorder()
		request := tests.CreateDeleteEventRequest(t, http.MethodDelete, strconv.Itoa(id))
		s.ServeHTTP(response, request)
		tests.AssertStatusCode(t, response.Code, http.StatusNoContent)
		if (f.Len() != 0) {
			t.Errorf("event was not deleted %v", response.Body)
		}	
	})

	t.Run("it should return 404 if event id does not exist", func(t *testing.T){
		store := mock.NewMockStore()
		s, err := server.NewServer(store)
		if err != nil {
			t.Fatalf("failed to create server: %v", err)
		}

		response := httptest.NewRecorder()
		request := tests.CreateDeleteEventRequest(t, http.MethodDelete, "999")
		s.ServeHTTP(response, request)
		tests.AssertStatusCode(t, response.Code, http.StatusNotFound)
	})

	t.Run("it should return 400 if event id is invalid", func(t *testing.T){
		store := mock.NewMockStore()
		s, err := server.NewServer(store)
		if err != nil {
			t.Fatalf("failed to create server: %v", err)
		}

		response := httptest.NewRecorder()
		request := tests.CreateDeleteEventRequest(t, http.MethodDelete, "invalid-id")
		s.ServeHTTP(response, request)
		tests.AssertStatusCode(t, response.Code, http.StatusBadRequest)
	})

	t.Run("it should delete expire events", func(t *testing.T){
		store := mock.NewMockStore()
		f, ok := store.EventStore().(*mock.FakeEventStore)
		if !ok {
			t.Fatalf("store is not a FakeEventStore")
		}
		s, err := server.NewServer(store)
		if err != nil {
			t.Fatalf("failed to create server: %v", err)
		}
		// First create an event to delete
		expiredEvent := events[0]
		expiredEvent.ExpiresAt = models.DateYMD(time.Now().Add(-24 * time.Hour)) // Set expire date in the past
		_, err = f.CreateEvent(nil, expiredEvent)
		if err != nil {
			t.Fatalf("failed to create event: %v", err)
		}

		response := httptest.NewRecorder()
		request := tests.CreateDeleteExpiredEventsRequest(t, http.MethodDelete)
		s.ServeHTTP(response, request)
		tests.AssertStatusCode(t, response.Code, http.StatusNoContent)
		if (f.Len() != 0) {
			t.Errorf("expired event was not deleted %v", response.Body)
		}	
	})

}

func TestEventRetrieval(t *testing.T) {
	t.Run("it fetch all events", func(t *testing.T){
		store := mock.NewMockStore()
		f, ok := store.EventStore().(*mock.FakeEventStore)
		if !ok {
			t.Fatalf("store is not a FakeEventStore")
		}
		s, err := server.NewServer(store)
		if err != nil {
			t.Fatalf("failed to create server: %v", err)
		}
		// First create some events to retrieve
		for _, event := range events {
			_, err := f.CreateEvent(nil, event)
			if err != nil {
				t.Fatalf("failed to create event: %v", err)
			}
		}

		response := httptest.NewRecorder()
		request := httptest.NewRequest(http.MethodGet, "/api/events", nil)
		s.ServeHTTP(response, request)
		tests.AssertStatusCode(t, response.Code, http.StatusOK)
		var retrievedEvents []models.Event
		if err := tests.ParseJSON(strings.NewReader(response.Body.String()), &retrievedEvents); err != nil {
			t.Fatalf("failed to parse response: %v", err)
		}
		if len(retrievedEvents) != len(events) {
			t.Errorf("expected %d events, got %d", len(events), len(retrievedEvents))
		}
	})
}


