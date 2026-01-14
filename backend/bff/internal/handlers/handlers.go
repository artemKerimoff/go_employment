package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/example/micro/bff/internal/clients"
	accountspb "github.com/example/micro/proto/gen/go/accounts"
	departmentspb "github.com/example/micro/proto/gen/go/departments"
	dismissalorderpb "github.com/example/micro/proto/gen/go/dismissal_order"
	employmentcontractspb "github.com/example/micro/proto/gen/go/employment_contracts"
	employmentorderpb "github.com/example/micro/proto/gen/go/employment_order"
	individualspb "github.com/example/micro/proto/gen/go/individuals"
	organizationspb "github.com/example/micro/proto/gen/go/organizations"
	positionspb "github.com/example/micro/proto/gen/go/positions"
	"github.com/go-chi/chi/v5"
)

// Handler groups HTTP handlers with shared deps.
type Handler struct {
	svc     *clients.Services
	timeout time.Duration
}

func New(svc *clients.Services, timeout time.Duration) *Handler {
	return &Handler{svc: svc, timeout: timeout}
}

func (h *Handler) withTimeout(ctx context.Context) (context.Context, context.CancelFunc) {
	return context.WithTimeout(ctx, h.timeout)
}

func (h *Handler) RegisterRoutes(r chi.Router) {
	r.Get("/healthz", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})

	r.Route("/api", func(api chi.Router) {
		api.Get("/healthz", func(w http.ResponseWriter, _ *http.Request) {
			w.WriteHeader(http.StatusOK)
			_, _ = w.Write([]byte("ok"))
		})

		// accounts
		api.Route("/accounts", func(rr chi.Router) {
			rr.Post("/", h.createAccount)
			rr.Get("/{id}", h.getAccount)
			rr.Get("/", h.listAccounts)
			rr.Patch("/{id}", h.updateAccount)
			rr.Delete("/{id}", h.deleteAccount)
		})

		// organizations
		api.Route("/organizations", func(rr chi.Router) {
			rr.Post("/", h.createOrganization)
			rr.Get("/{id}", h.getOrganization)
			rr.Get("/", h.listOrganizations)
			rr.Patch("/{id}", h.updateOrganization)
			rr.Delete("/{id}", h.deleteOrganization)
		})

		// departments
		api.Route("/departments", func(rr chi.Router) {
			rr.Post("/", h.createDepartment)
			rr.Get("/{id}", h.getDepartment)
			rr.Get("/", h.listDepartments)
			rr.Patch("/{id}", h.updateDepartment)
			rr.Delete("/{id}", h.deleteDepartment)
		})

		// positions
		api.Route("/positions", func(rr chi.Router) {
			rr.Post("/", h.createPosition)
			rr.Get("/{id}", h.getPosition)
			rr.Get("/", h.listPositions)
			rr.Patch("/{id}", h.updatePosition)
			rr.Delete("/{id}", h.deletePosition)
		})

		// individuals
		api.Route("/individuals", func(rr chi.Router) {
			rr.Post("/", h.createIndividual)
			rr.Get("/{id}", h.getIndividual)
			rr.Get("/", h.listIndividuals)
			rr.Patch("/{id}", h.updateIndividual)
			rr.Delete("/{id}", h.deleteIndividual)
		})

		// employment contracts (mapped to /contracts for frontend)
		api.Route("/contracts", func(rr chi.Router) {
			rr.Post("/", h.createEmploymentContract)
			rr.Get("/{id}", h.getEmploymentContract)
			rr.Get("/", h.listEmploymentContracts)
			rr.Patch("/{id}", h.updateEmploymentContract)
			rr.Delete("/{id}", h.deleteEmploymentContract)
		})

		// employment orders: expose header endpoints on plain path, keep body endpoints under /bodies
		api.Route("/employment-orders", func(rr chi.Router) {
			rr.Post("/", h.createEmploymentOrderHeader)
			rr.Get("/{id}", h.getEmploymentOrderHeader)
			rr.Get("/", h.listEmploymentOrderHeaders)
			rr.Patch("/{id}", h.updateEmploymentOrderHeader)
			rr.Delete("/{id}", h.deleteEmploymentOrderHeader)

			rr.Route("/bodies", func(r2 chi.Router) {
				r2.Post("/", h.createEmploymentOrderBody)
				r2.Get("/{id}", h.getEmploymentOrderBody)
				r2.Get("/", h.listEmploymentOrderBodies)
				r2.Patch("/{id}", h.updateEmploymentOrderBody)
				r2.Delete("/{id}", h.deleteEmploymentOrderBody)
			})
		})

		// dismissal orders: expose header endpoints on plain path, keep body endpoints under /bodies
		api.Route("/dismissal-orders", func(rr chi.Router) {
			rr.Post("/", h.createDismissalOrderHeader)
			rr.Get("/{id}", h.getDismissalOrderHeader)
			rr.Get("/", h.listDismissalOrderHeaders)
			rr.Patch("/{id}", h.updateDismissalOrderHeader)
			rr.Delete("/{id}", h.deleteDismissalOrderHeader)

			rr.Route("/bodies", func(r2 chi.Router) {
				r2.Post("/", h.createDismissalOrderBody)
				r2.Get("/{id}", h.getDismissalOrderBody)
				r2.Get("/", h.listDismissalOrderBodies)
				r2.Patch("/{id}", h.updateDismissalOrderBody)
				r2.Delete("/{id}", h.deleteDismissalOrderBody)
			})
		})
	})
}

