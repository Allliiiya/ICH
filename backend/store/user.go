// store/user.go
package store

import (
	"context"
	"chinese-heritage-backend/models"
)

type UserStore interface {
	CreateUser(ctx context.Context, signup_cred models.SignupCredential) error
	GetUserByEmail(ctx context.Context, email string) (*models.User, error)
}
