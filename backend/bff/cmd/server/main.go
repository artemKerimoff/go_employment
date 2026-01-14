package main

import (
    "context"
    "log/slog"
    "os"
    "os/signal"
    "syscall"

    "github.com/example/micro/bff/internal/clients"
    "github.com/example/micro/bff/internal/config"
    "github.com/example/micro/bff/internal/handlers"
    "github.com/example/micro/bff/internal/server"
)

func main() {
    cfg, err := config.Load()
    if err != nil {
        panic(err)
    }

    logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}))

    ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
    defer stop()

    addrs := map[string]string{
        "accounts":              cfg.AccountsAddr,
        "organizations":         cfg.OrganizationsAddr,
        "departments":           cfg.DepartmentsAddr,
        "positions":             cfg.PositionsAddr,
        "individuals":           cfg.IndividualsAddr,
        "employment_contracts":  cfg.EmploymentContractsAddr,
        "employment_order":      cfg.EmploymentOrderAddr,
        "dismissal_order":       cfg.DismissalOrderAddr,
    }

    svcs, err := clients.DialAll(ctx, addrs, cfg.RequestTTL)
    if err != nil {
        logger.Error("dial services", slog.Any("err", err))
        os.Exit(1)
    }
    defer svcs.Close()

    r := server.Router()
    h := handlers.New(svcs, cfg.RequestTTL)
    h.RegisterRoutes(r)

    srv := server.New(cfg, r)

    go func() {
        logger.Info("http started", slog.Int("port", cfg.HTTPPort))
        if err := srv.Start(); err != nil {
            logger.Error("http", slog.Any("err", err))
        }
    }()

    <-ctx.Done()
    logger.Info("stopping...")
    shutCtx, cancel := context.WithTimeout(context.Background(), cfg.Shutdown)
    defer cancel()
    _ = srv.Shutdown(shutCtx)
}
