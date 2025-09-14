package postgresql

import (
	"chinese-heritage-backend/models"
	"chinese-heritage-backend/tests"
	"context"
	"testing"
	"time"
)

func TestGetEventsWithFilter(t *testing.T) {
	// This test requires a database connection
	// You may need to adjust the connection string based on your test setup
	pool, err := tests.SetupTestDB(t, []string{"events"}, "../../.env")
	if err != nil {
		t.Skip("Skipping test: database connection not available")
		return
	}
	defer pool.Close()

	store := &PostgresEventStore{pool: pool}
	ctx := context.Background()

	// Clean up any existing test data
	pool.Exec(ctx, "DELETE FROM events WHERE name LIKE 'Test Event%'")

	// Create test events with different locations and dates
	testEvents := []models.Event{
		{
			Name:        "Test Event 1 - Washington DC",
			Description: "Test event in Washington DC",
			Date:        models.DateYMD(time.Date(2024, 1, 15, 0, 0, 0, 0, time.UTC)),
			Location:    "1600 Pennsylvania Ave NW, Washington, DC 20500, USA",
			ExpiresAt:   models.DateYMD(time.Date(2024, 1, 20, 0, 0, 0, 0, time.UTC)),
			Link:        "https://example.com/event1",
		},
		{
			Name:        "Test Event 2 - California",
			Description: "Test event in California",
			Date:        models.DateYMD(time.Date(2024, 2, 10, 0, 0, 0, 0, time.UTC)),
			Location:    "123 Main St, San Francisco, CA 94102, USA",
			ExpiresAt:   models.DateYMD(time.Date(2024, 2, 15, 0, 0, 0, 0, time.UTC)),
			Link:        "https://example.com/event2",
		},
		{
			Name:        "Test Event 3 - New York",
			Description: "Test event in New York",
			Date:        models.DateYMD(time.Date(2024, 3, 5, 0, 0, 0, 0, time.UTC)),
			Location:    "456 Broadway, New York, NY 10013, USA",
			ExpiresAt:   models.DateYMD(time.Date(2024, 3, 10, 0, 0, 0, 0, time.UTC)),
			Link:        "https://example.com/event3",
		},
		{
			Name:        "Test Event 4 - Canada",
			Description: "Test event in Canada",
			Date:        models.DateYMD(time.Date(2024, 4, 1, 0, 0, 0, 0, time.UTC)),
			Location:    "789 Queen St, Toronto, ON M5H 2N2, Canada",
			ExpiresAt:   models.DateYMD(time.Date(2024, 4, 5, 0, 0, 0, 0, time.UTC)),
			Link:        "https://example.com/event4",
		},
	}

	// Insert test events
	for _, event := range testEvents {
		_, err := store.CreateEvent(ctx, event)
		if err != nil {
			t.Fatalf("Failed to create test event: %v", err)
		}
	}

	t.Run("Filter by State - DC", func(t *testing.T) {
		filter := models.EventFilter{State: "DC"}
		events, err := store.GetEventsWithFilter(ctx, filter)
		if err != nil {
			t.Fatalf("Error filtering events: %v", err)
		}
		if len(events) != 1 {
			t.Fatalf("Expected 1 event, got %d", len(events))
		}
		if events[0].Name != "Test Event 1 - Washington DC" {
			t.Fatalf("Expected 'Test Event 1 - Washington DC', got '%s'", events[0].Name)
		}
	})

	t.Run("Filter by State - CA", func(t *testing.T) {
		filter := models.EventFilter{State: "CA"}
		events, err := store.GetEventsWithFilter(ctx, filter)
		if err != nil {
			t.Fatalf("Error filtering events: %v", err)
		}
		if len(events) != 1 {
			t.Fatalf("Expected 1 event, got %d", len(events))
		}
		if events[0].Name != "Test Event 2 - California" {
			t.Fatalf("Expected 'Test Event 2 - California', got '%s'", events[0].Name)
		}
	})

	t.Run("Filter by Country - USA", func(t *testing.T) {
		filter := models.EventFilter{Country: "USA"}
		events, err := store.GetEventsWithFilter(ctx, filter)
		if err != nil {
			t.Fatalf("Error filtering events: %v", err)
		}
		if len(events) != 3 {
			t.Fatalf("Expected 3 events, got %d", len(events))
		}
	})

	t.Run("Filter by Country - Canada", func(t *testing.T) {
		filter := models.EventFilter{Country: "Canada"}
		events, err := store.GetEventsWithFilter(ctx, filter)
		if err != nil {
			t.Fatalf("Error filtering events: %v", err)
		}
		if len(events) != 1 {
			t.Fatalf("Expected 1 event, got %d", len(events))
		}
		if events[0].Name != "Test Event 4 - Canada" {
			t.Fatalf("Expected 'Test Event 4 - Canada', got '%s'", events[0].Name)
		}
	})

	t.Run("Filter by Date Range", func(t *testing.T) {
		startDate := models.DateYMD(time.Date(2024, 2, 1, 0, 0, 0, 0, time.UTC))
		endDate := models.DateYMD(time.Date(2024, 3, 31, 0, 0, 0, 0, time.UTC))
		filter := models.EventFilter{
			StartDate: &startDate,
			EndDate:   &endDate,
		}
		events, err := store.GetEventsWithFilter(ctx, filter)
		if err != nil {
			t.Fatalf("Error filtering events: %v", err)
		}
		if len(events) != 2 {
			t.Fatalf("Expected 2 events, got %d", len(events))
		}
	})

	t.Run("Filter by Name Contains", func(t *testing.T) {
		filter := models.EventFilter{NameContains: "Washington"}
		events, err := store.GetEventsWithFilter(ctx, filter)
		if err != nil {
			t.Fatalf("Error filtering events: %v", err)
		}
		if len(events) != 1 {
			t.Fatalf("Expected 1 event, got %d", len(events))
		}
		if events[0].Name != "Test Event 1 - Washington DC" {
			t.Fatalf("Expected 'Test Event 1 - Washington DC', got '%s'", events[0].Name)
		}
	})

	t.Run("Filter by Multiple Criteria", func(t *testing.T) {
		filter := models.EventFilter{
			Country: "USA",
			State:   "NY",
		}
		events, err := store.GetEventsWithFilter(ctx, filter)
		if err != nil {
			t.Fatalf("Error filtering events: %v", err)
		}
		if len(events) != 1 {
			t.Fatalf("Expected 1 event, got %d", len(events))
		}
		if events[0].Name != "Test Event 3 - New York" {
			t.Fatalf("Expected 'Test Event 3 - New York', got '%s'", events[0].Name)
		}
	})

	t.Run("Filter by Time Interval - Month", func(t *testing.T) {
		// This test uses current time, so we'll create an event for today
		today := time.Now()
		todayEvent := models.Event{
			Name:        "Test Event Today",
			Description: "Test event happening today",
			Date:        models.DateYMD(today),
			Location:    "100 Test St, Test City, TS 12345, USA",
			ExpiresAt:   models.DateYMD(today.AddDate(0, 0, 1)),
			Link:        "https://example.com/today",
		}
		_, err := store.CreateEvent(ctx, todayEvent)
		if err != nil {
			t.Fatalf("Failed to create today event: %v", err)
		}

		filter := models.EventFilter{TimeInterval: "month"}
		events, err := store.GetEventsWithFilter(ctx, filter)
		if err != nil {
			t.Fatalf("Error filtering events: %v", err)
		}
		// Should include the event we just created
		found := false
		for _, event := range events {
			if event.Name == "Test Event Today" {
				found = true
				break
			}
		}
		if !found {
			t.Fatal("Should find the event created today")
		}
	})

	// Clean up test data
	pool.Exec(ctx, "DELETE FROM events WHERE name LIKE 'Test Event%'")
}
