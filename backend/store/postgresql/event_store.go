package postgresql

import (
	"chinese-heritage-backend/models"
	"context"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresEventStore struct {
	pool *pgxpool.Pool
}

func (s *PostgresEventStore) DeleteEventByID(ctx context.Context, id int) error {
	query := `DELETE FROM events WHERE id = $1`
	_, err := s.pool.Exec(ctx, query, id)
	return err
}

func (s *PostgresEventStore) GetEventByID(ctx context.Context, id int) (*models.Event, error) {
	var event models.Event
	var date, expiresAt time.Time
	query := `
		SELECT id, name, description, date, location, expires_at, link
		FROM events
		WHERE id = $1
	`
	row := s.pool.QueryRow(ctx, query, id)
	err := row.Scan(
		&event.ID,
		&event.Name,
		&event.Description,
		&date,
		&event.Location,
		&expiresAt,
		&event.Link,
	)
	if err != nil {
		return nil, err
	}
	// convert to DateYMD
	event.Date = models.DateYMD(date)
	event.ExpiresAt = models.DateYMD(expiresAt)
	return &event, nil
}

func (s *PostgresEventStore) GetAllEvents(ctx context.Context) ([]models.Event, error) {
	query := `
		SELECT id, name, description, date, location, expires_at, link
		FROM events
	`
	rows, err := s.pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []models.Event
	for rows.Next() {
		var event models.Event
		var date, expiresAt time.Time

		err := rows.Scan(
			&event.ID,
			&event.Name,
			&event.Description,
			&date, // scan into time.Time first
			&event.Location,
			&expiresAt, // scan into time.Time first
			&event.Link,
		)
		if err != nil {
			return nil, err
		}

		// convert to DateYMD
		event.Date = models.DateYMD(date)
		event.ExpiresAt = models.DateYMD(expiresAt)

		events = append(events, event)
	}

	if rows.Err() != nil {
		return nil, rows.Err()
	}

	return events, nil
}

func (s *PostgresEventStore) GetEventsWithFilter(ctx context.Context, filter models.EventFilter) ([]models.Event, error) {
	// Build the query dynamically based on filter criteria
	query := `
		SELECT id, name, description, date, location, expires_at, link
		FROM events
		WHERE 1=1`

	args := []interface{}{}
	argIndex := 1

	// Add location filters
	if filter.State != "" {
		query += fmt.Sprintf(" AND location ILIKE $%d", argIndex)
		args = append(args, "%"+filter.State+"%")
		argIndex++
	}

	if filter.Country != "" {
		query += fmt.Sprintf(" AND location ILIKE $%d", argIndex)
		args = append(args, "%"+filter.Country+"%")
		argIndex++
	}

	// Add name filter
	if filter.NameContains != "" {
		query += fmt.Sprintf(" AND name ILIKE $%d", argIndex)
		args = append(args, "%"+filter.NameContains+"%")
		argIndex++
	}

	// Add date filters
	startDate, endDate := filter.GetDateRange()
	if startDate != nil {
		query += fmt.Sprintf(" AND date >= $%d", argIndex)
		args = append(args, startDate.Time())
		argIndex++
	}

	if endDate != nil {
		query += fmt.Sprintf(" AND date <= $%d", argIndex)
		args = append(args, endDate.Time())
		argIndex++
	}

	// Add ordering
	query += " ORDER BY date ASC"

	// Execute query
	rows, err := s.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []models.Event
	for rows.Next() {
		var event models.Event
		var date, expiresAt time.Time

		err := rows.Scan(
			&event.ID,
			&event.Name,
			&event.Description,
			&date,
			&event.Location,
			&expiresAt,
			&event.Link,
		)
		if err != nil {
			return nil, err
		}

		// Convert to DateYMD
		event.Date = models.DateYMD(date)
		event.ExpiresAt = models.DateYMD(expiresAt)

		events = append(events, event)
	}

	if rows.Err() != nil {
		return nil, rows.Err()
	}

	return events, nil
}

func (s *PostgresEventStore) GetEventsWithFilterPaginated(ctx context.Context, filter models.EventFilter) (*models.EventResponse, error) {
	// Set default pagination values
	if filter.Page <= 0 {
		filter.Page = 1
	}
	if filter.PageSize <= 0 {
		filter.PageSize = 10
	}

	// Build the base query for counting total records
	countQuery := `
		SELECT COUNT(*)
		FROM events
		WHERE 1=1`

	// Build the main query for fetching records
	query := `
		SELECT id, name, description, date, location, expires_at, link
		FROM events
		WHERE 1=1`

	args := []interface{}{}
	argIndex := 1

	// Add location filters
	if filter.State != "" {
		query += fmt.Sprintf(" AND location ILIKE $%d", argIndex)
		countQuery += fmt.Sprintf(" AND location ILIKE $%d", argIndex)
		args = append(args, "%"+filter.State+"%")
		argIndex++
	}

	if filter.Country != "" {
		query += fmt.Sprintf(" AND location ILIKE $%d", argIndex)
		countQuery += fmt.Sprintf(" AND location ILIKE $%d", argIndex)
		args = append(args, "%"+filter.Country+"%")
		argIndex++
	}

	// Add name filter
	if filter.NameContains != "" {
		query += fmt.Sprintf(" AND name ILIKE $%d", argIndex)
		countQuery += fmt.Sprintf(" AND name ILIKE $%d", argIndex)
		args = append(args, "%"+filter.NameContains+"%")
		argIndex++
	}

	// Add date filters
	startDate, endDate := filter.GetDateRange()
	if startDate != nil {
		query += fmt.Sprintf(" AND date >= $%d", argIndex)
		countQuery += fmt.Sprintf(" AND date >= $%d", argIndex)
		args = append(args, startDate.Time())
		argIndex++
	}

	if endDate != nil {
		query += fmt.Sprintf(" AND date <= $%d", argIndex)
		countQuery += fmt.Sprintf(" AND date <= $%d", argIndex)
		args = append(args, endDate.Time())
		argIndex++
	}

	// Add ordering
	query += " ORDER BY date ASC"

	// Add pagination
	offset := (filter.Page - 1) * filter.PageSize
	query += fmt.Sprintf(" LIMIT $%d OFFSET $%d", argIndex, argIndex+1)
	args = append(args, filter.PageSize, offset)

	// Execute count query
	var total int
	err := s.pool.QueryRow(ctx, countQuery, args[:len(args)-2]...).Scan(&total)
	if err != nil {
		return nil, err
	}

	// Execute main query
	rows, err := s.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []models.Event
	for rows.Next() {
		var event models.Event
		var date, expiresAt time.Time

		err := rows.Scan(
			&event.ID,
			&event.Name,
			&event.Description,
			&date,
			&event.Location,
			&expiresAt,
			&event.Link,
		)
		if err != nil {
			return nil, err
		}

		// Convert to DateYMD
		event.Date = models.DateYMD(date)
		event.ExpiresAt = models.DateYMD(expiresAt)

		events = append(events, event)
	}

	if rows.Err() != nil {
		return nil, rows.Err()
	}

	// Calculate total pages
	totalPages := (total + filter.PageSize - 1) / filter.PageSize

	return &models.EventResponse{
		Events:     events,
		Total:      total,
		Page:       filter.Page,
		PageSize:   filter.PageSize,
		TotalPages: totalPages,
	}, nil
}

func (s *PostgresEventStore) DeleteExpiredEvents(ctx context.Context) error {
	query := `DELETE FROM events WHERE expires_at IS NOT NULL AND expires_at < $1`
	_, err := s.pool.Exec(ctx, query, time.Now())
	return err
}

func (s *PostgresEventStore) CreateEvent(ctx context.Context, event models.Event) (int, error) {
	var id int
	err := s.pool.QueryRow(
		ctx,
		`INSERT INTO events (name, description, date, location, expires_at, link)
		 VALUES ($1, $2, $3, $4, $5, $6)
		 RETURNING id`,
		event.Name,
		event.Description,
		event.Date.Time(), // convert to time.Time
		event.Location,
		event.ExpiresAt.Time(), // convert to time.Time
		event.Link,
	).Scan(&id)
	log.Printf("Created event: %v", event.Name)
	return id, err
}

func (s *PostgresEventStore) CreateEventAll(ctx context.Context, events []models.Event) (int, error) {
	if len(events) == 0 {
		return 0, nil
	}

	values := []interface{}{}
	placeholders := []string{}

	for i, e := range events {
		start := i*6 + 1
		placeholders = append(placeholders, fmt.Sprintf("($%d,$%d,$%d,$%d,$%d,$%d)", start, start+1, start+2, start+3, start+4, start+5))
		values = append(values,
			e.Name,
			e.Description,
			e.Date.Time(), // convert to time.Time
			e.Location,
			e.ExpiresAt.Time(), // convert to time.Time
			e.Link,
		)
	}

	query := fmt.Sprintf(
		"INSERT INTO events (name, description, date, location, expires_at, link) VALUES %s RETURNING id",
		strings.Join(placeholders, ","),
	)

	rows, err := s.pool.Query(ctx, query, values...)
	if err != nil {
		return 0, err
	}
	defer rows.Close()

	var lastID int
	for rows.Next() {
		if err := rows.Scan(&lastID); err != nil {
			return 0, err
		}
	}

	return lastID, nil
}
