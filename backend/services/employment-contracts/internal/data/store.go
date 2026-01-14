package data

import (
	"context"
	"database/sql"
	"fmt"

	"entgo.io/ent/dialect"
	entsql "entgo.io/ent/dialect/sql"
	"github.com/example/micro/employment-contracts/ent"
	_ "github.com/jackc/pgx/v5/stdlib"
)

// NewClient opens an Ent client backed by Postgres.
func NewClient(ctx context.Context, databaseURL string) (*ent.Client, error) {
	db, err := sql.Open("pgx", databaseURL)
	if err != nil {
		return nil, fmt.Errorf("open driver: %w", err)
	}
	drv := entsql.OpenDB(dialect.Postgres, db)
	if err := drv.DB().PingContext(ctx); err != nil {
		return nil, fmt.Errorf("ping db: %w", err)
	}
	return ent.NewClient(ent.Driver(drv)), nil
}
