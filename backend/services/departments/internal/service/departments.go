package service

import (
    "context"
    "time"

    "github.com/example/micro/departments/ent"
    departmentspb "github.com/example/micro/proto/gen/go/departments"
    "google.golang.org/grpc/codes"
    "google.golang.org/grpc/status"
)

// Service implements DepartmentsServiceServer.
type Service struct {
    departmentspb.UnimplementedDepartmentsServiceServer
    client  *ent.Client
    timeout time.Duration
}

func New(client *ent.Client, timeout time.Duration) *Service {
    return &Service{client: client, timeout: timeout}
}

func (s *Service) withTimeout(ctx context.Context) (context.Context, context.CancelFunc) {
    return context.WithTimeout(ctx, s.timeout)
}

func (s *Service) CreateDepartment(ctx context.Context, req *departmentspb.CreateDepartmentRequest) (*departmentspb.CreateDepartmentResponse, error) {
    ctx, cancel := s.withTimeout(ctx)
    defer cancel()

    dep, err := s.client.Department.Create().SetTitle(req.GetTitle()).Save(ctx)
    if err != nil {
        return nil, status.Errorf(codes.Internal, "create department: %v", err)
    }
    return &departmentspb.CreateDepartmentResponse{Department: toProto(dep)}, nil
}

func (s *Service) GetDepartment(ctx context.Context, req *departmentspb.GetDepartmentRequest) (*departmentspb.GetDepartmentResponse, error) {
    ctx, cancel := s.withTimeout(ctx)
    defer cancel()

    dep, err := s.client.Department.Get(ctx, req.GetId())
    if err != nil {
        return nil, status.Errorf(codes.NotFound, "department not found: %v", err)
    }
    return &departmentspb.GetDepartmentResponse{Department: toProto(dep)}, nil
}

func (s *Service) ListDepartments(ctx context.Context, req *departmentspb.ListDepartmentsRequest) (*departmentspb.ListDepartmentsResponse, error) {
    ctx, cancel := s.withTimeout(ctx)
    defer cancel()

    q := s.client.Department.Query()
    if req.GetLimit() > 0 {
        q = q.Limit(int(req.GetLimit()))
    }
    if req.GetOffset() > 0 {
        q = q.Offset(int(req.GetOffset()))
    }
    deps, err := q.All(ctx)
    if err != nil {
        return nil, status.Errorf(codes.Internal, "list departments: %v", err)
    }
    resp := &departmentspb.ListDepartmentsResponse{Departments: make([]*departmentspb.Department, 0, len(deps))}
    for _, d := range deps {
        resp.Departments = append(resp.Departments, toProto(d))
    }
    return resp, nil
}

func (s *Service) UpdateDepartment(ctx context.Context, req *departmentspb.UpdateDepartmentRequest) (*departmentspb.UpdateDepartmentResponse, error) {
    ctx, cancel := s.withTimeout(ctx)
    defer cancel()

    upd := s.client.Department.UpdateOneID(req.GetId())
    if req.Title != "" {
        upd = upd.SetTitle(req.GetTitle())
    }
    dep, err := upd.Save(ctx)
    if err != nil {
        return nil, status.Errorf(codes.Internal, "update department: %v", err)
    }
    return &departmentspb.UpdateDepartmentResponse{Department: toProto(dep)}, nil
}

func (s *Service) DeleteDepartment(ctx context.Context, req *departmentspb.DeleteDepartmentRequest) (*departmentspb.DeleteDepartmentResponse, error) {
    ctx, cancel := s.withTimeout(ctx)
    defer cancel()

    if err := s.client.Department.DeleteOneID(req.GetId()).Exec(ctx); err != nil {
        return nil, status.Errorf(codes.Internal, "delete department: %v", err)
    }
    return &departmentspb.DeleteDepartmentResponse{}, nil
}

func toProto(d *ent.Department) *departmentspb.Department {
    return &departmentspb.Department{Id: d.ID, Title: d.Title}
}
