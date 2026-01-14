package main

import (
    "context"
    "log/slog"
    "os"
    "os/signal"
    "syscall"

    "github.com/example/micro/employment-contracts/internal/config"
    "github.com/example/micro/employment-contracts/internal/data"
    "github.com/example/micro/employment-contracts/internal/server"
    "github.com/example/micro/employment-contracts/internal/service"
)

func main() {
    cfg, err := config.Load()
    if err != nil {
        panic(err)
    }

    logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}))

    ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
    defer stop()

    client, err := data.NewClient(ctx, cfg.DatabaseURL)
    if err != nil {
        logger.Error("connect db", slog.Any("err", err))
        os.Exit(1)
    }
    defer client.Close()

    if err := client.Schema.Create(ctx); err != nil {
        logger.Error("apply migrations", slog.Any("err", err))
        os.Exit(1)
    }

    svc := service.New(client, cfg.RequestTimeout)
    grpcSrv, err := server.New(cfg, svc)
    if err != nil {
        logger.Error("start grpc", slog.Any("err", err))
        os.Exit(1)
    }

    go func() {
        logger.Info("grpc started", slog.Int("port", cfg.GRPCPort))
        if err := grpcSrv.Serve(); err != nil {
            logger.Error("grpc serve", slog.Any("err", err))
        }
    }()

    <-ctx.Done()
    logger.Info("stopping...")
    grpcSrv.Stop()
}
