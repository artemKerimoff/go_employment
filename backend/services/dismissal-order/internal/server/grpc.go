package server

import (
	"fmt"
	"net"

	"github.com/example/micro/dismissal-order/internal/config"
	dismissalorderpb "github.com/example/micro/proto/gen/go/dismissal_order"
	"google.golang.org/grpc"
	"google.golang.org/grpc/health"
	healthpb "google.golang.org/grpc/health/grpc_health_v1"
)

// GRPCServer wraps a gRPC server and listener.
type GRPCServer struct {
	srv *grpc.Server
	lis net.Listener
}

func New(cfg config.Config, svc dismissalorderpb.DismissalOrderServiceServer) (*GRPCServer, error) {
	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", cfg.GRPCPort))
	if err != nil {
		return nil, fmt.Errorf("listen: %w", err)
	}
	srv := grpc.NewServer()
	dismissalorderpb.RegisterDismissalOrderServiceServer(srv, svc)

	h := health.NewServer()
	h.SetServingStatus("", healthpb.HealthCheckResponse_SERVING)
	healthpb.RegisterHealthServer(srv, h)

	return &GRPCServer{srv: srv, lis: lis}, nil
}

func (s *GRPCServer) Serve() error { return s.srv.Serve(s.lis) }
func (s *GRPCServer) Stop()        { s.srv.GracefulStop() }
