# BFF HTTP API & Schema Reference 🧭

This document is a concise reference for the BFF HTTP endpoints and the main entities (proto shapes) used by the frontend. Use it as a quick lookup when wiring forms, selects and save flows.

Notes:
- Base path: `/api` (e.g. `/api/contracts`, `/api/individuals`)
- CORS / OPTIONS: supported by server via `github.com/go-chi/cors` (AllowedMethods include OPTIONS). Clients should only set `Content-Type` for requests with a body to avoid unnecessary preflights.
- Naming: payloads and JSON use snake_case matching proto fields (e.g. `organization_id`, `work_hours_from`, `passport_issued_department_code`).

---

## Quick Conventions
- Dates: `YYYY-MM-DD` (ISO date). Backend normalizes date fields to this format in responses.
- Times (hours): `HH:MM` (24-hour clock). Backend normalizes time fields to `HH:MM` in responses.
- IDs: integers (int64) in JSON.
- All endpoints are JSON and follow proto field names.

---

## Endpoints (by resource)

### Accounts
- POST `/api/accounts` — Create account. Body: `{ number, bank, bic }` → 201 Created (Account)
- GET `/api/accounts/{id}` — Get account
- GET `/api/accounts` — List accounts
- PATCH `/api/accounts/{id}` — Update account
- DELETE `/api/accounts/{id}` — Delete account (204)

### Organizations
- POST `/api/organizations` — Create organization `{ title, address, okpo, inn, kpp, account_id }`
- GET `/api/organizations/{id}` — Get organization
- GET `/api/organizations` — List organizations
- PATCH `/api/organizations/{id}` — Update organization
- DELETE `/api/organizations/{id}` — Delete

### Departments & Positions
- `/api/departments` and `/api/positions` have standard CRUD endpoints: POST, GET (/{id}), GET (list), PATCH, DELETE.

### Individuals
- POST `/api/individuals` — Create individual. Important: backend expects `passport_issued_department_code` (not `passport_department_code`).
- GET `/api/individuals/{id}`
- GET `/api/individuals` — List individuals
- PATCH `/api/individuals/{id}`
- DELETE `/api/individuals/{id}`

### Employment Contracts (frontend uses `/contracts`)
- POST `/api/contracts` — CreateEmploymentContract
  - Example body fields: `number`, `conclusion_date` (YYYY-MM-DD), `organization_id`, `representative_id`, `employee_id`, `department_id`, `position_id`, `conditions_class`, `work_date_from`, `work_date_to`, `probation_months`, `salary`, `work_hours_from` (HH:MM), `work_hours_to` (HH:MM), `break_from`, `break_to`, `paid_leave_days`, `personnel_number`
- GET `/api/contracts/{id}` — GetEmploymentContract
- GET `/api/contracts` — ListEmploymentContracts (returns array of contracts)
- PATCH `/api/contracts/{id}` — UpdateEmploymentContract
- DELETE `/api/contracts/{id}`

Notes for Contracts:
- Backend will normalize date/time formats in responses: dates → `YYYY-MM-DD`, times → `HH:MM`.
- When creating/updating, send `work_hours_from` and `work_hours_to` as `HH:MM` strings; server will accept `HH:MM` or `HH:MM:SS` and default missing work hours to `09:00/18:00` on create if not supplied.

### Employment Orders
- Header endpoints: `/api/employment-orders` (POST, GET `/{id}`, GET list, PATCH, DELETE)
- Body endpoints: `/api/employment-orders/bodies` (POST, GET `/{id}`, GET list with `header_id` query, PATCH, DELETE)

Notes for Employment Orders:
- Header fields: `number`, `preparation_date` (YYYY-MM-DD), `organization_id`.
- Body fields: `employment_order_header_id`, `employment_contract_id`, `department_id`, `position_id`, `salary`, `work_date_from` (YYYY-MM-DD), `work_date_to` (YYYY-MM-DD, optional), `probation_months` (optional).
- Backend normalizes date fields to `YYYY-MM-DD` in responses; clients should send dates in `YYYY-MM-DD` or RFC3339 and will be parsed tolerantly.

### Dismissal Orders
- Header endpoints: `/api/dismissal-orders` (standard CRUD)
- Body endpoints: `/api/dismissal-orders/bodies` (CRUD)

---

## Proto / Entity Reference (selected fields)

### Individual (proto: `individuals.proto`)
- `id: int64`
- `first_name: string`
- `last_name: string`
- `patronymic: string` (optional)
- `registration_address: string`
- `passport_series`, `passport_number`, `passport_issued_by`, `passport_issued_date` (string date)
- `passport_issued_department_code` (string) — **use this exact name**
- `is_authorized_representative: bool`

### Organization (proto: `organizations.proto`)
- `id: int64`, `title: string`, `address: string`, `okpo: string`, `inn: string`, `kpp: string`, `account_id: int64`

### EmploymentContract (proto: `employment_contracts.proto`)
- `id: int64`
- `number: string`
- `conclusion_date: string` — date (YYYY-MM-DD)
- `organization_id: int64`
- `representative_id: int64`
- `employee_id: int64` (individual)
- `department_id: int64`, `position_id: int64`
- `work_date_from`, `work_date_to` — dates (YYYY-MM-DD)
- `work_hours_from`, `work_hours_to` — times (HH:MM)
- `break_from`, `break_to` — optional times (HH:MM)
- `salary` (float), `probation_months` (int), `paid_leave_days` (int)
- `personnel_number` (string)

---

## Example cURLs

- List contracts (simple):
```bash
curl -sS -X GET "http://localhost:8080/api/contracts" | jq
```

- Create contract (example):
```bash
curl -sS -X POST "http://localhost:8080/api/contracts" \
  -H 'Content-Type: application/json' \
  -d '{"number":"TD-001","conclusion_date":"2025-12-29","organization_id":1,"employee_id":3,"work_date_from":"2025-12-29","work_hours_from":"09:00","work_hours_to":"18:00","salary":120000.0,"personnel_number":"12345"}'
```

---

## Implementation notes / tips for frontend
- Use environment variable `NEXT_PUBLIC_BFF_URL` or default `http://localhost:8080` when building fetch URLs.
- Prefer `GET /api/...` endpoints for populating selects (organizations, individuals, departments, positions) and map ids to display labels (e.g., `organization.title`, `individual.last_name+first_name+patronymic`).
- For forms: always send snake_case fields and convert `id`/numbers to numbers in payload (e.g., `organization_id: Number(form.organizationId)`).
- Be ready to handle optional `work_date_to`, `break_from`, `break_to` as empty strings in responses.

---

## Where the source lives
- Routes: `backend/bff/internal/handlers/handlers.go` (maps HTTP to proto service calls)
- Protos / types: `backend/proto/*.proto` (see `employment_contracts.proto`, `individuals.proto`, `organizations.proto`)
- Services implementations: `backend/services/*/internal/service` (contains logic e.g. create/list/get for resources)

---

If you'd like, I can:
- Generate an OpenAPI-style spec (YAML/JSON) from this reference, or
- Add cURL examples per resource into the README or a `docs/` folder, or
- Add quick TypeScript interface snippets for the most used responses to drop into the frontend codebase.

Tell me which of these you'd prefer and I'll follow up.
