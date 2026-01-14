package config

import (
	"fmt"
	"time"

	"github.com/kelseyhightower/envconfig"
)

// Config holds runtime settings for dismissal-order service.
type Config struct {
	ServiceName     string        `envconfig:"SERVICE_NAME" default:"dismissal-order"`
	GRPCPort        int           `envconfig:"GRPC_PORT" default:"50107"`
	DatabaseURL     string        `envconfig:"DATABASE_URL" default:"postgres://student:stud_secret@localhost:5432/employment_relationships?sslmode=disable"`
	ShutdownTimeout time.Duration `envconfig:"SHUTDOWN_TIMEOUT" default:"10s"`
	RequestTimeout  time.Duration `envconfig:"REQUEST_TIMEOUT" default:"5s"`
}

func Load() (Config, error) {
	var cfg Config
	if err := envconfig.Process("DISMISSAL_ORDER", &cfg); err != nil {
		return cfg, fmt.Errorf("load config: %w", err)
	}
	return cfg, nil
}
