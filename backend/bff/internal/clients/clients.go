package clients

import (
	"context"
	"fmt"
	"time"

	accountspb "github.com/example/micro/proto/gen/go/accounts"
	departmentspb "github.com/example/micro/proto/gen/go/departments"
	dismissalorderpb "github.com/example/micro/proto/gen/go/dismissal_order"
	employmentcontractspb "github.com/example/micro/proto/gen/go/employment_contracts"
	employmentorderpb "github.com/example/micro/proto/gen/go/employment_order"
	individualspb "github.com/example/micro/proto/gen/go/individuals"
	organizationspb "github.com/example/micro/proto/gen/go/organizations"
	positionspb "github.com/example/micro/proto/gen/go/positions"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

// Services aggregates gRPC clients for downstream services.
type Services struct {
	Accounts            accountspb.AccountsServiceClient
	Organizations       organizationspb.OrganizationsServiceClient
	Departments         departmentspb.DepartmentsServiceClient
	Positions           positionspb.PositionsServiceClient
	Individuals         individualspb.IndividualsServiceClient
	EmploymentContracts employmentcontractspb.EmploymentContractsServiceClient
	EmploymentOrder     employmentorderpb.EmploymentOrderServiceClient
	DismissalOrder      dismissalorderpb.DismissalOrderServiceClient
	Conns               []*grpc.ClientConn
}

// DialAll opens clients with a shared timeout.
func DialAll(ctx context.Context, addrs map[string]string, timeout time.Duration) (*Services, error) {
	dial := func(addr string) (*grpc.ClientConn, error) {
		cctx, cancel := context.WithTimeout(ctx, timeout)
		defer cancel()
		return grpc.DialContext(cctx, addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	}

	mk := map[string]*grpc.ClientConn{}
	for name, addr := range addrs {
		conn, err := dial(addr)
		if err != nil {
			// close already opened
			for _, c := range mk {
				_ = c.Close()
			}
			return nil, fmt.Errorf("dial %s: %w", name, err)
		}
		mk[name] = conn
	}

	return &Services{
		Accounts:            accountspb.NewAccountsServiceClient(mk["accounts"]),
		Organizations:       organizationspb.NewOrganizationsServiceClient(mk["organizations"]),
		Departments:         departmentspb.NewDepartmentsServiceClient(mk["departments"]),
		Positions:           positionspb.NewPositionsServiceClient(mk["positions"]),
		Individuals:         individualspb.NewIndividualsServiceClient(mk["individuals"]),
		EmploymentContracts: employmentcontractspb.NewEmploymentContractsServiceClient(mk["employment_contracts"]),
		EmploymentOrder:     employmentorderpb.NewEmploymentOrderServiceClient(mk["employment_order"]),
		DismissalOrder:      dismissalorderpb.NewDismissalOrderServiceClient(mk["dismissal_order"]),
		Conns:               []*grpc.ClientConn{mk["accounts"], mk["organizations"], mk["departments"], mk["positions"], mk["individuals"], mk["employment_contracts"], mk["employment_order"], mk["dismissal_order"]},
	}, nil
}

// Close closes all connections.
func (s *Services) Close() {
	for _, c := range s.Conns {
		_ = c.Close()
	}
}
