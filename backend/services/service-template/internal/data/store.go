package data

import (
	"context"
	"fmt"

	"entgo.io/ent/dialect/sql"
	"github.com/example/micro/service-template/ent"
	_ "github.com/jackc/pgx/v5/stdlib"
)

// NewClient opens an Ent client backed by Postgres.
func NewClient(ctx context.Context, databaseURL string) (*ent.Client, error) {
	drv, err := sql.Open("pgx", databaseURL)
	if err != nil {
		return nil, fmt.Errorf("open driver: %w", err)
	}
	if err := drv.DB().PingContext(ctx); err != nil {
		return nil, fmt.Errorf("ping db: %w", err)
	}
	return ent.NewClient(ent.Driver(drv)), nil
}
