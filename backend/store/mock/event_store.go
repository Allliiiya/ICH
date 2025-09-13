package mock

import (
	"context"
	"chinese-heritage-backend/models"
	"chinese-heritage-backend/store"
	"errors"
	"time"
)

type FakeEventStore struct {
	Events map[int]models.Event // Keyed by event ID
	id     int
}

func NewFakeEventStore() *FakeEventStore {
	return &FakeEventStore {
		Events: make(map[int]models.Event),
		id: 0,
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
