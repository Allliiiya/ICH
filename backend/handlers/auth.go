package handlers

import (
    "encoding/json"
    "fmt"
    "net/http"
    "time"

    "github.com/golang-jwt/jwt/v5"
    "golang.org/x/crypto/bcrypt"
    "chinese-heritage-backend/models"
    "chinese-heritage-backend/store"
    "errors"
)
var JwtKey = []byte("your_secret_key") // Use a secure, random key in production!

type Claims struct {
    UserID  int    `json:"user_id"`
    Email   string `json:"email"`
    IsAdmin bool   `json:"is_admin"`
    jwt.RegisteredClaims
}

type AuthHandler struct {
	Store store.Store
}


func (h *AuthHandler) SignupHandler(w http.ResponseWriter, r *http.Request) {
    var userStore store.UserStore = h.Store.UserStore()

    fmt.Println("SignupHandler called, method:", r.Method)
    w.Header().Set("Content-Type", "application/json")

    // TODO: Verify the email enter exist
    if r.Method != http.MethodPost {
        w.WriteHeader(http.StatusMethodNotAllowed)
        json.NewEncoder(w).Encode(map[string]string{"message": "Method not allowed"});
        return
    }

    var cred models.SignupCredential
    err := json.NewDecoder(r.Body).Decode(&cred)
    fmt.Println("Decoded credentials:", cred)
    if err != nil {
        fmt.Println("JSON decode error:", err)
        w.WriteHeader(http.StatusBadRequest)
        json.NewEncoder(w).Encode(map[string]string{"message": "Invalid credentials"})
        return
    }

    if cred.Email == "" || cred.Password == "" || cred.Name == "" {
        fmt.Println("Validation failed:", cred)
        w.WriteHeader(http.StatusBadRequest)
        json.NewEncoder(w).Encode(map[string]string{"message": "Invalid credentials"})
        return 
    }

    // check if email exists
    _, err = userStore.GetUserByEmail(r.Context(), cred.Email)
        fmt.Printf("GetUserByEmail error: %v, type: %T\n", err, err)
        if err == nil {
            fmt.Println("Email already exists:", cred.Email)
            w.WriteHeader(http.StatusConflict)
            json.NewEncoder(w).Encode(map[string]string{"message": "Email already exists"})
            return
        }
        if err != nil {
            if errors.Is(err, store.ErrUserNotFound) {
                // Proceed to create user
                fmt.Println("User not found (errors.Is), proceeding to create user:", cred.Email)
            } else {
                fmt.Println("Unexpected error from GetUserByEmail (errors.Is):", err)
                w.WriteHeader(http.StatusInternalServerError)
                json.NewEncoder(w).Encode(map[string]string{"message": "Internal Service Error"})
                return 
            }
        }

    fmt.Println("Before hashing password:", cred)
    hashedPassword, err := HashPassword(cred.Password)
    if err != nil {
        fmt.Println("Password hashing error:", err)
        w.WriteHeader(http.StatusBadRequest)
        json.NewEncoder(w).Encode(map[string]string{"message": "Unable to hash the password"})
        return
    }
    fmt.Println("After hashing password:", hashedPassword)
    cred.Password = hashedPassword
        // Only admin@heritage.org is admin
        if cred.Email == "admin@heritage.org" {
            cred.IsAdmin = true
        } else {
            cred.IsAdmin = false
        }
    fmt.Println("Attempting to create user:", cred)
    err = userStore.CreateUser(r.Context(), cred)
    fmt.Println("CreateUser returned error:", err)
    if err != nil {
        fmt.Println("SignupHandler CreateUser error:", err)
        w.WriteHeader(http.StatusInternalServerError)
        json.NewEncoder(w).Encode(map[string]string{"message": "Internal Service Error"})
        return
    }
    json.NewEncoder(w).Encode(map[string]string{"message": "Successfully Signup"})
}

func (h *AuthHandler) LoginHandler(w http.ResponseWriter, r *http.Request) {
    var userStore store.UserStore = h.Store.UserStore()
    w.Header().Set("Content-Type", "application/json")
    if r.Method != http.MethodPost {
        w.WriteHeader(http.StatusMethodNotAllowed)
        json.NewEncoder(w).Encode(map[string]string{"message": "Method not allowed"});
        return
    }

    var cred models.LoginCredential
    err := json.NewDecoder(r.Body).Decode(&cred)
    if err != nil {
        w.WriteHeader(http.StatusBadRequest)
        json.NewEncoder(w).Encode(map[string]string{"message": "Invalid credentials"})
        return
    }
    user, err := userStore.GetUserByEmail(r.Context(), cred.Email)
    if err != nil {
        w.WriteHeader(http.StatusNoContent)
        json.NewEncoder(w).Encode(map[string]string{"message": "Email does not exists"})
        return
    } 

    if CheckPasswordHash(cred.Password, user.Password) {
        expirationTime := time.Now().Add(24 * time.Hour)
            isAdmin := false
            if user.Email == "admin@heritage.org" {
                isAdmin = true
            }
        claims := &Claims{
            UserID:  user.ID,
            Email:   user.Email,
                IsAdmin: isAdmin,
            RegisteredClaims: jwt.RegisteredClaims{
                ExpiresAt: jwt.NewNumericDate(expirationTime),
            },
        }
            fmt.Println("About to hash password for:", cred.Email)
        token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
        tokenString, err := token.SignedString(JwtKey)
        if err != nil {
            w.WriteHeader(http.StatusInternalServerError)
            json.NewEncoder(w).Encode(map[string]string{"message": "Could not create token"})
            return
        }
            fmt.Println("Password hashed successfully for:", cred.Email)
        w.WriteHeader(http.StatusOK)
        json.NewEncoder(w).Encode(map[string]string{"token": tokenString})
            fmt.Println("About to call CreateUser for:", cred.Email)
        return
    }

    w.WriteHeader(http.StatusInternalServerError)
    json.NewEncoder(w).Encode(map[string]string{"message": "Internal Service Error"})
}
// Middleware to protect admin routes
func AdminOnly(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        tokenStr := r.Header.Get("Authorization")
        if tokenStr == "" {
            http.Error(w, "Missing token", http.StatusUnauthorized)
            return
        }
        token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(token *jwt.Token) (interface{}, error) {
            return JwtKey, nil
        })
        if err != nil || !token.Valid {
            http.Error(w, "Invalid token", http.StatusUnauthorized)
            return
        }
        claims, ok := token.Claims.(*Claims)
        if !ok || !claims.IsAdmin {
            http.Error(w, "Forbidden", http.StatusForbidden)
            return
        }
        next(w, r)
    }
}

func HashPassword(password string) (string, error) {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}