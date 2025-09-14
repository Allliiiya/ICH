// store/event.go
package store

import (
	"chinese-heritage-backend/models"
	"context"
)

type EventStore interface {
	CreateEvent(ctx context.Context, event models.Event) (int, error)
	CreateEventAll(ctx context.Context, event []models.Event) (int, error)
	GetEventByID(ctx context.Context, id int) (*models.Event, error)
	GetAllEvents(ctx context.Context) ([]models.Event, error)
	GetEventsWithFilter(ctx context.Context, filter models.EventFilter) ([]models.Event, error)
	GetEventsWithFilterPaginated(ctx context.Context, filter models.EventFilter) (*models.EventResponse, error)
	DeleteEventByID(ctx context.Context, id int) error
	DeleteExpiredEvents(ctx context.Context) error
}
