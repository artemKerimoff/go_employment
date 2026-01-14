package config

import (
	"fmt"
	"time"

	"github.com/kelseyhightower/envconfig"
)

// Config holds runtime settings for the BFF.
type Config struct {
	ServiceName string        `envconfig:"SERVICE_NAME" default:"bff"`
	HTTPPort    int           `envconfig:"HTTP_PORT" default:"8080"`
	Shutdown    time.Duration `envconfig:"SHUTDOWN_TIMEOUT" default:"10s"`
	RequestTTL  time.Duration `envconfig:"REQUEST_TIMEOUT" default:"5s"`

	AccountsAddr            string `envconfig:"ACCOUNTS_ADDR" default:"localhost:50100"`
	OrganizationsAddr       string `envconfig:"ORGANIZATIONS_ADDR" default:"localhost:50101"`
	DepartmentsAddr         string `envconfig:"DEPARTMENTS_ADDR" default:"localhost:50102"`
	PositionsAddr           string `envconfig:"POSITIONS_ADDR" default:"localhost:50103"`
	IndividualsAddr         string `envconfig:"INDIVIDUALS_ADDR" default:"localhost:50104"`
	EmploymentContractsAddr string `envconfig:"EMPLOYMENT_CONTRACTS_ADDR" default:"localhost:50105"`
	EmploymentOrderAddr     string `envconfig:"EMPLOYMENT_ORDER_ADDR" default:"localhost:50106"`
	DismissalOrderAddr      string `envconfig:"DISMISSAL_ORDER_ADDR" default:"localhost:50107"`
	ResourceSvcAddr         string `envconfig:"RESOURCE_SVC_ADDR" default:"localhost:50200"`
}

// Load reads environment variables with prefix BFF_.
func Load() (Config, error) {
	var cfg Config
	if err := envconfig.Process("BFF", &cfg); err != nil {
		return cfg, fmt.Errorf("load config: %w", err)
	}
	return cfg, nil
}
