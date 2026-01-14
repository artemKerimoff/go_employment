package service

import (
    "context"
    "time"

    "github.com/example/micro/individuals/ent"
    individualspb "github.com/example/micro/proto/gen/go/individuals"
    "google.golang.org/grpc/codes"
    "google.golang.org/grpc/status"
)

// Service implements IndividualsServiceServer.
type Service struct {
    individualspb.UnimplementedIndividualsServiceServer
    client  *ent.Client
    timeout time.Duration
}

func New(client *ent.Client, timeout time.Duration) *Service {
    return &Service{client: client, timeout: timeout}
}

func (s *Service) withTimeout(ctx context.Context) (context.Context, context.CancelFunc) {
    return context.WithTimeout(ctx, s.timeout)
}

func (s *Service) CreateIndividual(ctx context.Context, req *individualspb.CreateIndividualRequest) (*individualspb.CreateIndividualResponse, error) {
    ctx, cancel := s.withTimeout(ctx)
    defer cancel()

    ind, err := s.client.Individual.
        Create().
        SetFirstName(req.GetFirstName()).
        SetLastName(req.GetLastName()).
        SetPatronymic(req.GetPatronymic()).
        SetRegistrationAddress(req.GetRegistrationAddress()).
        SetPassportSeries(req.GetPassportSeries()).
        SetPassportNumber(req.GetPassportNumber()).
        SetPassportIssuedBy(req.GetPassportIssuedBy()).
        SetPassportIssuedDate(req.GetPassportIssuedDate()).
        SetPassportIssuedDepartmentCode(req.GetPassportIssuedDepartmentCode()).
        SetIsAuthorizedRepresentative(req.GetIsAuthorizedRepresentative()).
        Save(ctx)
    if err != nil {
        return nil, status.Errorf(codes.Internal, "create individual: %v", err)
    }
    return &individualspb.CreateIndividualResponse{Individual: toProto(ind)}, nil
}

func (s *Service) GetIndividual(ctx context.Context, req *individualspb.GetIndividualRequest) (*individualspb.GetIndividualResponse, error) {
    ctx, cancel := s.withTimeout(ctx)
    defer cancel()

    ind, err := s.client.Individual.Get(ctx, req.GetId())
    if err != nil {
        return nil, status.Errorf(codes.NotFound, "individual not found: %v", err)
    }
    return &individualspb.GetIndividualResponse{Individual: toProto(ind)}, nil
}

func (s *Service) ListIndividuals(ctx context.Context, req *individualspb.ListIndividualsRequest) (*individualspb.ListIndividualsResponse, error) {
    ctx, cancel := s.withTimeout(ctx)
    defer cancel()

    q := s.client.Individual.Query()
    if req.GetLimit() > 0 {
        q = q.Limit(int(req.GetLimit()))
    }
    if req.GetOffset() > 0 {
        q = q.Offset(int(req.GetOffset()))
    }

    list, err := q.All(ctx)
    if err != nil {
        return nil, status.Errorf(codes.Internal, "list individuals: %v", err)
    }
    resp := &individualspb.ListIndividualsResponse{Individuals: make([]*individualspb.Individual, 0, len(list))}
    for _, i := range list {
        resp.Individuals = append(resp.Individuals, toProto(i))
    }
    return resp, nil
}

func (s *Service) UpdateIndividual(ctx context.Context, req *individualspb.UpdateIndividualRequest) (*individualspb.UpdateIndividualResponse, error) {
    ctx, cancel := s.withTimeout(ctx)
    defer cancel()

    upd := s.client.Individual.UpdateOneID(req.GetId())
    if req.FirstName != "" {
        upd = upd.SetFirstName(req.GetFirstName())
    }
    if req.LastName != "" {
        upd = upd.SetLastName(req.GetLastName())
    }
    // Allow clearing patronymic if empty
    upd = upd.SetPatronymic(req.GetPatronymic())
    if req.RegistrationAddress != "" {
        upd = upd.SetRegistrationAddress(req.GetRegistrationAddress())
    }
    if req.PassportSeries != "" {
        upd = upd.SetPassportSeries(req.GetPassportSeries())
    }
    if req.PassportNumber != "" {
        upd = upd.SetPassportNumber(req.GetPassportNumber())
    }
    if req.PassportIssuedBy != "" {
        upd = upd.SetPassportIssuedBy(req.GetPassportIssuedBy())
    }
    if req.PassportIssuedDate != "" {
        upd = upd.SetPassportIssuedDate(req.GetPassportIssuedDate())
    }
    if req.PassportIssuedDepartmentCode != "" {
        upd = upd.SetPassportIssuedDepartmentCode(req.GetPassportIssuedDepartmentCode())
    }
    upd = upd.SetIsAuthorizedRepresentative(req.GetIsAuthorizedRepresentative())

    ind, err := upd.Save(ctx)
    if err != nil {
        return nil, status.Errorf(codes.Internal, "update individual: %v", err)
    }
    return &individualspb.UpdateIndividualResponse{Individual: toProto(ind)}, nil
}

func (s *Service) DeleteIndividual(ctx context.Context, req *individualspb.DeleteIndividualRequest) (*individualspb.DeleteIndividualResponse, error) {
    ctx, cancel := s.withTimeout(ctx)
    defer cancel()

    if err := s.client.Individual.DeleteOneID(req.GetId()).Exec(ctx); err != nil {
        return nil, status.Errorf(codes.Internal, "delete individual: %v", err)
    }
    return &individualspb.DeleteIndividualResponse{}, nil
}

func toProto(i *ent.Individual) *individualspb.Individual {
    patronymic := ""
    if i.Patronymic != nil {
        patronymic = *i.Patronymic
    }
    return &individualspb.Individual{
        Id:                            i.ID,
        FirstName:                     i.FirstName,
        LastName:                      i.LastName,
        Patronymic:                    patronymic,
        RegistrationAddress:           i.RegistrationAddress,
        PassportSeries:                i.PassportSeries,
        PassportNumber:                i.PassportNumber,
        PassportIssuedBy:              i.PassportIssuedBy,
        PassportIssuedDate:            i.PassportIssuedDate,
        PassportIssuedDepartmentCode:  i.PassportIssuedDepartmentCode,
        IsAuthorizedRepresentative:    i.IsAuthorizedRepresentative,
    }
}
