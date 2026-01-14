package server

import (
	"fmt"
	"net"

	"github.com/example/micro/service-template/internal/config"
	"github.com/example/micro/service-template/internal/service"
	servicepb "github.com/example/micro/proto/gen/go/service"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

// GRPCServer wraps a gRPC server and listener.
type GRPCServer struct {
	srv *grpc.Server
	lis net.Listener
}

func NewGRPC(cfg config.Config, svc *service.Service) (*GRPCServer, error) {
	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", cfg.GRPCPort))
	if err != nil {
		return nil, fmt.Errorf("listen: %w", err)
	}
	srv := grpc.NewServer()
	servicepb.RegisterResourceServiceServer(srv, svc)
	reflection.Register(srv)
	return &GRPCServer{srv: srv, lis: lis}, nil
}

func (s *GRPCServer) Serve() error {
	return s.srv.Serve(s.lis)
}

func (s *GRPCServer) Stop() {
	s.srv.GracefulStop()
}
