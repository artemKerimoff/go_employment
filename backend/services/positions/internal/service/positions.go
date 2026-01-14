package service

import (
    "context"
    "time"

    "github.com/example/micro/positions/ent"
    positionspb "github.com/example/micro/proto/gen/go/positions"
    "google.golang.org/grpc/codes"
    "google.golang.org/grpc/status"
)

// Service implements PositionsServiceServer.
type Service struct {
    positionspb.UnimplementedPositionsServiceServer
    client  *ent.Client
    timeout time.Duration
}

func New(client *ent.Client, timeout time.Duration) *Service {
    return &Service{client: client, timeout: timeout}
}

func (s *Service) withTimeout(ctx context.Context) (context.Context, context.CancelFunc) {
    return context.WithTimeout(ctx, s.timeout)
}

func (s *Service) CreatePosition(ctx context.Context, req *positionspb.CreatePositionRequest) (*positionspb.CreatePositionResponse, error) {
    ctx, cancel := s.withTimeout(ctx)
    defer cancel()

    pos, err := s.client.Position.Create().SetTitle(req.GetTitle()).Save(ctx)
    if err != nil {
        return nil, status.Errorf(codes.Internal, "create position: %v", err)
    }
    return &positionspb.CreatePositionResponse{Position: toProto(pos)}, nil
}

func (s *Service) GetPosition(ctx context.Context, req *positionspb.GetPositionRequest) (*positionspb.GetPositionResponse, error) {
    ctx, cancel := s.withTimeout(ctx)
    defer cancel()

    pos, err := s.client.Position.Get(ctx, req.GetId())
    if err != nil {
        return nil, status.Errorf(codes.NotFound, "position not found: %v", err)
    }
    return &positionspb.GetPositionResponse{Position: toProto(pos)}, nil
}

func (s *Service) ListPositions(ctx context.Context, req *positionspb.ListPositionsRequest) (*positionspb.ListPositionsResponse, error) {
    ctx, cancel := s.withTimeout(ctx)
    defer cancel()

    q := s.client.Position.Query()
    if req.GetLimit() > 0 {
        q = q.Limit(int(req.GetLimit()))
    }
    if req.GetOffset() > 0 {
        q = q.Offset(int(req.GetOffset()))
    }
    list, err := q.All(ctx)
    if err != nil {
        return nil, status.Errorf(codes.Internal, "list positions: %v", err)
    }
    resp := &positionspb.ListPositionsResponse{Positions: make([]*positionspb.Position, 0, len(list))}
    for _, p := range list {
        resp.Positions = append(resp.Positions, toProto(p))
    }
    return resp, nil
}

func (s *Service) UpdatePosition(ctx context.Context, req *positionspb.UpdatePositionRequest) (*positionspb.UpdatePositionResponse, error) {
    ctx, cancel := s.withTimeout(ctx)
    defer cancel()

    upd := s.client.Position.UpdateOneID(req.GetId())
    if req.Title != "" {
        upd = upd.SetTitle(req.GetTitle())
    }
    pos, err := upd.Save(ctx)
    if err != nil {
        return nil, status.Errorf(codes.Internal, "update position: %v", err)
    }
    return &positionspb.UpdatePositionResponse{Position: toProto(pos)}, nil
}

func (s *Service) DeletePosition(ctx context.Context, req *positionspb.DeletePositionRequest) (*positionspb.DeletePositionResponse, error) {
    ctx, cancel := s.withTimeout(ctx)
    defer cancel()

    if err := s.client.Position.DeleteOneID(req.GetId()).Exec(ctx); err != nil {
        return nil, status.Errorf(codes.Internal, "delete position: %v", err)
    }
    return &positionspb.DeletePositionResponse{}, nil
}

func toProto(p *ent.Position) *positionspb.Position {
    return &positionspb.Position{Id: p.ID, Title: p.Title}
}
