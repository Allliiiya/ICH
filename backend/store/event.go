// store/event.go
package store

import (
	"context"
	"chinese-heritage-backend/models"
)

type EventStore interface {
	CreateEvent(ctx context.Context, event models.Event) (int, error)
	CreateEventAll(ctx context.Context, event []models.Event) (int, error)
	GetEventByID(ctx context.Context, id int) (*models.Event, error)
	GetAllEvents(ctx context.Context) ([]models.Event, error)
	DeleteEventByID(ctx context.Context, id int) error
	DeleteExpiredEvents(ctx context.Context) error
}
