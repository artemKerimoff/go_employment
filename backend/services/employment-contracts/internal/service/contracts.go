package service

import (
    "context"
    "time"

    "github.com/example/micro/employment-contracts/ent"
    "github.com/example/micro/employment-contracts/ent/employmentcontract"
    employmentcontractspb "github.com/example/micro/proto/gen/go/employment_contracts"
    "google.golang.org/grpc/codes"
    "google.golang.org/grpc/status"
)

// Service implements EmploymentContractsServiceServer.
type Service struct {
    employmentcontractspb.UnimplementedEmploymentContractsServiceServer
    client  *ent.Client
    timeout time.Duration
}

func New(client *ent.Client, timeout time.Duration) *Service {
    return &Service{client: client, timeout: timeout}
}

func (s *Service) withTimeout(ctx context.Context) (context.Context, context.CancelFunc) {
    return context.WithTimeout(ctx, s.timeout)
}

func (s *Service) CreateEmploymentContract(ctx context.Context, req *employmentcontractspb.CreateEmploymentContractRequest) (*employmentcontractspb.CreateEmploymentContractResponse, error) {
    ctx, cancel := s.withTimeout(ctx)
    defer cancel()

    create := s.client.EmploymentContract.
        Create().
        SetNumber(req.GetNumber()).
        SetPersonnelNumber(req.GetPersonnelNumber()).
        SetConclusionDate(parseDate(req.GetConclusionDate())).
        SetOrganizationID(req.GetOrganizationId()).
        SetRepresentativeID(req.GetRepresentativeId()).
        SetEmployeeID(req.GetEmployeeId()).
        SetDepartmentID(req.GetDepartmentId()).
        SetPositionID(req.GetPositionId()).
        SetConditionsClass(int(req.GetConditionsClass())).
        SetWorkDateFrom(parseDate(req.GetWorkDateFrom())).
        SetNillableWorkDateTo(parseDatePtr(req.GetWorkDateTo())).
        SetProbationMonths(int(req.GetProbationMonths())).
        SetSalary(float64(req.GetSalary()))

    if req.GetWorkHoursFrom() != "" {
        create = create.SetWorkHoursFrom(parseTime(req.GetWorkHoursFrom()))
    } else {
        // default work start
        create = create.SetWorkHoursFrom(parseTime("09:00"))
    }
    if req.GetWorkHoursTo() != "" {
        create = create.SetWorkHoursTo(parseTime(req.GetWorkHoursTo()))
    } else {
        // default work end
        create = create.SetWorkHoursTo(parseTime("18:00"))
    }

    var saved *ent.EmploymentContract
    var err error
    saved, err = create.SetNillableBreakFrom(parseTimePtr(req.GetBreakFrom())).SetNillableBreakTo(parseTimePtr(req.GetBreakTo())).SetPaidLeaveDays(int(req.GetPaidLeaveDays())).Save(ctx)
    if err != nil {
        return nil, status.Errorf(codes.Internal, "create contract: %v", err)
    }
    return &employmentcontractspb.CreateEmploymentContractResponse{Contract: toProto(saved)}, nil
}