// Helper responses
func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func badRequest(w http.ResponseWriter, msg string) {
	writeJSON(w, http.StatusBadRequest, map[string]string{"error": msg})
}

func internalError(w http.ResponseWriter, err error) {
	writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
}

func parseID(w http.ResponseWriter, r *http.Request) (int64, bool) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		badRequest(w, "invalid id")
		return 0, false
	}
	return id, true
}

func parseOptionalQueryInt64(w http.ResponseWriter, r *http.Request, key string) (int64, bool) {
	val := r.URL.Query().Get(key)
	if val == "" {
		return 0, true
	}
	v, err := strconv.ParseInt(val, 10, 64)
	if err != nil {
		badRequest(w, "invalid "+key)
		return 0, false
	}
	return v, true
}

// Accounts handlers
func (h *Handler) createAccount(w http.ResponseWriter, r *http.Request) {
	var req accountspb.CreateAccountRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		badRequest(w, "invalid json")
		return
	}
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.Accounts.CreateAccount(ctx, &req)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, resp.Account)
}

func (h *Handler) getAccount(w http.ResponseWriter, r *http.Request) {
	id, ok := parseID(w, r)
	if !ok {
		return
	}
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.Accounts.GetAccount(ctx, &accountspb.GetAccountRequest{Id: id})
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, resp.Account)
}

func (h *Handler) listAccounts(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.Accounts.ListAccounts(ctx, &accountspb.ListAccountsRequest{})
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, resp.Accounts)
}

func (h *Handler) updateAccount(w http.ResponseWriter, r *http.Request) {
	id, ok := parseID(w, r)
	if !ok {
		return
	}
	var req accountspb.UpdateAccountRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		badRequest(w, "invalid json")
		return
	}
	req.Id = id
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.Accounts.UpdateAccount(ctx, &req)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, resp.Account)
}

func (h *Handler) deleteAccount(w http.ResponseWriter, r *http.Request) {
	id, ok := parseID(w, r)
	if !ok {
		return
	}
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	_, err := h.svc.Accounts.DeleteAccount(ctx, &accountspb.DeleteAccountRequest{Id: id})
	if err != nil {
		internalError(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// Organizations handlers
func (h *Handler) createOrganization(w http.ResponseWriter, r *http.Request) {
	var req organizationspb.CreateOrganizationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		badRequest(w, "invalid json")
		return
	}
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.Organizations.CreateOrganization(ctx, &req)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, resp.Organization)
}

func (h *Handler) getOrganization(w http.ResponseWriter, r *http.Request) {
	id, ok := parseID(w, r)
	if !ok {
		return
	}
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.Organizations.GetOrganization(ctx, &organizationspb.GetOrganizationRequest{Id: id})
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, resp.Organization)
}

func (h *Handler) listOrganizations(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.Organizations.ListOrganizations(ctx, &organizationspb.ListOrganizationsRequest{})
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, resp.Organizations)
}

func (h *Handler) updateOrganization(w http.ResponseWriter, r *http.Request) {
	id, ok := parseID(w, r)
	if !ok {
		return
	}
	var req organizationspb.UpdateOrganizationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		badRequest(w, "invalid json")
		return
	}
	req.Id = id
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.Organizations.UpdateOrganization(ctx, &req)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, resp.Organization)
}

