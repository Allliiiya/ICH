package server

import (
	"log"
	"net/http"

	"chinese-heritage-backend/handlers"
	"chinese-heritage-backend/store"
)

type Server struct {
	store store.Store
	http.Handler
}

func NewServer(store store.Store) (*Server, error) {
	server := &Server{store: store}

	authHandler := &handlers.AuthHandler{Store: store}

	router := http.NewServeMux()

	eventHandler := &handlers.EventHandler{Store: store}
	// this method is here to verify server is working.
	router.HandleFunc("/", withCORS(server.rootHandler))
	router.HandleFunc("/api", withCORS(server.apiHandler))
	router.HandleFunc("/api/signup", withCORS(authHandler.SignupHandler))
	router.HandleFunc("/api/login", withCORS(authHandler.LoginHandler))
	router.HandleFunc("/api/event", withCORS(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		case http.MethodPost:
			handlers.AdminOnly(eventHandler.UploadEvent)(w, r)
		case http.MethodDelete:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed) // TODO
			// handlers.AdminOnly(eventHandler.DeleteEvent)(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}))
	router.HandleFunc("/api/event/", withCORS(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodDelete {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}
		handlers.AdminOnly(eventHandler.DeleteEventByID)(w, r)
	}))
	router.HandleFunc("/api/events", withCORS(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			eventHandler.GetEvents(w, r)
		case http.MethodPost:
			handlers.AdminOnly(eventHandler.UploadEventAll)(w, r)
		case http.MethodDelete:
			handlers.AdminOnly(eventHandler.DeleteExpiredEvents)(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}))
	router.HandleFunc("/api/events/filter", withCORS(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}
		eventHandler.GetEventsWithFilter(w, r)
	}))
	server.Handler = router
	return server, nil
}

func (s *Server) rootHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusBadRequest)
	w.Write([]byte("Hello, World!"))
}

func (s *Server) apiHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusBadRequest)
}

func (s *Server) Start(port string) error {
	if port[0] != ':' {
		port = ":" + port
	}
	log.Println("Server starting on port", port)
	return http.ListenAndServe(port, s)
}

func withCORS(handler http.HandlerFunc) http.HandlerFunc {
	return handlers.WithCORS(handler)
}
