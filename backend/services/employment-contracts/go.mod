module github.com/example/micro/employment-contracts

go 1.22

require (
	entgo.io/ent v0.13.1
	github.com/example/micro/proto v0.0.0
	github.com/kelseyhightower/envconfig v1.4.0
	github.com/jackc/pgx/v5 v5.6.0
	google.golang.org/grpc v1.66.2
)

replace github.com/example/micro/proto => ../../proto

replace golang.org/x/tools => golang.org/x/tools v0.26.0
