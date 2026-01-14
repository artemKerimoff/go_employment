package service

import (
	"context"
	"time"

	"github.com/example/micro/dismissal-order/ent"
	"github.com/example/micro/dismissal-order/ent/dismissalorderbody"
	dismissalorderpb "github.com/example/micro/proto/gen/go/dismissal_order"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// Service implements DismissalOrderServiceServer.
type Service struct {
	dismissalorderpb.UnimplementedDismissalOrderServiceServer
	client  *ent.Client
	timeout time.Duration
}

func New(client *ent.Client, timeout time.Duration) *Service {
	return &Service{client: client, timeout: timeout}
}

func (s *Service) withTimeout(ctx context.Context) (context.Context, context.CancelFunc) {
	return context.WithTimeout(ctx, s.timeout)
}

func (s *Service) CreateDismissalOrderHeader(ctx context.Context, req *dismissalorderpb.CreateDismissalOrderHeaderRequest) (*dismissalorderpb.CreateDismissalOrderHeaderResponse, error) {
	ctx, cancel := s.withTimeout(ctx)
	defer cancel()

	hdr, err := s.client.DismissalOrderHeader.
		Create().
		SetNumber(req.GetNumber()).
		SetPreparationDate(parseDate(req.GetPreparationDate())).
		SetOrganizationID(req.GetOrganizationId()).
		Save(ctx)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "create header: %v", err)
	}
	return &dismissalorderpb.CreateDismissalOrderHeaderResponse{Header: toProtoHeader(hdr)}, nil
}

func (s *Service) GetDismissalOrderHeader(ctx context.Context, req *dismissalorderpb.GetDismissalOrderHeaderRequest) (*dismissalorderpb.GetDismissalOrderHeaderResponse, error) {
	ctx, cancel := s.withTimeout(ctx)
	defer cancel()

	hdr, err := s.client.DismissalOrderHeader.Get(ctx, req.GetId())
	if err != nil {
		return nil, status.Errorf(codes.NotFound, "header not found: %v", err)
	}
	return &dismissalorderpb.GetDismissalOrderHeaderResponse{Header: toProtoHeader(hdr)}, nil
}

func (s *Service) ListDismissalOrderHeaders(ctx context.Context, req *dismissalorderpb.ListDismissalOrderHeadersRequest) (*dismissalorderpb.ListDismissalOrderHeadersResponse, error) {
	ctx, cancel := s.withTimeout(ctx)
	defer cancel()

	q := s.client.DismissalOrderHeader.Query()
	if req.GetLimit() > 0 {
		q = q.Limit(int(req.GetLimit()))
	}
	if req.GetOffset() > 0 {
		q = q.Offset(int(req.GetOffset()))
	}

	list, err := q.All(ctx)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "list headers: %v", err)
	}
	resp := &dismissalorderpb.ListDismissalOrderHeadersResponse{Headers: make([]*dismissalorderpb.DismissalOrderHeader, 0, len(list))}
	for _, h := range list {
		resp.Headers = append(resp.Headers, toProtoHeader(h))
	}
	return resp, nil
}

func (s *Service) UpdateDismissalOrderHeader(ctx context.Context, req *dismissalorderpb.UpdateDismissalOrderHeaderRequest) (*dismissalorderpb.UpdateDismissalOrderHeaderResponse, error) {
	ctx, cancel := s.withTimeout(ctx)
	defer cancel()

	upd := s.client.DismissalOrderHeader.UpdateOneID(req.GetId())
	if req.Number != "" {
		upd = upd.SetNumber(req.GetNumber())
	}
	if req.PreparationDate != "" {
		upd = upd.SetPreparationDate(parseDate(req.GetPreparationDate()))
	}
	if req.OrganizationId != 0 {
		upd = upd.SetOrganizationID(req.GetOrganizationId())
	}

	hdr, err := upd.Save(ctx)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "update header: %v", err)
	}
	return &dismissalorderpb.UpdateDismissalOrderHeaderResponse{Header: toProtoHeader(hdr)}, nil
}

func (s *Service) DeleteDismissalOrderHeader(ctx context.Context, req *dismissalorderpb.DeleteDismissalOrderHeaderRequest) (*dismissalorderpb.DeleteDismissalOrderHeaderResponse, error) {
	ctx, cancel := s.withTimeout(ctx)
	defer cancel()

	if err := s.client.DismissalOrderHeader.DeleteOneID(req.GetId()).Exec(ctx); err != nil {
		return nil, status.Errorf(codes.Internal, "delete header: %v", err)
	}
	return &dismissalorderpb.DeleteDismissalOrderHeaderResponse{}, nil
}

func (s *Service) CreateDismissalOrderBody(ctx context.Context, req *dismissalorderpb.CreateDismissalOrderBodyRequest) (*dismissalorderpb.CreateDismissalOrderBodyResponse, error) {
	ctx, cancel := s.withTimeout(ctx)
	defer cancel()

	var docNumber *int
	var docDate *time.Time
	if req.DocNumber != 0 {
		v := int(req.GetDocNumber())
		docNumber = &v
	}
	if req.GetDocDate() != "" {
		d := parseDate(req.GetDocDate())
		docDate = &d
	}

	body, err := s.client.DismissalOrderBody.
		Create().
		SetDismissalOrderHeaderID(req.GetDismissalOrderHeaderId()).
		SetEmploymentContractID(req.GetEmploymentContractId()).
		SetDepartmentID(req.GetDepartmentId()).
		SetPositionID(req.GetPositionId()).
		SetDismissalDate(parseDate(req.GetDismissalDate())).
		SetDismissalGround(req.GetDismissalGround()).
		SetNillableDocNumber(docNumber).
		SetNillableDocDate(docDate).
		Save(ctx)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "create body: %v", err)
	}
	return &dismissalorderpb.CreateDismissalOrderBodyResponse{Body: toProtoBody(body)}, nil
}

