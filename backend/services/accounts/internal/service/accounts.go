package service

import (
    "context"
    "time"

    "github.com/example/micro/accounts/ent"
    accountspb "github.com/example/micro/proto/gen/go/accounts"
    "google.golang.org/grpc/codes"
    "google.golang.org/grpc/status"
)

// Service implements AccountsServiceServer.
type Service struct {
    accountspb.UnimplementedAccountsServiceServer
    client *ent.Client
    timeout time.Duration
}

func New(client *ent.Client, timeout time.Duration) *Service {
    return &Service{client: client, timeout: timeout}
}

func (s *Service) withTimeout(ctx context.Context) (context.Context, context.CancelFunc) {
    return context.WithTimeout(ctx, s.timeout)
}

func (s *Service) CreateAccount(ctx context.Context, req *accountspb.CreateAccountRequest) (*accountspb.CreateAccountResponse, error) {
    ctx, cancel := s.withTimeout(ctx)
    defer cancel()

    acc, err := s.client.Account.
        Create().
        SetNumber(req.GetNumber()).
        SetBank(req.GetBank()).
        SetBic(req.GetBic()).
        Save(ctx)
    if err != nil {
        return nil, status.Errorf(codes.Internal, "create account: %v", err)
    }
    return &accountspb.CreateAccountResponse{Account: toProto(acc)}, nil
}

func (s *Service) GetAccount(ctx context.Context, req *accountspb.GetAccountRequest) (*accountspb.GetAccountResponse, error) {
    ctx, cancel := s.withTimeout(ctx)
    defer cancel()

    acc, err := s.client.Account.Get(ctx, req.GetId())
    if err != nil {
        return nil, status.Errorf(codes.NotFound, "account not found: %v", err)
    }
    return &accountspb.GetAccountResponse{Account: toProto(acc)}, nil
}

func (s *Service) ListAccounts(ctx context.Context, req *accountspb.ListAccountsRequest) (*accountspb.ListAccountsResponse, error) {
    ctx, cancel := s.withTimeout(ctx)
    defer cancel()

    q := s.client.Account.Query()
    if req.GetLimit() > 0 {
        q = q.Limit(int(req.GetLimit()))
    }
    if req.GetOffset() > 0 {
        q = q.Offset(int(req.GetOffset()))
    }
    list, err := q.All(ctx)
    if err != nil {
        return nil, status.Errorf(codes.Internal, "list accounts: %v", err)
    }
    resp := &accountspb.ListAccountsResponse{Accounts: make([]*accountspb.Account, 0, len(list))}
    for _, acc := range list {
        resp.Accounts = append(resp.Accounts, toProto(acc))
    }
    return resp, nil
}

func (s *Service) UpdateAccount(ctx context.Context, req *accountspb.UpdateAccountRequest) (*accountspb.UpdateAccountResponse, error) {
    ctx, cancel := s.withTimeout(ctx)
    defer cancel()

    upd := s.client.Account.UpdateOneID(req.GetId())
    if req.Number != "" {
        upd = upd.SetNumber(req.GetNumber())
    }
    if req.Bank != "" {
        upd = upd.SetBank(req.GetBank())
    }
    if req.Bic != "" {
        upd = upd.SetBic(req.GetBic())
    }

    acc, err := upd.Save(ctx)
    if err != nil {
        return nil, status.Errorf(codes.Internal, "update account: %v", err)
    }
    return &accountspb.UpdateAccountResponse{Account: toProto(acc)}, nil
}

func (s *Service) DeleteAccount(ctx context.Context, req *accountspb.DeleteAccountRequest) (*accountspb.DeleteAccountResponse, error) {
    ctx, cancel := s.withTimeout(ctx)
    defer cancel()

    if err := s.client.Account.DeleteOneID(req.GetId()).Exec(ctx); err != nil {
        return nil, status.Errorf(codes.Internal, "delete account: %v", err)
    }
    return &accountspb.DeleteAccountResponse{}, nil
}

func toProto(a *ent.Account) *accountspb.Account {
    return &accountspb.Account{
        Id:     a.ID,
        Number: a.Number,
        Bank:   a.Bank,
        Bic:    a.Bic,
    }
}
