package server

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/example/micro/bff/internal/config"
	"github.com/example/micro/bff/internal/service"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

// HTTPServer wraps chi with graceful shutdown helpers.
type HTTPServer struct {
	srv *http.Server
}

func NewHTTP(cfg config.Config, agg *service.Aggregator) *HTTPServer {
	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// Basic health endpoint remains; resource routes are disabled when agg is nil.
	r.Get("/healthz", func(w http.ResponseWriter, r *http.Request) {
		if agg == nil {
			writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
			return
		}
		if err := agg.Health(r.Context()); err != nil {
			writeJSON(w, http.StatusServiceUnavailable, map[string]string{"status": "unhealthy", "error": err.Error()})
			return
		}
		writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
	})

	if agg != nil {
		r.Get("/api/resources", func(w http.ResponseWriter, r *http.Request) {
			items, err := agg.ListResources(r.Context())
			if err != nil {
				writeJSON(w, http.StatusBadGateway, map[string]string{"error": err.Error()})
				return
			}
			writeJSON(w, http.StatusOK, items)
		})

		r.Get("/api/resources/{id}", func(w http.ResponseWriter, r *http.Request) {
			id := chi.URLParam(r, "id")
			res, err := agg.GetResource(r.Context(), id)
			if err != nil {
				writeJSON(w, http.StatusBadGateway, map[string]string{"error": err.Error()})
				return
			}
			writeJSON(w, http.StatusOK, res)
		})
	}

	srv := &http.Server{
		Addr:              ":" + itoa(cfg.HTTPPort),
		Handler:           r,
		ReadHeaderTimeout: 5 * time.Second,
	}

	return &HTTPServer{srv: srv}
}

func (s *HTTPServer) Start() error {
	return s.srv.ListenAndServe()
}

func (s *HTTPServer) Shutdown(ctx context.Context) error {
	return s.srv.Shutdown(ctx)
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func itoa(i int) string {
	return strconv.FormatInt(int64(i), 10)
}