func (h *Handler) deleteOrganization(w http.ResponseWriter, r *http.Request) {
	id, ok := parseID(w, r)
	if !ok {
		return
	}
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	_, err := h.svc.Organizations.DeleteOrganization(ctx, &organizationspb.DeleteOrganizationRequest{Id: id})
	if err != nil {
		internalError(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// Departments handlers
func (h *Handler) createDepartment(w http.ResponseWriter, r *http.Request) {
	var req departmentspb.CreateDepartmentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		badRequest(w, "invalid json")
		return
	}
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.Departments.CreateDepartment(ctx, &req)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, resp.Department)
}

func (h *Handler) getDepartment(w http.ResponseWriter, r *http.Request) {
	id, ok := parseID(w, r)
	if !ok {
		return
	}
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.Departments.GetDepartment(ctx, &departmentspb.GetDepartmentRequest{Id: id})
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, resp.Department)
}

func (h *Handler) listDepartments(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.Departments.ListDepartments(ctx, &departmentspb.ListDepartmentsRequest{})
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, resp.Departments)
}

func (h *Handler) updateDepartment(w http.ResponseWriter, r *http.Request) {
	id, ok := parseID(w, r)
	if !ok {
		return
	}
	var req departmentspb.UpdateDepartmentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		badRequest(w, "invalid json")
		return
	}
	req.Id = id
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.Departments.UpdateDepartment(ctx, &req)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, resp.Department)
}

func (h *Handler) deleteDepartment(w http.ResponseWriter, r *http.Request) {
	id, ok := parseID(w, r)
	if !ok {
		return
	}
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	_, err := h.svc.Departments.DeleteDepartment(ctx, &departmentspb.DeleteDepartmentRequest{Id: id})
	if err != nil {
		internalError(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// Positions handlers
func (h *Handler) createPosition(w http.ResponseWriter, r *http.Request) {
	var req positionspb.CreatePositionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		badRequest(w, "invalid json")
		return
	}
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.Positions.CreatePosition(ctx, &req)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, resp.Position)
}

func (h *Handler) getPosition(w http.ResponseWriter, r *http.Request) {
	id, ok := parseID(w, r)
	if !ok {
		return
	}
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.Positions.GetPosition(ctx, &positionspb.GetPositionRequest{Id: id})
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, resp.Position)
}

func (h *Handler) listPositions(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.Positions.ListPositions(ctx, &positionspb.ListPositionsRequest{})
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, resp.Positions)
}

func (h *Handler) updatePosition(w http.ResponseWriter, r *http.Request) {
	id, ok := parseID(w, r)
	if !ok {
		return
	}
	var req positionspb.UpdatePositionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		badRequest(w, "invalid json")
		return
	}
	req.Id = id
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.Positions.UpdatePosition(ctx, &req)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, resp.Position)
}

func (h *Handler) deletePosition(w http.ResponseWriter, r *http.Request) {
	id, ok := parseID(w, r)
	if !ok {
		return
	}
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	_, err := h.svc.Positions.DeletePosition(ctx, &positionspb.DeletePositionRequest{Id: id})
	if err != nil {
		internalError(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// Individuals handlers
func (h *Handler) createIndividual(w http.ResponseWriter, r *http.Request) {
	var req individualspb.CreateIndividualRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		badRequest(w, "invalid json")
		return
	}
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.Individuals.CreateIndividual(ctx, &req)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, resp.Individual)
}

func (h *Handler) getIndividual(w http.ResponseWriter, r *http.Request) {
	id, ok := parseID(w, r)
	if !ok {
		return
	}
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.Individuals.GetIndividual(ctx, &individualspb.GetIndividualRequest{Id: id})
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, resp.Individual)
}

func (h *Handler) listIndividuals(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.Individuals.ListIndividuals(ctx, &individualspb.ListIndividualsRequest{})
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, resp.Individuals)
}

func (h *Handler) updateIndividual(w http.ResponseWriter, r *http.Request) {
	id, ok := parseID(w, r)
	if !ok {
		return
	}
	var req individualspb.UpdateIndividualRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		badRequest(w, "invalid json")
		return
	}
	req.Id = id
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.Individuals.UpdateIndividual(ctx, &req)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, resp.Individual)
}