func (s *Service) GetEmploymentContract(ctx context.Context, req *employmentcontractspb.GetEmploymentContractRequest) (*employmentcontractspb.GetEmploymentContractResponse, error) {
    ctx, cancel := s.withTimeout(ctx)
    defer cancel()
    // Use Select+Scan to avoid scanning time columns into time.Time
    var r struct {
        Id               int64   `json:"id,omitempty"`
        Number           string  `json:"number,omitempty"`
        ConclusionDate   string  `json:"conclusion_date,omitempty"`
        OrganizationId   int64   `json:"organization_id,omitempty"`
        RepresentativeId int64   `json:"representative_id,omitempty"`
        EmployeeId       int64   `json:"employee_id,omitempty"`
        DepartmentId     int64   `json:"department_id,omitempty"`
        PositionId       int64   `json:"position_id,omitempty"`
        ConditionsClass  int32   `json:"conditions_class,omitempty"`
        WorkDateFrom     string  `json:"work_date_from,omitempty"`
        WorkDateTo       *string `json:"work_date_to,omitempty"`
        ProbationMonths  int32   `json:"probation_months,omitempty"`
        Salary           float32 `json:"salary,omitempty"`
        WorkHoursFrom    string  `json:"work_hours_from,omitempty"`
        WorkHoursTo      string  `json:"work_hours_to,omitempty"`
        BreakFrom        *string `json:"break_from,omitempty"`
        BreakTo          *string `json:"break_to,omitempty"`
        PaidLeaveDays    int32   `json:"paid_leave_days,omitempty"`
        PersonnelNumber  string  `json:"personnel_number,omitempty"`
    }

    sel := s.client.EmploymentContract.Query().Where(employmentcontract.IDEQ(req.GetId())).Select(
        employmentcontract.FieldID,
        employmentcontract.FieldNumber,
        employmentcontract.FieldConclusionDate,
        employmentcontract.FieldOrganizationID,
        employmentcontract.FieldRepresentativeID,
        employmentcontract.FieldEmployeeID,
        employmentcontract.FieldDepartmentID,
        employmentcontract.FieldPositionID,
        employmentcontract.FieldConditionsClass,
        employmentcontract.FieldWorkDateFrom,
        employmentcontract.FieldWorkDateTo,
        employmentcontract.FieldProbationMonths,
        employmentcontract.FieldSalary,
        employmentcontract.FieldWorkHoursFrom,
        employmentcontract.FieldWorkHoursTo,
        employmentcontract.FieldBreakFrom,
        employmentcontract.FieldBreakTo,
        employmentcontract.FieldPaidLeaveDays,
        employmentcontract.FieldPersonnelNumber,
    )
    var rows []struct {
        Id               int64   `json:"id,omitempty"`
        Number           string  `json:"number,omitempty"`
        ConclusionDate   string  `json:"conclusion_date,omitempty"`
        OrganizationId   int64   `json:"organization_id,omitempty"`
        RepresentativeId int64   `json:"representative_id,omitempty"`
        EmployeeId       int64   `json:"employee_id,omitempty"`
        DepartmentId     int64   `json:"department_id,omitempty"`
        PositionId       int64   `json:"position_id,omitempty"`
        ConditionsClass  int32   `json:"conditions_class,omitempty"`
        WorkDateFrom     string  `json:"work_date_from,omitempty"`
        WorkDateTo       *string `json:"work_date_to,omitempty"`
        ProbationMonths  int32   `json:"probation_months,omitempty"`
        Salary           float32 `json:"salary,omitempty"`
        WorkHoursFrom    string  `json:"work_hours_from,omitempty"`
        WorkHoursTo      string  `json:"work_hours_to,omitempty"`
        BreakFrom        *string `json:"break_from,omitempty"`
        BreakTo          *string `json:"break_to,omitempty"`
        PaidLeaveDays    int32   `json:"paid_leave_days,omitempty"`
        PersonnelNumber  string  `json:"personnel_number,omitempty"`
    }

    if err := sel.Scan(ctx, &rows); err != nil {
        return nil, status.Errorf(codes.NotFound, "contract not found: %v", err)
    }
    if len(rows) == 0 {
        return nil, status.Errorf(codes.NotFound, "contract not found")
    }
    r = rows[0]

    conclusion := normalizeDateString(r.ConclusionDate)
    workDateFrom := normalizeDateString(r.WorkDateFrom)
    workDateTo := ""
    if r.WorkDateTo != nil {
        workDateTo = normalizeDateString(*r.WorkDateTo)
    }
    wf := normalizeTimeString(r.WorkHoursFrom)
    wt := normalizeTimeString(r.WorkHoursTo)
    bf := ""
    if r.BreakFrom != nil {
        bf = normalizeTimeString(*r.BreakFrom)
    }
    bt := ""
    if r.BreakTo != nil {
        bt = normalizeTimeString(*r.BreakTo)
    }

    return &employmentcontractspb.GetEmploymentContractResponse{Contract: &employmentcontractspb.EmploymentContract{
        Id:               r.Id,
        Number:           r.Number,
        ConclusionDate:   conclusion,
        OrganizationId:   r.OrganizationId,
        RepresentativeId: r.RepresentativeId,
        EmployeeId:       r.EmployeeId,
        DepartmentId:     r.DepartmentId,
        PositionId:       r.PositionId,
        ConditionsClass:  r.ConditionsClass,
        WorkDateFrom:     workDateFrom,
        WorkDateTo:       workDateTo,
        ProbationMonths:  r.ProbationMonths,
        Salary:           r.Salary,
        WorkHoursFrom:    wf,
        WorkHoursTo:      wt,
        BreakFrom:        bf,
        BreakTo:          bt,
        PaidLeaveDays:    r.PaidLeaveDays,
        PersonnelNumber:  r.PersonnelNumber,
    }}, nil
}

