GO ?= go
SERVICE ?= backend/services/service-template

.PHONY: tidy ent-generate migrate run-service-template run-bff proto-gen run-all

tidy:
	cd backend/bff && $(GO) mod tidy
	cd $(SERVICE) && $(GO) mod tidy

ent-generate:
	cd $(SERVICE) && $(GO) generate ./ent

migrate:
	cd $(SERVICE) && $(GO) run ./cmd/migrate

run-service-template:
	cd backend/services/service-template && $(GO) run ./cmd/server

run-bff:
	cd backend/bff && $(GO) run ./cmd/bff

proto-gen:
	cd backend/proto && protoc \
		--go_out=./gen/go --go_opt=paths=source_relative \
		--go-grpc_out=./gen/go --go-grpc_opt=paths=source_relative \
		service.proto

run-all:
	command -v goreman >/dev/null 2>&1 || (echo "install goreman: go install github.com/mattn/goreman@latest" && exit 1)
	goreman start
