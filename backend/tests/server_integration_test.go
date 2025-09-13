package tests

import (
	"testing"
	"context"
	"chinese-heritage-backend/models"
	"chinese-heritage-backend/store/postgresql"
)


func TestUserSignupDB(t *testing.T) {
	pool, cleanup := SetupTestDB(t) 
	defer cleanup()

	s := postgresql.NewPostgresStoreRestart(pool)

	ctx := context.Background()
	cred := models.SignupCredential{
		Name: "Test User",
		Email: "test@example.com",
		Password: "hashedpassword123",
		IsAdmin: false,
	}

	var userStore = s.UserStore()
	err := userStore.CreateUser(ctx, cred)
	if err != nil {
		t.Fatalf("CreateUser failed: %v", err)
	}

	user, err := userStore.GetUserByEmail(ctx, cred.Email)
	if err != nil {
		t.Fatalf("GetUserByEmail failed: %v", err)
	}

	if user.Email != cred.Email || user.Name != cred.Name {
		t.Errorf("unexpected user data: %+v", user)
	}
}