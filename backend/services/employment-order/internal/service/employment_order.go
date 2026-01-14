package service

import (
	"context"
	"github.com/example/micro/employment-order/ent/employmentorderheader"
	"time"

	"github.com/example/micro/employment-order/ent"
	"github.com/example/micro/employment-order/ent/employmentorderbody"
	employmentorderpb "github.com/example/micro/proto/gen/go/employment_order"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// Service implements EmploymentOrderServiceServer.
type Service struct {
	employmentorderpb.UnimplementedEmploymentOrderServiceServer
	client  *ent.Client
	timeout time.Duration
}

func New(client *ent.Client, timeout time.Duration) *Service {
	return &Service{client: client, timeout: timeout}
}

func (s *Service) withTimeout(ctx context.Context) (context.Context, context.CancelFunc) {
	return context.WithTimeout(ctx, s.timeout)
}

func (s *Service) CreateEmploymentOrderHeader(ctx context.Context, req *employmentorderpb.CreateEmploymentOrderHeaderRequest) (*employmentorderpb.CreateEmploymentOrderHeaderResponse, error) {
	ctx, cancel := s.withTimeout(ctx)
	defer cancel()

	hdr, err := s.client.EmploymentOrderHeader.
		Create().
		SetNumber(req.GetNumber()).
		SetPreparationDate(parseDate(req.GetPreparationDate())).
		SetOrganizationID(req.GetOrganizationId()).
		Save(ctx)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "create header: %v", err)
	}
	// Re-fetch via Select+Scan to normalize date safely
	getResp, err := s.GetEmploymentOrderHeader(ctx, &employmentorderpb.GetEmploymentOrderHeaderRequest{Id: hdr.ID})
	if err != nil {
		return nil, status.Errorf(codes.Internal, "create header: failed to fetch header: %v", err)
	}
	return &employmentorderpb.CreateEmploymentOrderHeaderResponse{Header: getResp.GetHeader()}, nil
}

func (s *Service) GetEmploymentOrderHeader(ctx context.Context, req *employmentorderpb.GetEmploymentOrderHeaderRequest) (*employmentorderpb.GetEmploymentOrderHeaderResponse, error) {
	ctx, cancel := s.withTimeout(ctx)
	defer cancel()

	// Use Select+Scan to avoid scanning date/time columns into time.Time where driver returns strings
	sel := s.client.EmploymentOrderHeader.Query().Where(employmentorderheader.IDEQ(req.GetId())).Select(
		employmentorderheader.FieldID,
		employmentorderheader.FieldNumber,
		employmentorderheader.FieldPreparationDate,
		employmentorderheader.FieldOrganizationID,
	)

	var rows []struct {
		Id              int64  `json:"id,omitempty"`
		Number          string `json:"number,omitempty"`
		PreparationDate string `json:"preparation_date,omitempty"`
		OrganizationId  int64  `json:"organization_id,omitempty"`
	}

	if err := sel.Scan(ctx, &rows); err != nil {
		return nil, status.Errorf(codes.NotFound, "header not found: %v", err)
	}
	if len(rows) == 0 {
		return nil, status.Errorf(codes.NotFound, "header not found")
	}
	r := rows[0]
	prep := normalizeDateString(r.PreparationDate)
	return &employmentorderpb.GetEmploymentOrderHeaderResponse{Header: &employmentorderpb.EmploymentOrderHeader{
		Id:              r.Id,
		Number:          r.Number,
		PreparationDate: prep,
		OrganizationId:  r.OrganizationId,
	}}, nil
}

func (s *Service) ListEmploymentOrderHeaders(ctx context.Context, req *employmentorderpb.ListEmploymentOrderHeadersRequest) (*employmentorderpb.ListEmploymentOrderHeadersResponse, error) {
	ctx, cancel := s.withTimeout(ctx)
	defer cancel()
	q := s.client.EmploymentOrderHeader.Query()
	if req.GetLimit() > 0 {
		q = q.Limit(int(req.GetLimit()))
	}
	if req.GetOffset() > 0 {
		q = q.Offset(int(req.GetOffset()))
	}

	var rows []struct {
		Id              int64  `json:"id,omitempty"`
		Number          string `json:"number,omitempty"`
		PreparationDate string `json:"preparation_date,omitempty"`
		OrganizationId  int64  `json:"organization_id,omitempty"`
	}

	if err := q.Select(
		employmentorderheader.FieldID,
		employmentorderheader.FieldNumber,
		employmentorderheader.FieldPreparationDate,
		employmentorderheader.FieldOrganizationID,
	).Scan(ctx, &rows); err != nil {
		return nil, status.Errorf(codes.Internal, "list headers: %v", err)
	}
	resp := &employmentorderpb.ListEmploymentOrderHeadersResponse{Headers: make([]*employmentorderpb.EmploymentOrderHeader, 0, len(rows))}
	for _, r := range rows {
		prep := normalizeDateString(r.PreparationDate)
		resp.Headers = append(resp.Headers, &employmentorderpb.EmploymentOrderHeader{
			Id:              r.Id,
			Number:          r.Number,
			PreparationDate: prep,
			OrganizationId:  r.OrganizationId,
		})
	}
	return resp, nil
}

