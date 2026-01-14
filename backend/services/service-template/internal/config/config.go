package config

import (
	"fmt"
	"time"

	"github.com/kelseyhightower/envconfig"
)

// Config holds runtime settings.
type Config struct {
	ServiceName     string        `envconfig:"SERVICE_NAME" default:"resource-service"`
	GRPCPort        int           `envconfig:"GRPC_PORT" default:"50051"`
	DatabaseURL     string        `envconfig:"DATABASE_URL" default:"postgres://student:stud_secret@localhost:5432/employment_relationships?sslmode=disable"`
	ShutdownTimeout time.Duration `envconfig:"SHUTDOWN_TIMEOUT" default:"10s"`
	RequestTimeout  time.Duration `envconfig:"REQUEST_TIMEOUT" default:"5s"`
}

// Load reads env vars with prefix SERVICE_.
func Load() (Config, error) {
	var cfg Config
	if err := envconfig.Process("SERVICE", &cfg); err != nil {
		return cfg, fmt.Errorf("load config: %w", err)
	}
	return cfg, nil
}
