package config

import (
	"log"
	"os"
	"strconv"	

	"github.com/joho/godotenv"
)

func mustLoadEnv() {
    err := godotenv.Load()
    if err != nil {
        log.Fatalf("Error loading .env file")
    }
}

func getEnv(key, defaultVal string) string {
    val := os.Getenv(key)
    if val == "" {
        return defaultVal
    } 
    return val
}

func getEnvBool(key string, defaultVal bool) bool {
    val := os.Getenv(key)
    b, err := strconv.ParseBool(val)
    if err != nil {
        return defaultVal
    } 
    return b
}