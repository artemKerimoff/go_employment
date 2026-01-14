package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/example/micro/bff/internal/config"
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

	httpSrv := server.NewHTTP(cfg, nil)

	go func() {
		if err := httpSrv.Start(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			logger.Error("http server exit", slog.Any("err", err))
		}
	}()
	logger.Info("bff started", slog.Int("port", cfg.HTTPPort))

	<-ctx.Done()
	logger.Info("stopping...")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), cfg.Shutdown)
	defer cancel()
	if err := httpSrv.Shutdown(shutdownCtx); err != nil {
		logger.Error("graceful shutdown", slog.Any("err", err))
	}
}
