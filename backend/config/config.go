package config

type Config struct {
	Port 		string
	DatabaseURL string
	Restart     bool
}

func LoadConfig() *Config {
	mustLoadEnv()
	return &Config{
		Port : getEnv("PORT", "8080"),
		DatabaseURL : getEnv("DATABASE_URL", ""),
		Restart : getEnvBool("RESTART", false),
	}
}	