func (s *Service) ListEmploymentContracts(ctx context.Context, req *employmentcontractspb.ListEmploymentContractsRequest) (*employmentcontractspb.ListEmploymentContractsResponse, error) {
    ctx, cancel := s.withTimeout(ctx)
    defer cancel()
    // Use Select + Scan to avoid driver Scan issues for time columns -> read as strings
    q := s.client.EmploymentContract.Query()
    if req.GetLimit() > 0 {
        q = q.Limit(int(req.GetLimit()))
    }
    if req.GetOffset() > 0 {
        q = q.Offset(int(req.GetOffset()))
    }

    var rows []struct {
        Id               int64   `json:"id,omitempty"`
        Number           string  `json:"number,omitempty"`
        ConclusionDate   string  `json:"conclusion_date,omitempty"`
        OrganizationId   int64   `json:"organization_id,omitempty"`
        RepresentativeId int64   `json:"representative_id,omitempty"`
        EmployeeId       int64   `json:"employee_id,omitempty"`
        DepartmentId     int64   `json:"department_id,omitempty"`
        PositionId       int64   `json:"position_id,omitempty"`
        ConditionsClass  int32   `json:"conditions_class,omitempty"`
        WorkDateFrom     string  `json:"work_date_from,omitempty"`
        WorkDateTo       *string `json:"work_date_to,omitempty"`
        ProbationMonths  int32   `json:"probation_months,omitempty"`
        Salary           float32 `json:"salary,omitempty"`
        WorkHoursFrom    string  `json:"work_hours_from,omitempty"`
        WorkHoursTo      string  `json:"work_hours_to,omitempty"`
        BreakFrom        *string `json:"break_from,omitempty"`
        BreakTo          *string `json:"break_to,omitempty"`
        PaidLeaveDays    int32   `json:"paid_leave_days,omitempty"`
        PersonnelNumber  string  `json:"personnel_number,omitempty"`
    }

    if err := q.Select(
        employmentcontract.FieldID,
        employmentcontract.FieldNumber,
        employmentcontract.FieldConclusionDate,
        employmentcontract.FieldOrganizationID,
        employmentcontract.FieldRepresentativeID,
        employmentcontract.FieldEmployeeID,
        employmentcontract.FieldDepartmentID,
        employmentcontract.FieldPositionID,
        employmentcontract.FieldConditionsClass,
        employmentcontract.FieldWorkDateFrom,
        employmentcontract.FieldWorkDateTo,
        employmentcontract.FieldProbationMonths,
        employmentcontract.FieldSalary,
        employmentcontract.FieldWorkHoursFrom,
        employmentcontract.FieldWorkHoursTo,
        employmentcontract.FieldBreakFrom,
        employmentcontract.FieldBreakTo,
        employmentcontract.FieldPaidLeaveDays,
        employmentcontract.FieldPersonnelNumber,
    ).Scan(ctx, &rows); err != nil {
        return nil, status.Errorf(codes.Internal, "list contracts: %v", err)
    }

    resp := &employmentcontractspb.ListEmploymentContractsResponse{Contracts: make([]*employmentcontractspb.EmploymentContract, 0, len(rows))}
    for _, r := range rows {
        conclusion := normalizeDateString(r.ConclusionDate)
        workDateFrom := normalizeDateString(r.WorkDateFrom)
        workDateTo := ""
        if r.WorkDateTo != nil {
            workDateTo = normalizeDateString(*r.WorkDateTo)
        }
        wf := normalizeTimeString(r.WorkHoursFrom)
        wt := normalizeTimeString(r.WorkHoursTo)
        bf := ""
        if r.BreakFrom != nil {
            bf = normalizeTimeString(*r.BreakFrom)
        }
        bt := ""
        if r.BreakTo != nil {
            bt = normalizeTimeString(*r.BreakTo)
        }
        resp.Contracts = append(resp.Contracts, &employmentcontractspb.EmploymentContract{
            Id:               r.Id,
            Number:           r.Number,
            ConclusionDate:   conclusion,
            OrganizationId:   r.OrganizationId,
            RepresentativeId: r.RepresentativeId,
            EmployeeId:       r.EmployeeId,
            DepartmentId:     r.DepartmentId,
            PositionId:       r.PositionId,
            ConditionsClass:  r.ConditionsClass,
            WorkDateFrom:     workDateFrom,
            WorkDateTo:       workDateTo,
            ProbationMonths:  r.ProbationMonths,
            Salary:           r.Salary,
            WorkHoursFrom:    wf,
            WorkHoursTo:      wt,
            BreakFrom:        bf,
            BreakTo:          bt,
            PaidLeaveDays:    r.PaidLeaveDays,
            PersonnelNumber:  r.PersonnelNumber,
        })
    }
    return resp, nil
}