func (h *Handler) deleteIndividual(w http.ResponseWriter, r *http.Request) {
	id, ok := parseID(w, r)
	if !ok {
		return
	}
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	_, err := h.svc.Individuals.DeleteIndividual(ctx, &individualspb.DeleteIndividualRequest{Id: id})
	if err != nil {
		internalError(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// Employment contracts handlers
func (h *Handler) createEmploymentContract(w http.ResponseWriter, r *http.Request) {
	var req employmentcontractspb.CreateEmploymentContractRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		badRequest(w, "invalid json")
		return
	}
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.EmploymentContracts.CreateEmploymentContract(ctx, &req)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, resp.Contract)
}

func (h *Handler) getEmploymentContract(w http.ResponseWriter, r *http.Request) {
	id, ok := parseID(w, r)
	if !ok {
		return
	}
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.EmploymentContracts.GetEmploymentContract(ctx, &employmentcontractspb.GetEmploymentContractRequest{Id: id})
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, resp.Contract)
}

func (h *Handler) listEmploymentContracts(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.EmploymentContracts.ListEmploymentContracts(ctx, &employmentcontractspb.ListEmploymentContractsRequest{})
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, resp.Contracts)
}

func (h *Handler) updateEmploymentContract(w http.ResponseWriter, r *http.Request) {
	id, ok := parseID(w, r)
	if !ok {
		return
	}
	var req employmentcontractspb.UpdateEmploymentContractRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		badRequest(w, "invalid json")
		return
	}
	req.Id = id
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.EmploymentContracts.UpdateEmploymentContract(ctx, &req)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, resp.Contract)
}

func (h *Handler) deleteEmploymentContract(w http.ResponseWriter, r *http.Request) {
	id, ok := parseID(w, r)
	if !ok {
		return
	}
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	_, err := h.svc.EmploymentContracts.DeleteEmploymentContract(ctx, &employmentcontractspb.DeleteEmploymentContractRequest{Id: id})
	if err != nil {
		internalError(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// Employment order headers
func (h *Handler) createEmploymentOrderHeader(w http.ResponseWriter, r *http.Request) {
	var req employmentorderpb.CreateEmploymentOrderHeaderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		badRequest(w, "invalid json")
		return
	}
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.EmploymentOrder.CreateEmploymentOrderHeader(ctx, &req)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, resp.Header)
}

func (h *Handler) getEmploymentOrderHeader(w http.ResponseWriter, r *http.Request) {
	id, ok := parseID(w, r)
	if !ok {
		return
	}
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.EmploymentOrder.GetEmploymentOrderHeader(ctx, &employmentorderpb.GetEmploymentOrderHeaderRequest{Id: id})
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, resp.Header)
}

func (h *Handler) listEmploymentOrderHeaders(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.EmploymentOrder.ListEmploymentOrderHeaders(ctx, &employmentorderpb.ListEmploymentOrderHeadersRequest{})
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, resp.Headers)
}

func (h *Handler) updateEmploymentOrderHeader(w http.ResponseWriter, r *http.Request) {
	id, ok := parseID(w, r)
	if !ok {
		return
	}
	var req employmentorderpb.UpdateEmploymentOrderHeaderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		badRequest(w, "invalid json")
		return
	}
	req.Id = id
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.EmploymentOrder.UpdateEmploymentOrderHeader(ctx, &req)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, resp.Header)
}

func (h *Handler) deleteEmploymentOrderHeader(w http.ResponseWriter, r *http.Request) {
	id, ok := parseID(w, r)
	if !ok {
		return
	}
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	_, err := h.svc.EmploymentOrder.DeleteEmploymentOrderHeader(ctx, &employmentorderpb.DeleteEmploymentOrderHeaderRequest{Id: id})
	if err != nil {
		internalError(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// Employment order bodies
func (h *Handler) createEmploymentOrderBody(w http.ResponseWriter, r *http.Request) {
	var req employmentorderpb.CreateEmploymentOrderBodyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		badRequest(w, "invalid json")
		return
	}
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.EmploymentOrder.CreateEmploymentOrderBody(ctx, &req)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, resp.Body)
}

func (h *Handler) getEmploymentOrderBody(w http.ResponseWriter, r *http.Request) {
	id, ok := parseID(w, r)
	if !ok {
		return
	}
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.EmploymentOrder.GetEmploymentOrderBody(ctx, &employmentorderpb.GetEmploymentOrderBodyRequest{Id: id})
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, resp.Body)
}

func (h *Handler) listEmploymentOrderBodies(w http.ResponseWriter, r *http.Request) {
	headerID, ok := parseOptionalQueryInt64(w, r, "header_id")
	if !ok {
		return
	}
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.EmploymentOrder.ListEmploymentOrderBodies(ctx, &employmentorderpb.ListEmploymentOrderBodiesRequest{HeaderId: headerID})
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, resp.Bodies)
}

