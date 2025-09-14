// filepath: backend/main.go
package main

import (
	"context"
	"log"
	"time"

	"chinese-heritage-backend/config"
	"chinese-heritage-backend/server"
	"chinese-heritage-backend/store"
	"chinese-heritage-backend/store/postgresql"
)

func main() {
	cfg := config.LoadConfig()

	conn := postgresql.MustConnectPostgresDB(cfg.DatabaseURL)
	defer conn.Close()
	var s store.Store
	var err error
	if cfg.Restart {
		log.Println("Restarting database...")
		s = postgresql.NewPostgresStoreRestart(conn)
	} else {
		log.Println("Using existing database...")
		s = postgresql.NewPostgresStore(conn)
	}
	if err != nil {
		log.Fatal("Error initializing store:", err)
	}
	go func() {
		ticker := time.NewTicker(24 * time.Hour) // adjust the interval as needed
		defer ticker.Stop()
		for range ticker.C {
			log.Println("Running periodic cleanup of expired events...")
			err := s.EventStore().DeleteExpiredEvents(context.Background())
			if err != nil {
				log.Println("Error during periodic cleanup:", err)
			} else {
				log.Println("Periodic cleanup completed.")
			}
		}
	}()

	server, err := server.NewServer(s)
	if err != nil {
		log.Fatalf("Error creating server: %v", err)
	}

	log.Println("Server starting on port", cfg.Port)
	log.Fatal(server.Start(cfg.Port))
}
