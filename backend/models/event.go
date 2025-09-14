package models

import (
	"encoding/json"
	"strings"
	"time"
)

type DateYMD time.Time

// Time converts DateYMD to time.Time at midnight UTC
func (d DateYMD) Time() time.Time {
	t := time.Time(d)
	return time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, time.UTC)
}

// UnmarshalJSON parses a "YYYY-MM-DD" JSON string into DateYMD
func (d *DateYMD) UnmarshalJSON(b []byte) error {
	s := strings.Trim(string(b), `"`) // remove quotes safely
	t, err := time.Parse("2006-01-02", s)
	if err != nil {
		return err
	}
	*d = DateYMD(t)
	return nil
}

// MarshalJSON formats DateYMD as "YYYY-MM-DD" JSON string
func (d DateYMD) MarshalJSON() ([]byte, error) {
	t := time.Time(d)
	return json.Marshal(t.Format("2006-01-02"))
}

const (
	DefaultDescription = "No description provided"
)

type Event struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Date        DateYMD `json:"date"`
	Location    string  `json:"location"`
	ExpiresAt   DateYMD `json:"expires_at"`
	Link        string  `json:"link"` // link that redirects to more info
}

type EventInput struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Date        string `json:"date"`
	Location    string `json:"location"`
	ExpiresAt   string `json:"expires_at"` // optional in input
	Link        string `json:"link"`
}

// EventFilter represents filtering criteria for events
type EventFilter struct {
	// Location filters
	State   string `json:"state,omitempty"`   // e.g., "DC", "CA", "NY"
	Country string `json:"country,omitempty"` // e.g., "USA", "Canada"

	// Time filters
	StartDate *DateYMD `json:"start_date,omitempty"` // inclusive start date
	EndDate   *DateYMD `json:"end_date,omitempty"`   // inclusive end date

	// Time interval presets (mutually exclusive with StartDate/EndDate)
	TimeInterval string `json:"time_interval,omitempty"` // "day", "week", "month", "year"

	// Additional filters
	NameContains string `json:"name_contains,omitempty"` // partial name match

	// Pagination
	Page     int `json:"page,omitempty"`
	PageSize int `json:"page_size,omitempty"` // number of items per page
}

type EventResponse struct {
	Events     []Event `json:"events"`
	Total      int     `json:"total"`
	Page       int     `json:"page"`
	PageSize   int     `json:"page_size"`
	TotalPages int     `json:"total_pages"`
}

// GetDateRange calculates the start and end dates based on TimeInterval
// If TimeInterval is set, it overrides StartDate and EndDate
func (f *EventFilter) GetDateRange() (*DateYMD, *DateYMD) {
	if f.TimeInterval != "" {
		now := time.Now()
		var startDate, endDate DateYMD

		switch f.TimeInterval {
		case "day":
			startDate = DateYMD(now)
			endDate = DateYMD(now)
		case "week":
			startDate = DateYMD(now)
			endDate = DateYMD(now.AddDate(0, 0, 7))
		case "month":
			startDate = DateYMD(now)
			endDate = DateYMD(now.AddDate(0, 1, 0))
		case "year":
			startDate = DateYMD(now)
			endDate = DateYMD(now.AddDate(1, 0, 0))
		default:
			// Invalid interval, return original dates
			return f.StartDate, f.EndDate
		}

		return &startDate, &endDate
	}

	return f.StartDate, f.EndDate
}

func (in EventInput) ToEvent() (Event, error) {
	var event Event
	event.Name = in.Name
	event.Description = in.Description
	event.Location = in.Location
	event.Link = in.Link

	if event.Name == "" {
		return Event{}, ErrMissingName
	}

	if event.Location == "" {
		return Event{}, ErrMissingLocation
	}

	if event.Link == "" {
		return Event{}, ErrMissingLink
	}

	if event.Description == "" {
		event.Description = DefaultDescription
	}

	if in.Date != "" {
		t, err := time.Parse("2006-01-02", in.Date)
		date := DateYMD(t)
		if err != nil {
			return Event{}, err
		}
		event.Date = date
	} else {
		return Event{}, ErrMissingDate
	}

	if in.ExpiresAt != "" {
		et, err := time.Parse("2006-01-02", in.ExpiresAt)
		date := DateYMD(et)
		if err != nil {
			return Event{}, err
		}
		event.ExpiresAt = date
	}

	if time.Time(event.Date).After(time.Time(event.ExpiresAt)) {
		event.ExpiresAt = event.Date
	}

	return event, nil
}