func (s *Service) UpdateEmploymentContract(ctx context.Context, req *employmentcontractspb.UpdateEmploymentContractRequest) (*employmentcontractspb.UpdateEmploymentContractResponse, error) {
    ctx, cancel := s.withTimeout(ctx)
    defer cancel()

    u := s.client.EmploymentContract.Update().Where(employmentcontract.IDEQ(req.GetId()))
    if req.Number != "" {
        u = u.SetNumber(req.GetNumber())
    }
    if req.ConclusionDate != "" {
        u = u.SetConclusionDate(parseDate(req.GetConclusionDate()))
    }
    if req.OrganizationId != 0 {
        u = u.SetOrganizationID(req.GetOrganizationId())
    }
    if req.RepresentativeId != 0 {
        u = u.SetRepresentativeID(req.GetRepresentativeId())
    }
    if req.EmployeeId != 0 {
        u = u.SetEmployeeID(req.GetEmployeeId())
    }
    if req.DepartmentId != 0 {
        u = u.SetDepartmentID(req.GetDepartmentId())
    }
    if req.PositionId != 0 {
        u = u.SetPositionID(req.GetPositionId())
    }
    if req.PersonnelNumber != "" {
        u = u.SetPersonnelNumber(req.GetPersonnelNumber())
    }
    if req.ConditionsClass != 0 {
        u = u.SetConditionsClass(int(req.GetConditionsClass()))
    }
    if req.WorkDateFrom != "" {
        u = u.SetWorkDateFrom(parseDate(req.GetWorkDateFrom()))
    }
    u = u.SetNillableWorkDateTo(parseDatePtr(req.GetWorkDateTo()))
    // probation can be 0 intentionally; treat -1 as "not set"
    if req.ProbationMonths != 0 {
        u = u.SetProbationMonths(int(req.GetProbationMonths()))
    }
    if req.Salary != 0 {
        u = u.SetSalary(float64(req.GetSalary()))
    }
    if req.WorkHoursFrom != "" {
        u = u.SetWorkHoursFrom(parseTime(req.GetWorkHoursFrom()))
    }
    if req.WorkHoursTo != "" {
        u = u.SetWorkHoursTo(parseTime(req.GetWorkHoursTo()))
    }
    u = u.SetNillableBreakFrom(parseTimePtr(req.GetBreakFrom()))
    u = u.SetNillableBreakTo(parseTimePtr(req.GetBreakTo()))
    if req.PaidLeaveDays != 0 {
        u = u.SetPaidLeaveDays(int(req.GetPaidLeaveDays()))
    }

    if _, err := u.Save(ctx); err != nil {
        return nil, status.Errorf(codes.Internal, "update contract: %v", err)
    }

    // Re-fetch the updated contract using Select+Scan to normalize date/time safely
    getResp, err := s.GetEmploymentContract(ctx, &employmentcontractspb.GetEmploymentContractRequest{Id: req.GetId()})
    if err != nil {
        return nil, status.Errorf(codes.Internal, "update contract: failed to fetch updated contract: %v", err)
    }
    return &employmentcontractspb.UpdateEmploymentContractResponse{Contract: getResp.GetContract()}, nil
}

