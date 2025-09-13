package handlers_test

import (
	"testing"
	"net/http"
	"net/http/httptest"	
	"chinese-heritage-backend/store/mock"
	"chinese-heritage-backend/models"
	"chinese-heritage-backend/server"
	"chinese-heritage-backend/tests"
)

func TestUserSignup(t *testing.T) {
	alice_signup_cred := models.SignupCredential{
		Name: "Alice",
		Email: "a@example.com",
		Password: "secret",
	}
	t.Run("it create a new user", func(t *testing.T) {
		store := mock.NewMockStore()
		f, ok := store.UserStore().(*mock.FakeUserStore)
		if !ok {
			t.Fatalf("store is not a FakeUserStore")
		}
		s, _ := server.NewServer(store)
		response := httptest.NewRecorder()
		request := tests.SignupRequest(t, http.MethodPost, alice_signup_cred)
		s.ServeHTTP(response, request)
		tests.AssertStatusCode(t, response.Code, http.StatusOK)
		if f.Len() < 1 {
			t.Errorf("new user was not added")
		}
	})
	t.Run("it shouldn't create a new user on non post request", func(t *testing.T) {
		store := mock.NewMockStore()
		server, _ := server.NewServer(store)
		response := httptest.NewRecorder()
		request := tests.SignupRequest(t, http.MethodGet, alice_signup_cred)
		server.ServeHTTP(response, request)
		tests.AssertStatusCode(t, response.Code, http.StatusMethodNotAllowed)
	})
	t.Run("it should not store user password", func(t *testing.T) {
		store := mock.NewMockStore()
		server, _ := server.NewServer(store)
		response := httptest.NewRecorder()
		request := tests.SignupRequest(t, http.MethodPost, alice_signup_cred)
		server.ServeHTTP(response, request)
		got, err := store.UserStore().GetUserByEmail(nil, alice_signup_cred.Email)
		if err != nil {
			t.Errorf("user shouldve exist")
		}
		if got.Password == alice_signup_cred.Password {
			t.Errorf("server shouldn't store user actual password")
		}
	})
	t.Run("it should should prohibit duplicate username", func(t *testing.T) {
		server, _ := tests.SetupMockServer()
		response := httptest.NewRecorder()
		request := tests.SignupRequest(t, http.MethodPost, alice_signup_cred)
		server.ServeHTTP(response, request)
		tests.AssertStatusCode(t, response.Code, http.StatusOK)

		request = tests.SignupRequest(t, http.MethodPost, alice_signup_cred)
		response = httptest.NewRecorder()
		server.ServeHTTP(response, request)
		tests.AssertStatusCode(t, response.Code, http.StatusConflict)
	})

}

func TestUserLogin(t *testing.T) {
	alice_signup_cred := models.SignupCredential{
		Name: "Alice",
		Email: "a@example.com",
		Password: "secret",
	}
	alice_login_cred := models.LoginCredential {
		Email: "a@example.com",
		Password: "secret",
	}
	t.Run("it should log user in", func(t *testing.T) {
		server, _ := tests.SetupMockServer()
		response := httptest.NewRecorder()


		// create the new user
		request := tests.SignupRequest(t, http.MethodPost, alice_signup_cred)
		server.ServeHTTP(response, request)
		tests.AssertStatusCode(t, response.Code, http.StatusOK)

		// attemmpt to login
		request = tests.LoginRequest(t, http.MethodPost, alice_login_cred)
		server.ServeHTTP(response, request)
		tests.AssertStatusCode(t, response.Code, http.StatusOK)
	})
	t.Run("it should not log user in on non post request", func(t *testing.T) {
		server, _ := tests.SetupMockServer()
		response := httptest.NewRecorder()

		// create the new user
		request := tests.SignupRequest(t, http.MethodPost, alice_signup_cred)
		server.ServeHTTP(response, request)
		tests.AssertStatusCode(t, response.Code, http.StatusOK)

		// attemmpt to login
		request = tests.LoginRequest(t, http.MethodGet, alice_login_cred)
		response = httptest.NewRecorder()
		server.ServeHTTP(response, request)
		tests.AssertStatusCode(t, response.Code, http.StatusMethodNotAllowed)
	})
}