func (s *Service) UpdateEmploymentOrderHeader(ctx context.Context, req *employmentorderpb.UpdateEmploymentOrderHeaderRequest) (*employmentorderpb.UpdateEmploymentOrderHeaderResponse, error) {
	ctx, cancel := s.withTimeout(ctx)
	defer cancel()
	u := s.client.EmploymentOrderHeader.Update().Where(employmentorderheader.IDEQ(req.GetId()))
	if req.Number != "" {
		u = u.SetNumber(req.GetNumber())
	}
	if req.PreparationDate != "" {
		u = u.SetPreparationDate(parseDate(req.GetPreparationDate()))
	}
	if req.OrganizationId != 0 {
		u = u.SetOrganizationID(req.GetOrganizationId())
	}

	if _, err := u.Save(ctx); err != nil {
		return nil, status.Errorf(codes.Internal, "update header: %v", err)
	}
	// re-fetch via Select+Scan to normalize date
	getResp, err := s.GetEmploymentOrderHeader(ctx, &employmentorderpb.GetEmploymentOrderHeaderRequest{Id: req.GetId()})
	if err != nil {
		return nil, status.Errorf(codes.Internal, "update header: failed to fetch updated header: %v", err)
	}
	return &employmentorderpb.UpdateEmploymentOrderHeaderResponse{Header: getResp.GetHeader()}, nil
}

func (s *Service) DeleteEmploymentOrderHeader(ctx context.Context, req *employmentorderpb.DeleteEmploymentOrderHeaderRequest) (*employmentorderpb.DeleteEmploymentOrderHeaderResponse, error) {
	ctx, cancel := s.withTimeout(ctx)
	defer cancel()

	if err := s.client.EmploymentOrderHeader.DeleteOneID(req.GetId()).Exec(ctx); err != nil {
		return nil, status.Errorf(codes.Internal, "delete header: %v", err)
	}
	return &employmentorderpb.DeleteEmploymentOrderHeaderResponse{}, nil
}

func (s *Service) CreateEmploymentOrderBody(ctx context.Context, req *employmentorderpb.CreateEmploymentOrderBodyRequest) (*employmentorderpb.CreateEmploymentOrderBodyResponse, error) {
	ctx, cancel := s.withTimeout(ctx)
	defer cancel()

	var probation *int
	if req.ProbationMonths != 0 {
		v := int(req.GetProbationMonths())
		probation = &v
	}

	body, err := s.client.EmploymentOrderBody.
		Create().
		SetEmploymentOrderHeaderID(req.GetEmploymentOrderHeaderId()).
		SetEmploymentContractID(req.GetEmploymentContractId()).
		SetDepartmentID(req.GetDepartmentId()).
		SetPositionID(req.GetPositionId()).
		SetSalary(req.GetSalary()).
		SetWorkDateFrom(parseDate(req.GetWorkDateFrom())).
		SetWorkDateTo(parseDate(req.GetWorkDateTo())).
		SetNillableProbationMonths(probation).
		Save(ctx)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "create body: %v", err)
	}
	// Re-fetch via Select+Scan to normalize dates
	getResp, err := s.GetEmploymentOrderBody(ctx, &employmentorderpb.GetEmploymentOrderBodyRequest{Id: body.ID})
	if err != nil {
		return nil, status.Errorf(codes.Internal, "create body: failed to fetch body: %v", err)
	}
	return &employmentorderpb.CreateEmploymentOrderBodyResponse{Body: getResp.GetBody()}, nil
}

