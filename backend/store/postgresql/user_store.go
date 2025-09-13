package postgresql

import (
    "context"
    "errors"
    "fmt"
    "github.com/jackc/pgx/v5"
    "github.com/jackc/pgx/v5/pgxpool"
    "chinese-heritage-backend/models"
    "chinese-heritage-backend/store"
)



type PostgresUserStore struct {
	pool *pgxpool.Pool
}

func (p *PostgresUserStore) CreateUser(ctx context.Context, signup_cred models.SignupCredential) error {
    // Only allow admin creation for specific backend logic
    isAdmin := false
    // You can add more logic here to allow other admin emails if needed
    if signup_cred.Email == "admin@heritage.org" {
        isAdmin = true
    }
    query := `
        INSERT INTO users (name, email, password, is_admin)
        VALUES ($1, $2, $3, $4)
    `
    _, err := p.pool.Exec(ctx, query, signup_cred.Name, signup_cred.Email, signup_cred.Password, isAdmin)
    if err != nil {
        // Log the error for debugging
        fmt.Println("CreateUser error:", err)
    }
    return err
}
func (u *PostgresUserStore) GetUserByEmail(ctx context.Context, email string) (*models.User, error) {
    var user models.User
    query := `
        SELECT id, name, email, password, is_admin
        FROM users
        WHERE email = $1
    `
    row := u.pool.QueryRow(ctx, query, email)
    err := row.Scan(&user.ID, &user.Name, &user.Email, &user.Password, &user.IsAdmin)
    if err != nil {
        if errors.Is(err, pgx.ErrNoRows) {
            return nil, store.ErrUserNotFound
        }
        return nil, err
    }
    return &user, nil
}