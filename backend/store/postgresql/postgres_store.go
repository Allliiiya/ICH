package postgresql

import (
	"context"
	"fmt"
	"log"
	"github.com/jackc/pgx/v5/pgxpool"
    "chinese-heritage-backend/store"
)

type PostgresStore struct {
    user *PostgresUserStore
    event *PostgresEventStore
}

func (p *PostgresStore) UserStore() store.UserStore {
    return p.user
}

func (p *PostgresStore) EventStore() store.EventStore {
    return p.event
}

func NewPostgresStore(pool *pgxpool.Pool) *PostgresStore {
	// Initialize all tables
	InitTables(pool)

	return &PostgresStore{
		user:  &PostgresUserStore{pool: pool},
		event: &PostgresEventStore{pool: pool},
	}
}

func NewPostgresStoreRestart(pool *pgxpool.Pool) (*PostgresStore) {
	// Return PostgresStore with shared pool
    RecreateTables(pool)
	return &PostgresStore{
		user:  &PostgresUserStore{pool: pool},
		event: &PostgresEventStore{pool: pool},
	}
}

func MustConnectPostgresDB(dbURL string) *pgxpool.Pool {
    conn, err :=  pgxpool.New(context.Background(), dbURL)
    if err != nil {
        log.Fatal("Error connecting to DB:", err)
    }
    return conn
}

// use for testing
func QueryData(conn *pgxpool.Pool) {
    rows, err := conn.Query(context.Background(),"SELECT id, username FROM users");
    if err != nil {
        log.Fatal(err)
    }
    defer rows.Close()
    for rows.Next() {
        var id int
        var name string
        err := rows.Scan(&id, &name)
        if err != nil {
            log.Fatal(err)
        }
        fmt.Printf("User ID: %d, Name; %s\n", id, name);
    }
}
