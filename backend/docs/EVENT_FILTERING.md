# Event Filtering Documentation

This document describes the new event filtering functionality that allows users to retrieve events from the database with flexible filtering criteria.

## Overview

The `GetEventsWithFilter` method provides comprehensive filtering capabilities for events based on:
- **Location**: Filter by state, country, or full address
- **Time**: Filter by specific date ranges or predefined intervals (day, week, month)
- **Name**: Filter by partial name matches
- **Combined filters**: Use multiple criteria simultaneously

## EventFilter Structure

```go
type EventFilter struct {
    // Location filters
    State   string `json:"state,omitempty"`   // e.g., "DC", "CA", "NY"
    Country string `json:"country,omitempty"` // e.g., "USA", "Canada"
    
    // Time filters
    StartDate *DateYMD `json:"start_date,omitempty"` // inclusive start date
    EndDate   *DateYMD `json:"end_date,omitempty"`   // inclusive end date
    
    // Time interval presets (mutually exclusive with StartDate/EndDate)
    TimeInterval string `json:"time_interval,omitempty"` // "day", "week", "month"
    
    // Additional filters
    NameContains string `json:"name_contains,omitempty"` // partial name match
}
```

## Usage Examples

### 1. Filter by State

```go
// Find all events in Washington DC
filter := models.EventFilter{State: "DC"}
events, err := store.GetEventsWithFilter(ctx, filter)
```

This will match events with locations containing "DC", such as:
- "1600 Pennsylvania Ave NW, Washington, DC 20500, USA"

### 2. Filter by Country

```go
// Find all events in the United States
filter := models.EventFilter{Country: "USA"}
events, err := store.GetEventsWithFilter(ctx, filter)
```

This will match events with locations containing "USA".

### 3. Filter by Date Range

```go
// Find events in February 2024
startDate := models.DateYMD(time.Date(2024, 2, 1, 0, 0, 0, 0, time.UTC))
endDate := models.DateYMD(time.Date(2024, 2, 29, 0, 0, 0, 0, time.UTC))
filter := models.EventFilter{
    StartDate: &startDate,
    EndDate:   &endDate,
}
events, err := store.GetEventsWithFilter(ctx, filter)
```

### 4. Filter by Time Interval

```go
// Find events happening this week
filter := models.EventFilter{TimeInterval: "week"}
events, err := store.GetEventsWithFilter(ctx, filter)

// Find events happening this month
filter := models.EventFilter{TimeInterval: "month"}
events, err := store.GetEventsWithFilter(ctx, filter)

// Find events happening today
filter := models.EventFilter{TimeInterval: "day"}
events, err := store.GetEventsWithFilter(ctx, filter)
```

### 5. Filter by Name

```go
// Find events with "workshop" in the name
filter := models.EventFilter{NameContains: "workshop"}
events, err := store.GetEventsWithFilter(ctx, filter)
```

### 6. Combined Filters

```go
// Find workshops in California this month
filter := models.EventFilter{
    State:         "CA",
    TimeInterval: "month",
    NameContains: "workshop",
}
events, err := store.GetEventsWithFilter(ctx, filter)
```

## Location Format Support

The filtering system supports various location formats:

### Full Street Address
```
1600 Pennsylvania Ave NW, Washington, DC 20500, USA
123 Main St, San Francisco, CA 94102, USA
456 Broadway, New York, NY 10013, USA
```

### State/Province Filtering
- **State**: Use state abbreviations like "DC", "CA", "NY", "TX"
- **Country**: Use country names like "USA", "Canada", "Mexico"

### Case-Insensitive Matching
All location and name filters use case-insensitive matching (`ILIKE` in PostgreSQL).

## Time Interval Behavior

When using `TimeInterval`, the system calculates date ranges based on the current time:

- **"day"**: Events happening today (current date)
- **"week"**: Events from today to 7 days from now
- **"month"**: Events from today to 1 month from now

If both `TimeInterval` and `StartDate`/`EndDate` are specified, `TimeInterval` takes precedence.

## API Integration

### HTTP Handler Example

```go
func GetEventsWithFilterHandler(w http.ResponseWriter, r *http.Request) {
    var filter models.EventFilter
    
    // Parse query parameters
    if state := r.URL.Query().Get("state"); state != "" {
        filter.State = state
    }
    if country := r.URL.Query().Get("country"); country != "" {
        filter.Country = country
    }
    if nameContains := r.URL.Query().Get("name"); nameContains != "" {
        filter.NameContains = nameContains
    }
    if timeInterval := r.URL.Query().Get("interval"); timeInterval != "" {
        filter.TimeInterval = timeInterval
    }
    
    // Parse date range if provided
    if startDateStr := r.URL.Query().Get("start_date"); startDateStr != "" {
        if startDate, err := time.Parse("2006-01-02", startDateStr); err == nil {
            dateYMD := models.DateYMD(startDate)
            filter.StartDate = &dateYMD
        }
    }
    if endDateStr := r.URL.Query().Get("end_date"); endDateStr != "" {
        if endDate, err := time.Parse("2006-01-02", endDateStr); err == nil {
            dateYMD := models.DateYMD(endDate)
            filter.EndDate = &dateYMD
        }
    }
    
    events, err := eventStore.GetEventsWithFilter(r.Context(), filter)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(events)
}
```

### Example API Calls

```bash
# Get events in Washington DC
GET /events?state=DC

# Get events in USA this month
GET /events?country=USA&interval=month

# Get workshops in California
GET /events?state=CA&name=workshop

# Get events in date range
GET /events?start_date=2024-02-01&end_date=2024-02-29
```

## Performance Considerations

1. **Indexes**: Consider adding database indexes on frequently filtered columns:
   ```sql
   CREATE INDEX idx_events_location ON events USING gin(to_tsvector('english', location));
   CREATE INDEX idx_events_date ON events (date);
   CREATE INDEX idx_events_name ON events USING gin(to_tsvector('english', name));
   ```

2. **Query Optimization**: The filtering system builds dynamic SQL queries, which are optimized for PostgreSQL.

3. **Result Ordering**: Results are automatically ordered by date (ascending).

## Error Handling

The method returns standard Go errors. Common error scenarios:
- Database connection issues
- Invalid date formats
- SQL query execution errors

Always check the returned error before processing results:

```go
events, err := store.GetEventsWithFilter(ctx, filter)
if err != nil {
    log.Printf("Error filtering events: %v", err)
    return
}
```

## Testing

Comprehensive tests are provided in `event_store_filter_test.go`. Run tests with:

```bash
go test ./store/postgresql -v -run TestGetEventsWithFilter
```

The tests cover:
- Individual filter criteria
- Combined filters
- Edge cases
- Error scenarios