func (s *Service) GetDismissalOrderBody(ctx context.Context, req *dismissalorderpb.GetDismissalOrderBodyRequest) (*dismissalorderpb.GetDismissalOrderBodyResponse, error) {
	ctx, cancel := s.withTimeout(ctx)
	defer cancel()

	body, err := s.client.DismissalOrderBody.Get(ctx, req.GetId())
	if err != nil {
		return nil, status.Errorf(codes.NotFound, "body not found: %v", err)
	}
	return &dismissalorderpb.GetDismissalOrderBodyResponse{Body: toProtoBody(body)}, nil
}

func (s *Service) ListDismissalOrderBodies(ctx context.Context, req *dismissalorderpb.ListDismissalOrderBodiesRequest) (*dismissalorderpb.ListDismissalOrderBodiesResponse, error) {
	ctx, cancel := s.withTimeout(ctx)
	defer cancel()

	q := s.client.DismissalOrderBody.Query()
	if req.GetHeaderId() != 0 {
		q = q.Where(dismissalorderbody.DismissalOrderHeaderIDEQ(req.GetHeaderId()))
	}
	if req.GetLimit() > 0 {
		q = q.Limit(int(req.GetLimit()))
	}
	if req.GetOffset() > 0 {
		q = q.Offset(int(req.GetOffset()))
	}

	list, err := q.All(ctx)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "list bodies: %v", err)
	}
	resp := &dismissalorderpb.ListDismissalOrderBodiesResponse{Bodies: make([]*dismissalorderpb.DismissalOrderBody, 0, len(list))}
	for _, b := range list {
		resp.Bodies = append(resp.Bodies, toProtoBody(b))
	}
	return resp, nil
}

func (s *Service) UpdateDismissalOrderBody(ctx context.Context, req *dismissalorderpb.UpdateDismissalOrderBodyRequest) (*dismissalorderpb.UpdateDismissalOrderBodyResponse, error) {
	ctx, cancel := s.withTimeout(ctx)
	defer cancel()

	upd := s.client.DismissalOrderBody.UpdateOneID(req.GetId())
	if req.DismissalOrderHeaderId != 0 {
		upd = upd.SetDismissalOrderHeaderID(req.GetDismissalOrderHeaderId())
	}
	if req.EmploymentContractId != 0 {
		upd = upd.SetEmploymentContractID(req.GetEmploymentContractId())
	}
	if req.DepartmentId != 0 {
		upd = upd.SetDepartmentID(req.GetDepartmentId())
	}
	if req.PositionId != 0 {
		upd = upd.SetPositionID(req.GetPositionId())
	}
	if req.DismissalDate != "" {
		upd = upd.SetDismissalDate(parseDate(req.GetDismissalDate()))
	}
	if req.DismissalGround != "" {
		upd = upd.SetDismissalGround(req.GetDismissalGround())
	}
	if req.DocNumber != 0 {
		upd = upd.SetDocNumber(int(req.GetDocNumber()))
	}
	if req.GetDocDate() != "" {
		upd = upd.SetDocDate(parseDate(req.GetDocDate()))
	}

	body, err := upd.Save(ctx)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "update body: %v", err)
	}
	return &dismissalorderpb.UpdateDismissalOrderBodyResponse{Body: toProtoBody(body)}, nil
}

func (s *Service) DeleteDismissalOrderBody(ctx context.Context, req *dismissalorderpb.DeleteDismissalOrderBodyRequest) (*dismissalorderpb.DeleteDismissalOrderBodyResponse, error) {
	ctx, cancel := s.withTimeout(ctx)
	defer cancel()

	if err := s.client.DismissalOrderBody.DeleteOneID(req.GetId()).Exec(ctx); err != nil {
		return nil, status.Errorf(codes.Internal, "delete body: %v", err)
	}
	return &dismissalorderpb.DeleteDismissalOrderBodyResponse{}, nil
}

func toProtoHeader(h *ent.DismissalOrderHeader) *dismissalorderpb.DismissalOrderHeader {
	return &dismissalorderpb.DismissalOrderHeader{
		Id:              h.ID,
		Number:          h.Number,
		PreparationDate: h.PreparationDate.Format(time.DateOnly),
		OrganizationId:  h.OrganizationID,
	}
}

func toProtoBody(b *ent.DismissalOrderBody) *dismissalorderpb.DismissalOrderBody {
	return &dismissalorderpb.DismissalOrderBody{
		Id:                     b.ID,
		DismissalOrderHeaderId: b.DismissalOrderHeaderID,
		EmploymentContractId:   b.EmploymentContractID,
		DepartmentId:           b.DepartmentID,
		PositionId:             b.PositionID,
		DismissalDate:          b.DismissalDate.Format(time.DateOnly),
		DismissalGround:        b.DismissalGround,
		DocNumber:              int32(zeroIfNilInt(b.DocNumber)),
		DocDate:                func() string { if b.DocDate == nil { return "" }; return b.DocDate.Format(time.DateOnly) }(),
	}
}

func zeroIfNilInt(v *int) int {
	if v == nil {
		return 0
	}
	return *v
}

func parseDate(s string) time.Time { t, _ := time.Parse(time.DateOnly, s); return t }
