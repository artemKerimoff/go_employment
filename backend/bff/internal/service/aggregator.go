package service

import (
	"context"
	"fmt"
	"time"

	servicepb "github.com/example/micro/proto/gen/go/service"
)

// Resource is a simplified view for the frontend.
type Resource struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

// Aggregator mediates calls to downstream gRPC services.
type Aggregator struct {
	resources     servicepb.ResourceServiceClient
	requestTimeout time.Duration
}

func NewAggregator(resources servicepb.ResourceServiceClient, requestTimeout time.Duration) *Aggregator {
	return &Aggregator{resources: resources, requestTimeout: requestTimeout}
}

func (a *Aggregator) Health(ctx context.Context) error {
	ctx, cancel := context.WithTimeout(ctx, a.requestTimeout)
	defer cancel()
	_, err := a.resources.Health(ctx, &servicepb.HealthCheckRequest{})
	return err
}

func (a *Aggregator) ListResources(ctx context.Context) ([]Resource, error) {
	ctx, cancel := context.WithTimeout(ctx, a.requestTimeout)
	defer cancel()
	resp, err := a.resources.ListResources(ctx, &servicepb.ListResourcesRequest{})
	if err != nil {
		return nil, fmt.Errorf("list resources: %w", err)
	}
	items := make([]Resource, 0, len(resp.GetItems()))
	for _, r := range resp.GetItems() {
		items = append(items, Resource{ID: r.GetId(), Name: r.GetName(), Description: r.GetDescription()})
	}
	return items, nil
}

func (a *Aggregator) GetResource(ctx context.Context, id string) (Resource, error) {
	ctx, cancel := context.WithTimeout(ctx, a.requestTimeout)
	defer cancel()
	resp, err := a.resources.GetResource(ctx, &servicepb.GetResourceRequest{Id: id})
	if err != nil {
		return Resource{}, fmt.Errorf("get resource: %w", err)
	}
	return Resource{ID: resp.GetId(), Name: resp.GetName(), Description: resp.GetDescription()}, nil
}
