package models

import (
	"time"
	"encoding/json"
    "strings"
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
	ID			int    		`json:"id"`
	Name		string 		`json:"name"`
	Description string 		`json:"description"`
	Date 		DateYMD 	`json:"date"`
	Location	string 		`json:"location"`
	ExpiresAt   DateYMD 	`json:"expires_at"` 
	Link 	    string      `json:"link"`       // link that redirects to more info
} 

type EventInput struct {
    Name        string `json:"name"`
    Description string `json:"description"`
    Date        string `json:"date"`
    Location    string `json:"location"`
    ExpiresAt   string `json:"expires_at"` // optional in input
    Link        string `json:"link"`
}

func (in EventInput) ToEvent() (Event, error) {
    var event Event
    event.Name = in.Name
    event.Description = in.Description
    event.Location = in.Location
    event.Link = in.Link

    if (event.Name == "") {
        return Event{}, ErrMissingName
    }

    if (event.Location == "") {
        return Event{}, ErrMissingLocation
    }

    if (event.Link == "") {
        return Event{}, ErrMissingLink
    }

    if (event.Description == "") {
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