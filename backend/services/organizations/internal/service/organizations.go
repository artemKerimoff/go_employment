package service

import (
    "context"
    "time"

    "github.com/example/micro/organizations/ent"
    organizationspb "github.com/example/micro/proto/gen/go/organizations"
    "google.golang.org/grpc/codes"
    "google.golang.org/grpc/status"
)

// Service implements OrganizationsServiceServer.
type Service struct {
    organizationspb.UnimplementedOrganizationsServiceServer
    client  *ent.Client
    timeout time.Duration
}

func New(client *ent.Client, timeout time.Duration) *Service {
    return &Service{client: client, timeout: timeout}
}

func (s *Service) withTimeout(ctx context.Context) (context.Context, context.CancelFunc) {
    return context.WithTimeout(ctx, s.timeout)
}

func (s *Service) CreateOrganization(ctx context.Context, req *organizationspb.CreateOrganizationRequest) (*organizationspb.CreateOrganizationResponse, error) {
    ctx, cancel := s.withTimeout(ctx)
    defer cancel()

    org, err := s.client.Organization.
        Create().
        SetTitle(req.GetTitle()).
        SetAddress(req.GetAddress()).
        SetOkpo(req.GetOkpo()).
        SetInn(req.GetInn()).
        SetKpp(req.GetKpp()).
        SetAccountID(req.GetAccountId()).
        Save(ctx)
    if err != nil {
        return nil, status.Errorf(codes.Internal, "create organization: %v", err)
    }
    return &organizationspb.CreateOrganizationResponse{Organization: toProto(org)}, nil
}

func (s *Service) GetOrganization(ctx context.Context, req *organizationspb.GetOrganizationRequest) (*organizationspb.GetOrganizationResponse, error) {
    ctx, cancel := s.withTimeout(ctx)
    defer cancel()

    org, err := s.client.Organization.Get(ctx, req.GetId())
    if err != nil {
        return nil, status.Errorf(codes.NotFound, "organization not found: %v", err)
    }
    return &organizationspb.GetOrganizationResponse{Organization: toProto(org)}, nil
}

func (s *Service) ListOrganizations(ctx context.Context, req *organizationspb.ListOrganizationsRequest) (*organizationspb.ListOrganizationsResponse, error) {
    ctx, cancel := s.withTimeout(ctx)
    defer cancel()

    q := s.client.Organization.Query()
    if req.GetLimit() > 0 {
        q = q.Limit(int(req.GetLimit()))
    }
    if req.GetOffset() > 0 {
        q = q.Offset(int(req.GetOffset()))
    }

    list, err := q.All(ctx)
    if err != nil {
        return nil, status.Errorf(codes.Internal, "list organizations: %v", err)
    }
    resp := &organizationspb.ListOrganizationsResponse{Organizations: make([]*organizationspb.Organization, 0, len(list))}
    for _, org := range list {
        resp.Organizations = append(resp.Organizations, toProto(org))
    }
    return resp, nil
}

func (s *Service) UpdateOrganization(ctx context.Context, req *organizationspb.UpdateOrganizationRequest) (*organizationspb.UpdateOrganizationResponse, error) {
    ctx, cancel := s.withTimeout(ctx)
    defer cancel()

    upd := s.client.Organization.UpdateOneID(req.GetId())
    if req.Title != "" {
        upd = upd.SetTitle(req.GetTitle())
    }
    if req.Address != "" {
        upd = upd.SetAddress(req.GetAddress())
    }
    if req.Okpo != "" {
        upd = upd.SetOkpo(req.GetOkpo())
    }
    if req.Inn != "" {
        upd = upd.SetInn(req.GetInn())
    }
    // kpp is optional string; we set even if empty to allow clearing
    if req.Kpp != "" {
        upd = upd.SetKpp(req.GetKpp())
    }
    if req.AccountId != 0 {
        upd = upd.SetAccountID(req.GetAccountId())
    }

    org, err := upd.Save(ctx)
    if err != nil {
        return nil, status.Errorf(codes.Internal, "update organization: %v", err)
    }
    return &organizationspb.UpdateOrganizationResponse{Organization: toProto(org)}, nil
}

func (s *Service) DeleteOrganization(ctx context.Context, req *organizationspb.DeleteOrganizationRequest) (*organizationspb.DeleteOrganizationResponse, error) {
    ctx, cancel := s.withTimeout(ctx)
    defer cancel()

    if err := s.client.Organization.DeleteOneID(req.GetId()).Exec(ctx); err != nil {
        return nil, status.Errorf(codes.Internal, "delete organization: %v", err)
    }
    return &organizationspb.DeleteOrganizationResponse{}, nil
}

func toProto(o *ent.Organization) *organizationspb.Organization {
    kpp := ""
    if o.Kpp != nil {
        kpp = *o.Kpp
    }
    return &organizationspb.Organization{
        Id:         o.ID,
        Title:      o.Title,
        Address:    o.Address,
        Okpo:       o.Okpo,
        Inn:        o.Inn,
        Kpp:        kpp,
        AccountId:  o.AccountID,
    }
}
