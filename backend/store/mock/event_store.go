package mock

import (
	"chinese-heritage-backend/models"
	"chinese-heritage-backend/store"
	"context"
	"errors"
	"time"
)

type FakeEventStore struct {
	Events map[int]models.Event // Keyed by event ID
	id     int
}

func NewFakeEventStore() *FakeEventStore {
	return &FakeEventStore{
		Events: make(map[int]models.Event),
		id:     0,
	}
}

func (e *FakeEventStore) Len() int {
	return len(e.Events)
}

func (e *FakeEventStore) CreateEvent(ctx context.Context, event models.Event) (int, error) {
	event.ID = e.id
	e.Events[e.id] = event
	e.id++
	return event.ID, nil
}

func (e *FakeEventStore) GetEventsWithFilter(ctx context.Context, filter models.EventFilter) ([]models.Event, error) {
	return []models.Event{}, nil
}

func (e *FakeEventStore) GetEventsWithFilterPaginated(ctx context.Context, filter models.EventFilter) (*models.EventResponse, error) {
	// Set default pagination values
	if filter.Page <= 0 {
		filter.Page = 1
	}
	if filter.PageSize <= 0 {
		filter.PageSize = 10
	}

	// Get all events and apply filters
	allEvents := make([]models.Event, 0, len(e.Events))
	for _, event := range e.Events {
		allEvents = append(allEvents, event)
	}

	// Apply filters (simplified for mock)
	filteredEvents := make([]models.Event, 0)
	for _, event := range allEvents {
		// Apply location filters
		if filter.State != "" && !contains(event.Location, filter.State) {
			continue
		}
		if filter.Country != "" && !contains(event.Location, filter.Country) {
			continue
		}

		// Apply name filter
		if filter.NameContains != "" && !contains(event.Name, filter.NameContains) {
			continue
		}

		// Apply time filters (simplified)
		if filter.TimeInterval != "" {
			now := time.Now()
			eventTime := time.Time(event.Date)

			switch filter.TimeInterval {
			case "day":
				if !isSameDay(eventTime, now) {
					continue
				}
			case "week":
				if eventTime.Before(now) || eventTime.After(now.AddDate(0, 0, 7)) {
					continue
				}
			case "month":
				if eventTime.Before(now) || eventTime.After(now.AddDate(0, 1, 0)) {
					continue
				}
			case "year":
				if eventTime.Before(now) || eventTime.After(now.AddDate(1, 0, 0)) {
					continue
				}
			}
		}

		filteredEvents = append(filteredEvents, event)
	}

	// Apply pagination
	total := len(filteredEvents)
	totalPages := (total + filter.PageSize - 1) / filter.PageSize

	start := (filter.Page - 1) * filter.PageSize
	end := start + filter.PageSize
	if end > total {
		end = total
	}

	var paginatedEvents []models.Event
	if start < total {
		paginatedEvents = filteredEvents[start:end]
	}

	return &models.EventResponse{
		Events:     paginatedEvents,
		Total:      total,
		Page:       filter.Page,
		PageSize:   filter.PageSize,
		TotalPages: totalPages,
	}, nil
}

// Helper functions for mock filtering
func contains(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr ||
		(len(s) > len(substr) && (s[:len(substr)] == substr ||
			s[len(s)-len(substr):] == substr ||
			containsSubstring(s, substr))))
}

func containsSubstring(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}

func isSameDay(t1, t2 time.Time) bool {
	y1, m1, d1 := t1.Date()
	y2, m2, d2 := t2.Date()
	return y1 == y2 && m1 == m2 && d1 == d2
}

func (f *FakeEventStore) CreateEventAll(ctx context.Context, events []models.Event) (int, error) {
	if len(events) == 0 {
		return 0, nil
	}

	var lastID int
	for _, e := range events {
		e.ID = f.id
		f.Events[f.id] = e
		lastID = f.id
		f.id++
	}

	return lastID, nil
}

func (e *FakeEventStore) GetEventByID(ctx context.Context, id int) (*models.Event, error) {
	event, ok := e.Events[id]
	if !ok {
		return nil, errors.New("event not found")
	}
	return &event, nil
}

func (e *FakeEventStore) GetAllEvents(ctx context.Context) ([]models.Event, error) {
	events := make([]models.Event, 0, len(e.Events))
	for _, event := range e.Events {
		events = append(events, event)
	}
	return events, nil
}

func (e *FakeEventStore) DeleteEventByID(ctx context.Context, id int) error {
	_, ok := e.Events[id]
	if !ok {
		return store.ErrIDNotFound
	}
	delete(e.Events, id)
	return nil
}

func (e *FakeEventStore) DeleteExpiredEvents(ctx context.Context) error {
	for id, event := range e.Events {
		if time.Time(event.ExpiresAt).Before(time.Now()) {
			delete(e.Events, id)
		}
	}
	return nil
}
