package mock 

import (
	"context"
	"chinese-heritage-backend/models"
	"chinese-heritage-backend/store"
)

type FakeUserStore struct {
	Users map[string]models.User // Keyed by email
	id int
}

func NewFakeUserStore() *FakeUserStore {
	return &FakeUserStore {
		Users: make(map[string]models.User),
	}
}

func (s *FakeUserStore) Len() int {
	return len(s.Users)
}

func (s *FakeUserStore) CreateUser(ctx context.Context, signup_cred models.SignupCredential) error {
	s.Users[signup_cred.Email] = models.User {
		ID: s.id,
		Name: signup_cred.Name,
		Email: signup_cred.Email,
		Password: signup_cred.Password,
		IsAdmin: signup_cred.IsAdmin,
	}
	s.id += 1
	return nil
}

func (s *FakeUserStore) GetUserByEmail(ctx context.Context, email string) (*models.User, error) {
	user, ok := s.Users[email]
	if !ok {
		return nil, store.ErrUserNotFound
	} 
	return &user, nil
}