func (s *Service) DeleteEmploymentContract(ctx context.Context, req *employmentcontractspb.DeleteEmploymentContractRequest) (*employmentcontractspb.DeleteEmploymentContractResponse, error) {
    ctx, cancel := s.withTimeout(ctx)
    defer cancel()

    if err := s.client.EmploymentContract.DeleteOneID(req.GetId()).Exec(ctx); err != nil {
        return nil, status.Errorf(codes.Internal, "delete contract: %v", err)
    }
    return &employmentcontractspb.DeleteEmploymentContractResponse{}, nil
}

func toProto(c *ent.EmploymentContract) *employmentcontractspb.EmploymentContract {
    var breakFrom, breakTo, workDateTo string
    if c.BreakFrom != nil {
        breakFrom = c.BreakFrom.Format("15:04")
    }
    if c.BreakTo != nil {
        breakTo = c.BreakTo.Format("15:04")
    }
    if c.WorkDateTo != nil {
        workDateTo = c.WorkDateTo.Format(time.DateOnly)
    }
    return &employmentcontractspb.EmploymentContract{
        Id:               c.ID,
        Number:           c.Number,
        ConclusionDate:   c.ConclusionDate.Format(time.DateOnly),
        OrganizationId:   c.OrganizationID,
        RepresentativeId: c.RepresentativeID,
        EmployeeId:       c.EmployeeID,
        DepartmentId:     c.DepartmentID,
        PositionId:       c.PositionID,
        ConditionsClass:  int32(c.ConditionsClass),
        WorkDateFrom:     c.WorkDateFrom.Format(time.DateOnly),
        WorkDateTo:       workDateTo,
        ProbationMonths:  int32(zeroIfNilInt(c.ProbationMonths)),
        Salary:           float32(c.Salary),
        WorkHoursFrom:    c.WorkHoursFrom.Format("15:04"),
        WorkHoursTo:      c.WorkHoursTo.Format("15:04"),
        BreakFrom:        breakFrom,
        BreakTo:          breakTo,
        PaidLeaveDays:    int32(c.PaidLeaveDays),
        PersonnelNumber:  c.PersonnelNumber,
    }
}

func zeroIfNilInt(v *int) int {
    if v == nil {
        return 0
    }
    return *v
}

// parseDate and parseTime helpers would parse ISO8601; stubbed to keep code concise here.
func parseDate(s string) time.Time {
    if s == "" {
        return time.Time{}
    }
    // try date-only first
    if t, err := time.Parse(time.DateOnly, s); err == nil {
        return t
    }
    // try RFC3339
    if t, err := time.Parse(time.RFC3339, s); err == nil {
        return t
    }
    return time.Time{}
}

// parseTime accepts "HH:MM" or "HH:MM:SS" and returns time.Time with parsed clock on zero date.
func parseTime(s string) time.Time {
    if s == "" {
        return time.Time{}
    }
    // Try HH:MM:SS
    if t, err := time.Parse("15:04:05", s); err == nil {
        return t
    }
    // Try HH:MM
    if t, err := time.Parse("15:04", s); err == nil {
        return t
    }
    // Try TimeOnly constant (if available)
    if t, err := time.Parse(time.TimeOnly, s); err == nil {
        return t
    }
    // Fallback: return zero time
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

func parseTimePtr(s string) *time.Time {
    if s == "" {
        return nil
    }
    t := parseTime(s)
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

// helper: normalizeTimeString returns HH:MM if possible
func normalizeTimeString(s string) string {
    if s == "" {
        return ""
    }
    // try parse HH:MM:SS
    if t, err := time.Parse("15:04:05", s); err == nil {
        return t.Format("15:04")
    }
    // try parse HH:MM
    if t, err := time.Parse("15:04", s); err == nil {
        return t.Format("15:04")
    }
    // try RFC3339
    if t, err := time.Parse(time.RFC3339, s); err == nil {
        return t.Format("15:04")
    }
    // fallback to first 5 chars if looks like HH:MM:SS
    if len(s) >= 5 {
        return s[:5]
    }
    return s
}
