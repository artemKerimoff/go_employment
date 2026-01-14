package main

import (
    "context"
    "log"

    "github.com/example/micro/accounts/internal/config"
    "github.com/example/micro/accounts/internal/data"
)

func main() {
    cfg, err := config.Load()
    if err != nil {
        log.Fatalf("load config: %v", err)
    }
    ctx := context.Background()
    client, err := data.NewClient(ctx, cfg.DatabaseURL)
    if err != nil {
        log.Fatalf("connect db: %v", err)
    }
    defer client.Close()

    if err := client.Schema.Create(ctx); err != nil {
        log.Fatalf("apply migrations: %v", err)
    }
    log.Printf("migrations applied for %s", cfg.ServiceName)
}