func (s *Service) GetEmploymentOrderBody(ctx context.Context, req *employmentorderpb.GetEmploymentOrderBodyRequest) (*employmentorderpb.GetEmploymentOrderBodyResponse, error) {
	ctx, cancel := s.withTimeout(ctx)
	defer cancel()

	// Use Select+Scan to avoid driver scan issues and to normalize date fields
	sel := s.client.EmploymentOrderBody.Query().Where(employmentorderbody.IDEQ(req.GetId())).Select(
		employmentorderbody.FieldID,
		employmentorderbody.FieldEmploymentOrderHeaderID,
		employmentorderbody.FieldEmploymentContractID,
		employmentorderbody.FieldDepartmentID,
		employmentorderbody.FieldPositionID,
		employmentorderbody.FieldSalary,
		employmentorderbody.FieldWorkDateFrom,
		employmentorderbody.FieldWorkDateTo,
		employmentorderbody.FieldProbationMonths,
	)

	var rows []struct {
		Id                      int64      `json:"id,omitempty"`
		EmploymentOrderHeaderId int64      `json:"employment_order_header_id,omitempty"`
		EmploymentContractId    int64      `json:"employment_contract_id,omitempty"`
		DepartmentId            int64      `json:"department_id,omitempty"`
		PositionId              int64      `json:"position_id,omitempty"`
		Salary                  float64    `json:"salary,omitempty"`
		WorkDateFrom            time.Time  `json:"work_date_from,omitempty"`
		WorkDateTo              *time.Time `json:"work_date_to,omitempty"`
		ProbationMonths         *int       `json:"probation_months,omitempty"`
	}

	if err := sel.Scan(ctx, &rows); err != nil {
		return nil, status.Errorf(codes.NotFound, "body not found: %v", err)
	}
	if len(rows) == 0 {
		return nil, status.Errorf(codes.NotFound, "body not found")
	}
	r := rows[0]
	pm := int32(0)
	if r.ProbationMonths != nil {
		pm = int32(*r.ProbationMonths)
	}
	var wt string
	if r.WorkDateTo != nil {
		wt = r.WorkDateTo.Format(time.DateOnly)
	}
	return &employmentorderpb.GetEmploymentOrderBodyResponse{Body: &employmentorderpb.EmploymentOrderBody{
		Id:                      r.Id,
		EmploymentOrderHeaderId: r.EmploymentOrderHeaderId,
		EmploymentContractId:    r.EmploymentContractId,
		DepartmentId:            r.DepartmentId,
		PositionId:              r.PositionId,
		Salary:                  r.Salary,
		WorkDateFrom:            r.WorkDateFrom.Format(time.DateOnly),
		WorkDateTo:              wt,
		ProbationMonths:         pm,
	}}, nil
}

func (s *Service) ListEmploymentOrderBodies(ctx context.Context, req *employmentorderpb.ListEmploymentOrderBodiesRequest) (*employmentorderpb.ListEmploymentOrderBodiesResponse, error) {
	ctx, cancel := s.withTimeout(ctx)
	defer cancel()
	q := s.client.EmploymentOrderBody.Query()
	if req.GetHeaderId() != 0 {
		q = q.Where(employmentorderbody.EmploymentOrderHeaderIDEQ(req.GetHeaderId()))
	}
	if req.GetLimit() > 0 {
		q = q.Limit(int(req.GetLimit()))
	}
	if req.GetOffset() > 0 {
		q = q.Offset(int(req.GetOffset()))
	}

	var rows []struct {
		Id                      int64      `json:"id,omitempty"`
		EmploymentOrderHeaderId int64      `json:"employment_order_header_id,omitempty"`
		EmploymentContractId    int64      `json:"employment_contract_id,omitempty"`
		DepartmentId            int64      `json:"department_id,omitempty"`
		PositionId              int64      `json:"position_id,omitempty"`
		Salary                  float64    `json:"salary,omitempty"`
		WorkDateFrom            time.Time  `json:"work_date_from,omitempty"`
		WorkDateTo              *time.Time `json:"work_date_to,omitempty"`
		ProbationMonths         *int       `json:"probation_months,omitempty"`
	}

	if err := q.Select(
		employmentorderbody.FieldID,
		employmentorderbody.FieldEmploymentOrderHeaderID,
		employmentorderbody.FieldEmploymentContractID,
		employmentorderbody.FieldDepartmentID,
		employmentorderbody.FieldPositionID,
		employmentorderbody.FieldSalary,
		employmentorderbody.FieldWorkDateFrom,
		employmentorderbody.FieldWorkDateTo,
		employmentorderbody.FieldProbationMonths,
	).Scan(ctx, &rows); err != nil {
		return nil, status.Errorf(codes.Internal, "list bodies: %v", err)
	}
	resp := &employmentorderpb.ListEmploymentOrderBodiesResponse{Bodies: make([]*employmentorderpb.EmploymentOrderBody, 0, len(rows))}
	for _, r := range rows {
		pm := int32(0)
		if r.ProbationMonths != nil {
			pm = int32(*r.ProbationMonths)
		}
		wt := ""
		if r.WorkDateTo != nil {
			wt = r.WorkDateTo.Format(time.DateOnly)
		}
		resp.Bodies = append(resp.Bodies, &employmentorderpb.EmploymentOrderBody{
			Id:                      r.Id,
			EmploymentOrderHeaderId: r.EmploymentOrderHeaderId,
			EmploymentContractId:    r.EmploymentContractId,
			DepartmentId:            r.DepartmentId,
			PositionId:              r.PositionId,
			Salary:                  r.Salary,
			WorkDateFrom:            r.WorkDateFrom.Format(time.DateOnly),
			WorkDateTo:              wt,
			ProbationMonths:         pm,
		})
	}
	return resp, nil
}

