package tests 

import (
	"context"
	"testing"
	"github.com/joho/godotenv"
	"github.com/jackc/pgx/v5/pgxpool"
	"chinese-heritage-backend/server"
	"chinese-heritage-backend/store/mock"
	"chinese-heritage-backend/models"
	"net/http"
	"strings"
	"encoding/json"
	"fmt"
	"os"
	"chinese-heritage-backend/handlers"
	"github.com/golang-jwt/jwt/v5"
)

func SetupTestDB(t *testing.T) (*pgxpool.Pool, func()) {
    t.Helper()
    if err := godotenv.Load("../.env"); err != nil {
        t.Fatalf("failed to load .env file: %v", err)
    }
    testDBURL := os.Getenv("DATABASE_TEST_URL")
    if testDBURL == "" {
        t.Fatalf("missing DATABASE_TEST_URL in .env; required for tests")
    }

    ctx := context.Background()
    pool, err := pgxpool.New(ctx, testDBURL)
    if err != nil {
        t.Fatalf("failed to connect to test db: %v", err)
    }

    tables := []string{"users"} // add your tables here
    for _, table := range tables {
        _, err := pool.Exec(ctx, fmt.Sprintf("TRUNCATE TABLE %s RESTART IDENTITY CASCADE;", table))
        if err != nil {
            t.Fatalf("failed to truncate table %s: %v", table, err)
        }
    }

    cleanup := func() {
        pool.Close()
    }

    return pool, cleanup
}

func SetupMockServer() (*server.Server, *mock.MockStore) {
	store := mock.NewMockStore()
	server, _ := server.NewServer(store)
	return server, store
}
func AssertStatusCode(t testing.TB, got, want int) {
	t.Helper()
	if got != want {
		t.Errorf("got status %d want %d", got, want)
	}
}

func SignupRequest(t *testing.T, method string, cred models.SignupCredential) *http.Request {
	t.Helper()
	jsonStr := CreateJSON(t, cred)
    req, err := http.NewRequest(method, "/api/signup", strings.NewReader(jsonStr))
    if err != nil {
        t.Fatalf("failed to create login request: %v", err)
    }
    req.Header.Set("Content-Type", "application/json")
    return req
}

func LoginRequest(t *testing.T, method string, cred models.LoginCredential) *http.Request {
	t.Helper()
	jsonStr := CreateJSON(t, cred)
    req, err := http.NewRequest(method, "/api/login", strings.NewReader(jsonStr))
    if err != nil {
        t.Fatalf("failed to create login request: %v", err)
    }
    req.Header.Set("Content-Type", "application/json")
    return req
}

func CreateJSON(t *testing.T, cred interface{}) string {
	t.Helper()
	b, err := json.Marshal(cred)
	if err != nil {
		t.Fatal("json marshal error:", err)
		return ""
	}
	return string(b)
}

func ParseJSON(body *strings.Reader, v interface{}) error {
	return json.NewDecoder(body).Decode(v)
}

func CreateEventAllRequest(t *testing.T, method string, event interface{}) *http.Request {
	t.Helper()
	jsonStr := CreateJSON(t, event)
	request, err := http.NewRequest(http.MethodPost, "/api/events", strings.NewReader(jsonStr))
	if err != nil {
		t.Fatalf("failed to create event request: %v", err)
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &handlers.Claims{
		IsAdmin: true,
	})
	tokenStr, _ := token.SignedString(handlers.JwtKey)
	request.Header.Set("Authorization", tokenStr)
	request.Header.Set("Content-Type", "application/json")
	return request
}
func CreateEventRequest(t *testing.T, method string, event interface{}) *http.Request {
	t.Helper()
	jsonStr := CreateJSON(t, event)
	request, err := http.NewRequest(http.MethodPost, "/api/event", strings.NewReader(jsonStr))
	if err != nil {
		t.Fatalf("failed to create event request: %v", err)
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &handlers.Claims{
		IsAdmin: true,
	})
	tokenStr, _ := token.SignedString(handlers.JwtKey)
	request.Header.Set("Authorization", tokenStr)
	request.Header.Set("Content-Type", "application/json")
	return request
}

func CreateDeleteEventRequest(t *testing.T, method, id string) *http.Request {
	t.Helper()
	request, err := http.NewRequest(http.MethodDelete, "/api/event/" + id, nil)
	if err != nil {
		t.Fatalf("failed to create delete event request: %v", err)
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &handlers.Claims{
		IsAdmin: true,
	})
	tokenStr, _ := token.SignedString(handlers.JwtKey)
	request.Header.Set("Authorization", tokenStr)
	request.Header.Set("Content-Type", "application/json")
	return request
}

func CreateDeleteExpiredEventsRequest(t *testing.T, method string) *http.Request {
	t.Helper()
	request, err := http.NewRequest(http.MethodDelete, "/api/events", nil)
	if err != nil {
		t.Fatalf("failed to create delete expired events request: %v", err)
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &handlers.Claims{
		IsAdmin: true,
	})
	tokenStr, _ := token.SignedString(handlers.JwtKey)
	request.Header.Set("Authorization", tokenStr)
	request.Header.Set("Content-Type", "application/json")
	return request
}