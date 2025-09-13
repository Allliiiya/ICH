package postgresql

import (
	"context"
	"testing"
	"time"
	
	"github.com/jackc/pgx/v5/pgxpool"
	"chinese-heritage-backend/models"

    "github.com/joho/godotenv"
    "os"
)


func setupTestDB(t *testing.T) (*pgxpool.Pool, func()) {
    t.Helper()
    if err := godotenv.Load("../../.env"); err != nil {
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

    // Create events table if it doesn't exist
    _, err = pool.Exec(ctx, `
        CREATE TABLE IF NOT EXISTS events (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            date DATE,
            location TEXT,
            expires_at DATE,
            link TEXT
        );
    `)
    if err != nil {
        t.Fatalf("failed to create events table: %v", err)
    }

    // Clean table before test
    _, err = pool.Exec(ctx, `TRUNCATE TABLE events RESTART IDENTITY CASCADE;`)
    if err != nil {
        t.Fatalf("failed to truncate events table: %v", err)
    }

    cleanup := func() {
        pool.Close()
    }

    return pool, cleanup
}


func TestCreateAndGetEvent(t *testing.T) {
    pool, cleanup := setupTestDB(t)
    defer cleanup()

    store := &PostgresEventStore{pool: pool}
    ctx := context.Background()
    event := models.Event{
        Name:      "Test Event",
        Date:      models.DateYMD(time.Now()),
        Location:  "NYC",
        ExpiresAt: models.DateYMD(time.Now().Add(24 * time.Hour)),
        Description: "This is a test event",
        Link:      "http://example.com",
    }

    if _, err := store.CreateEvent(ctx, event); err != nil {
        t.Fatalf("CreateEvent failed: %v", err)
    }

    events, err := store.GetAllEvents(ctx)
    if err != nil {
        t.Fatalf("GetAllEvents failed: %v", err)
    }
    if len(events) != 1 || events[0].Name != "Test Event" {
        t.Errorf("expected 1 event with correct name, got %+v", events)
    }
}

func TestDeleteExpiredEvents(t *testing.T) {
    pool, cleanup := setupTestDB(t)
    defer cleanup()

    store := &PostgresEventStore{pool: pool}
    ctx := context.Background()

    // Insert an expired event
    expiredEvent := models.Event{
        Name:      "Expired Event",
        Date:      models.DateYMD(time.Now().Add(-48 * time.Hour)),
        Location:  "LA",
        ExpiresAt: models.DateYMD(time.Now().Add(-24 * time.Hour)),
        Description: "This event is expired",
        Link:      "http://expired.com",
    }
    if _, err := store.CreateEvent(ctx, expiredEvent); err != nil {
        t.Fatalf("CreateEvent failed: %v", err)
    }

    // Insert a valid event
    validEvent := models.Event{
        Name:      "Valid Event",
        Date:      models.DateYMD(time.Now()),
        Location:  "SF",
        ExpiresAt: models.DateYMD(time.Now().Add(24 * time.Hour)),
        Description: "This event is valid",
        Link:      "http://valid.com",
    }
    if _, err := store.CreateEvent(ctx, validEvent); err != nil {
        t.Fatalf("CreateEvent failed: %v", err)
    }

    // Delete expired events
    if err := store.DeleteExpiredEvents(ctx); err != nil {
        t.Fatalf("DeleteExpiredEvents failed: %v", err)
    }

    // Verify only the valid event remains
    events, err := store.GetAllEvents(ctx)
    if err != nil {
        t.Fatalf("GetAllEvents failed: %v", err)
    }
    if len(events) != 1 || events[0].Name != "Valid Event" {
        t.Errorf("expected 1 valid event, got %+v", events)
    }
}

func TestGetEventByID(t *testing.T) {
    pool, cleanup := setupTestDB(t)
    defer cleanup()

    store := &PostgresEventStore{pool: pool}
    ctx := context.Background()
    event := models.Event{
        Name:      "Test Event",
        Date:      models.DateYMD(time.Now()),
        Location:  "NYC",
        ExpiresAt: models.DateYMD(time.Now().Add(24 * time.Hour)),
        Description: "This is a test event",
        Link:      "http://example.com",
    }

    id, err := store.CreateEvent(ctx, event)
    if err != nil {
        t.Fatalf("CreateEvent failed: %v", err)
    }

    retrievedEvent, err := store.GetEventByID(ctx, id)
    if err != nil {
        t.Fatalf("GetEventByID failed: %v", err)
    }
    if retrievedEvent.Name != "Test Event" {
        t.Errorf("expected event name 'Test Event', got '%s'", retrievedEvent.Name)
    }
}

func TestDeleteEventByID(t *testing.T) {
    pool, cleanup := setupTestDB(t)
    defer cleanup()

    store := &PostgresEventStore{pool: pool}
    ctx := context.Background()
    event := models.Event{
        Name:      "Test Event",
        Date:      models.DateYMD(time.Now()),
        Location:  "NYC",
        ExpiresAt: models.DateYMD(time.Now().Add(24 * time.Hour)),
        Description: "This is a test event",
        Link:      "http://example.com",
    }

    id, err := store.CreateEvent(ctx, event)
    if err != nil {
        t.Fatalf("CreateEvent failed: %v", err)
    }

    if err := store.DeleteEventByID(ctx, id); err != nil {
        t.Fatalf("DeleteEventByID failed: %v", err)
    }

    _, err = store.GetEventByID(ctx, id)        
    if err == nil {
        t.Fatalf("expected error when getting deleted event, got nil")
    }
}


