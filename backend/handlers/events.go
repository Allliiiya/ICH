package handlers

import (
    "strconv"
    "encoding/json"
    "net/http"
    "strings"
    "chinese-heritage-backend/store"
    "chinese-heritage-backend/models"
    "log"
)


type EventHandler struct {
    Store store.Store
}



func (h *EventHandler) UploadEventAll(w http.ResponseWriter, r *http.Request) {
    var eventStore = h.Store.EventStore()

    var payloads []models.EventInput
    decoder := json.NewDecoder(r.Body)
    if err := decoder.Decode(&payloads); err != nil {
        r.Body.Close()
        http.Error(w, "Invalid request", http.StatusBadRequest)
        return
    }

    events := make([]models.Event, 0, len(payloads))
    for _, p := range payloads {
        ev, err := p.ToEvent()
        if err != nil {
            http.Error(w, err.Error(), http.StatusBadRequest)
            return
        }
        events = append(events, ev)
    }

    lastID, err := eventStore.CreateEventAll(r.Context(), events)
    if err != nil {
        http.Error(w, "Failed to save events", http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(lastID)    
}

func (h *EventHandler) UploadEvent(w http.ResponseWriter, r *http.Request) {
    var eventStore = h.Store.EventStore()
    var payload models.EventInput 
    decoder := json.NewDecoder(r.Body)
    if err := decoder.Decode(&payload); err != nil {
        r.Body.Close()
        http.Error(w, "Invalid request", http.StatusBadRequest)
        return
    }
    ev, err := payload.ToEvent()
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    id, err := eventStore.CreateEvent(r.Context(), ev)
    if err != nil {
        http.Error(w, "Failed to save event", http.StatusInternalServerError)
        return
    }
    ev.ID = id
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(ev)
}

func (h *EventHandler) GetEvents(w http.ResponseWriter, r *http.Request) {
    var eventStore = h.Store.EventStore()
    events, err := eventStore.GetAllEvents(r.Context())
    if err != nil {
        http.Error(w, "Failed to fetch events", http.StatusInternalServerError)
        return
    }
    log.Printf("Fetched %d events", len(events))
    log.Printf("Events: %+v", events)
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(events)
}

func (h *EventHandler) DeleteExpiredEvents(w http.ResponseWriter, r *http.Request) {
    var eventStore = h.Store.EventStore()
    err := eventStore.DeleteExpiredEvents(r.Context())
    if err != nil {
        http.Error(w, "Failed to delete expired events", http.StatusInternalServerError)
        return
    }
    w.WriteHeader(http.StatusNoContent)
}

func (h *EventHandler) DeleteEventByID(w http.ResponseWriter, r *http.Request) {
    var eventStore = h.Store.EventStore()
    id := strings.TrimPrefix(r.URL.Path, "/api/event/")
    if id == "" {
        http.Error(w, "Event ID is required", http.StatusBadRequest)
        return
    } else {
        id, err := strconv.Atoi(id)
        if err != nil {
            http.Error(w, store.ErrInvalidID.Error(), http.StatusBadRequest)
            return
        }
        err = eventStore.DeleteEventByID(r.Context(), id)

        if err == store.ErrIDNotFound {
            http.Error(w, store.ErrIDNotFound.Error(), http.StatusNotFound)
            return
        } else if err != nil{
            http.Error(w, store.ErrFailedToDeleteEvent.Error(), http.StatusInternalServerError)
            return
        }
    }
    w.WriteHeader(http.StatusNoContent)
}

func splitPath(path string) []string {
    var segments []string
    for _, seg := range split(path, '/') {
        if seg != "" {
            segments = append(segments, seg)
        }
    }
    return segments
}

func split(s string, sep rune) []string {
    var res []string
    i := 0
    for j, c := range s {
        if c == sep {
            res = append(res, s[i:j])
            i = j + 1
        }
    }
    res = append(res, s[i:])
    return res
}
