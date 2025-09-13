package postgresql

import (
	"log"
	"context"
	"github.com/jackc/pgx/v5/pgxpool"	
)
var Tables = map[string]string{
    "users": `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE
    );`,
    "events": `CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        date TIMESTAMP NOT NULL,
        location TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL DEFAULT NOW(),
        link TEXT
    );`,
    // Add more tables here as needed
}


func InitTables(pool *pgxpool.Pool) {
    ctx := context.Background()
    for name, query := range Tables {
        _, err := pool.Exec(ctx, query)
        if err != nil {
            log.Fatalf("failed to create table: %v: %v", name, err)
        }
    }
}

func RecreateTables(conn *pgxpool.Pool) {
	ctx := context.Background()
	for name, query := range Tables {
		_, err := conn.Exec(ctx, "DROP TABLE IF EXISTS "+name+" CASCADE;")
		if err != nil {
			log.Fatalf("failed to drop table %v: %v", query, err)
		}
		_, err = conn.Exec(ctx, query)
		if err != nil {
			log.Fatalf("failed to create table %v: %v", name, err)
		}
	}
}