func (h *Handler) updateEmploymentOrderBody(w http.ResponseWriter, r *http.Request) {
	id, ok := parseID(w, r)
	if !ok {
		return
	}
	var req employmentorderpb.UpdateEmploymentOrderBodyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		badRequest(w, "invalid json")
		return
	}
	req.Id = id
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.EmploymentOrder.UpdateEmploymentOrderBody(ctx, &req)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, resp.Body)
}

func (h *Handler) deleteEmploymentOrderBody(w http.ResponseWriter, r *http.Request) {
	id, ok := parseID(w, r)
	if !ok {
		return
	}
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	_, err := h.svc.EmploymentOrder.DeleteEmploymentOrderBody(ctx, &employmentorderpb.DeleteEmploymentOrderBodyRequest{Id: id})
	if err != nil {
		internalError(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// Dismissal order headers
func (h *Handler) createDismissalOrderHeader(w http.ResponseWriter, r *http.Request) {
	var req dismissalorderpb.CreateDismissalOrderHeaderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		badRequest(w, "invalid json")
		return
	}
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.DismissalOrder.CreateDismissalOrderHeader(ctx, &req)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, resp.Header)
}

func (h *Handler) getDismissalOrderHeader(w http.ResponseWriter, r *http.Request) {
	id, ok := parseID(w, r)
	if !ok {
		return
	}
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.DismissalOrder.GetDismissalOrderHeader(ctx, &dismissalorderpb.GetDismissalOrderHeaderRequest{Id: id})
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, resp.Header)
}

func (h *Handler) listDismissalOrderHeaders(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.DismissalOrder.ListDismissalOrderHeaders(ctx, &dismissalorderpb.ListDismissalOrderHeadersRequest{})
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, resp.Headers)
}

func (h *Handler) updateDismissalOrderHeader(w http.ResponseWriter, r *http.Request) {
	id, ok := parseID(w, r)
	if !ok {
		return
	}
	var req dismissalorderpb.UpdateDismissalOrderHeaderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		badRequest(w, "invalid json")
		return
	}
	req.Id = id
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.DismissalOrder.UpdateDismissalOrderHeader(ctx, &req)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, resp.Header)
}

func (h *Handler) deleteDismissalOrderHeader(w http.ResponseWriter, r *http.Request) {
	id, ok := parseID(w, r)
	if !ok {
		return
	}
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	_, err := h.svc.DismissalOrder.DeleteDismissalOrderHeader(ctx, &dismissalorderpb.DeleteDismissalOrderHeaderRequest{Id: id})
	if err != nil {
		internalError(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// Dismissal order bodies
func (h *Handler) createDismissalOrderBody(w http.ResponseWriter, r *http.Request) {
	var req dismissalorderpb.CreateDismissalOrderBodyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		badRequest(w, "invalid json")
		return
	}
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.DismissalOrder.CreateDismissalOrderBody(ctx, &req)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, resp.Body)
}

func (h *Handler) getDismissalOrderBody(w http.ResponseWriter, r *http.Request) {
	id, ok := parseID(w, r)
	if !ok {
		return
	}
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.DismissalOrder.GetDismissalOrderBody(ctx, &dismissalorderpb.GetDismissalOrderBodyRequest{Id: id})
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, resp.Body)
}

func (h *Handler) listDismissalOrderBodies(w http.ResponseWriter, r *http.Request) {
	headerID, ok := parseOptionalQueryInt64(w, r, "header_id")
	if !ok {
		return
	}
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.DismissalOrder.ListDismissalOrderBodies(ctx, &dismissalorderpb.ListDismissalOrderBodiesRequest{HeaderId: headerID})
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, resp.Bodies)
}

func (h *Handler) updateDismissalOrderBody(w http.ResponseWriter, r *http.Request) {
	id, ok := parseID(w, r)
	if !ok {
		return
	}
	var req dismissalorderpb.UpdateDismissalOrderBodyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		badRequest(w, "invalid json")
		return
	}
	req.Id = id
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	resp, err := h.svc.DismissalOrder.UpdateDismissalOrderBody(ctx, &req)
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, resp.Body)
}

func (h *Handler) deleteDismissalOrderBody(w http.ResponseWriter, r *http.Request) {
	id, ok := parseID(w, r)
	if !ok {
		return
	}
	ctx, cancel := h.withTimeout(r.Context())
	defer cancel()
	_, err := h.svc.DismissalOrder.DeleteDismissalOrderBody(ctx, &dismissalorderpb.DeleteDismissalOrderBodyRequest{Id: id})
	if err != nil {
		internalError(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