func (s *Service) UpdateEmploymentOrderBody(ctx context.Context, req *employmentorderpb.UpdateEmploymentOrderBodyRequest) (*employmentorderpb.UpdateEmploymentOrderBodyResponse, error) {
	ctx, cancel := s.withTimeout(ctx)
	defer cancel()
	u := s.client.EmploymentOrderBody.Update().Where(employmentorderbody.IDEQ(req.GetId()))
	if req.EmploymentOrderHeaderId != 0 {
		u = u.SetEmploymentOrderHeaderID(req.GetEmploymentOrderHeaderId())
	}
	if req.EmploymentContractId != 0 {
		u = u.SetEmploymentContractID(req.GetEmploymentContractId())
	}
	if req.DepartmentId != 0 {
		u = u.SetDepartmentID(req.GetDepartmentId())
	}
	if req.PositionId != 0 {
		u = u.SetPositionID(req.GetPositionId())
	}
	if req.Salary != 0 {
		u = u.SetSalary(req.GetSalary())
	}
	if req.WorkDateFrom != "" {
		u = u.SetWorkDateFrom(parseDate(req.GetWorkDateFrom()))
	}
	if req.WorkDateTo != "" {
		u = u.SetWorkDateTo(parseDate(req.GetWorkDateTo()))
	}
	if req.ProbationMonths != 0 {
		u = u.SetProbationMonths(int(req.GetProbationMonths()))
	}

	if _, err := u.Save(ctx); err != nil {
		return nil, status.Errorf(codes.Internal, "update body: %v", err)
	}
	// Re-fetch via Select+Scan to normalize dates
	getResp, err := s.GetEmploymentOrderBody(ctx, &employmentorderpb.GetEmploymentOrderBodyRequest{Id: req.GetId()})
	if err != nil {
		return nil, status.Errorf(codes.Internal, "update body: failed to fetch updated body: %v", err)
	}
	return &employmentorderpb.UpdateEmploymentOrderBodyResponse{Body: getResp.GetBody()}, nil
}

func (s *Service) DeleteEmploymentOrderBody(ctx context.Context, req *employmentorderpb.DeleteEmploymentOrderBodyRequest) (*employmentorderpb.DeleteEmploymentOrderBodyResponse, error) {
	ctx, cancel := s.withTimeout(ctx)
	defer cancel()

	if err := s.client.EmploymentOrderBody.DeleteOneID(req.GetId()).Exec(ctx); err != nil {
		return nil, status.Errorf(codes.Internal, "delete body: %v", err)
	}
	return &employmentorderpb.DeleteEmploymentOrderBodyResponse{}, nil
}

func toProtoHeader(h *ent.EmploymentOrderHeader) *employmentorderpb.EmploymentOrderHeader {
	return &employmentorderpb.EmploymentOrderHeader{
		Id:              h.ID,
		Number:          h.Number,
		PreparationDate: h.PreparationDate.Format(time.DateOnly),
		OrganizationId:  h.OrganizationID,
	}
}

func toProtoBody(b *ent.EmploymentOrderBody) *employmentorderpb.EmploymentOrderBody {
	return &employmentorderpb.EmploymentOrderBody{
		Id:                      b.ID,
		EmploymentOrderHeaderId: b.EmploymentOrderHeaderID,
		EmploymentContractId:    b.EmploymentContractID,
		DepartmentId:            b.DepartmentID,
		PositionId:              b.PositionID,
		Salary:                  b.Salary,
		WorkDateFrom:            b.WorkDateFrom.Format(time.DateOnly),
		WorkDateTo:              b.WorkDateTo.Format(time.DateOnly),
		ProbationMonths:         int32(zeroIfNilInt(b.ProbationMonths)),
	}
}

func zeroIfNilInt(v *int) int {
	if v == nil {
		return 0
	}
	return *v
}

// parseDate is tolerant: accepts YYYY-MM-DD and RFC3339 and returns zero time on parse failure
func parseDate(s string) time.Time {
	if s == "" {
		return time.Time{}
	}
	if t, err := time.Parse(time.DateOnly, s); err == nil {
		return t
	}
	if t, err := time.Parse(time.RFC3339, s); err == nil {
		return t
	}
	return time.Time{}
}

func parseDatePtr(s string) *time.Time {
	if s == "" {
		return nil
	}
	t := parseDate(s)
	if t.IsZero() {
		return nil
	}
	return &t
}

// helper: normalizeDateString returns YYYY-MM-DD if possible
func normalizeDateString(s string) string {
	if s == "" {
		return ""
	}
	if t, err := time.Parse(time.RFC3339, s); err == nil {
		return t.Format(time.DateOnly)
	}
	if t, err := time.Parse(time.DateOnly, s); err == nil {
		return t.Format(time.DateOnly)
	}
	return s
}
