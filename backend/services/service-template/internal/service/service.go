package service

import (
	"context"
	"fmt"

	"github.com/example/micro/service-template/ent"
	"github.com/google/uuid"
	servicepb "github.com/example/micro/proto/gen/go/service"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// Service implements the gRPC server defined in proto.
type Service struct {
	client *ent.Client
}

func New(client *ent.Client) *Service {
	return &Service{client: client}
}

func (s *Service) Health(ctx context.Context, _ *servicepb.HealthCheckRequest) (*servicepb.HealthCheckResponse, error) {
	return &servicepb.HealthCheckResponse{Status: "ok"}, nil
}

func (s *Service) GetResource(ctx context.Context, req *servicepb.GetResourceRequest) (*servicepb.Resource, error) {
	id, err := uuid.Parse(req.GetId())
	if err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "bad id: %v", err)
	}
	res, err := s.client.Resource.Get(ctx, id)
	if err != nil {
		return nil, status.Errorf(codes.NotFound, "resource not found: %v", err)
	}
	return toProto(res), nil
}

func (s *Service) ListResources(ctx context.Context, _ *servicepb.ListResourcesRequest) (*servicepb.ListResourcesResponse, error) {
	items, err := s.client.Resource.Query().All(ctx)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "list failed: %v", err)
	}
	resp := &servicepb.ListResourcesResponse{Items: make([]*servicepb.Resource, 0, len(items))}
	for _, r := range items {
		resp.Items = append(resp.Items, toProto(r))
	}
	return resp, nil
}

func toProto(r *ent.Resource) *servicepb.Resource {
	desc := ""
	if r.Description != nil {
		desc = *r.Description
	}
	return &servicepb.Resource{
		Id:          r.ID.String(),
		Name:        r.Name,
		Description: desc,
	}
}

// Seed inserts demo data for local usage.
func (s *Service) Seed(ctx context.Context) error {
	count, err := s.client.Resource.Query().Count(ctx)
	if err != nil {
		return fmt.Errorf("count resources: %w", err)
	}
	if count > 0 {
		return nil
	}
	_, err = s.client.Resource.CreateBulk(
		s.client.Resource.Create().SetName("Demo A").SetDescription("Example resource A"),
		s.client.Resource.Create().SetName("Demo B").SetDescription("Example resource B"),
	).Save(ctx)
	return err
}
