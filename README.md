# Microservice Web Template

Шаблон для микросервисного веб-приложения: отдельный SPA/SSR фронтенд, BFF для общения фронта с бэкендом, и набор микросервисов на Go. Для работы с Postgres используется Ent (схемы и миграции), коммуникация сервисов — gRPC, BFF экспонирует публичный HTTP.

## Состав
- `frontend/` — SPA (Vite + React + TS). Общается с BFF по HTTPS/JSON, умеет грузить файлы.
- `backend/go.work` — объединяет все Go-модули (BFF и сервисы).
- `backend/bff/` — HTTP BFF (Go, chi) с базовой агрегацией и проксированием в gRPC сервисы.
- `backend/services/service-template/` — каркас gRPC сервиса с Ent, миграциями и health-эндпоинтом. Копируйте/переименовывайте для новых сервисов.
- `backend/proto/` — общие protobuf-контракты для gRPC.
- `deployments/` — infra для локалки (Postgres + MinIO), можно расширять.
- `Makefile` — типовые команды (tidy, generate ent, migrate, run).

## Быстрый старт
1) Зависимости: Go 1.22+, Node 20+, `protoc` + `protoc-gen-go` + `protoc-gen-go-grpc` + `protoc-gen-go-json`, Docker (для локальной БД).
2) Сгенерировать gRPC stubs (Go):
   ```bash
   make proto-gen
   ```
3) Поднять локальные сервисы:
   ```bash
   docker compose -f deployments/docker-compose.yml up -d
   ```
4) Сгенерировать Ent для шаблонного сервиса:
   ```bash
   make ent-generate SERVICE=backend/services/service-template
   ```
5) Прогнать миграцию шаблонного сервиса (создаёт таблицы):
   ```bash
   make migrate SERVICE=backend/services/service-template
   ```
6) Запустить сервис и BFF:
   ```bash
   make run-service-template
   make run-bff
   ```
7) Фронтенд:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Добавление нового сервиса
1) Скопируйте `backend/services/service-template` в новую папку.
2) Обновите `module` в `go.mod`, `serviceName` в `cmd/server/main.go`, схему Ent (`ent/schema`).
3) Добавьте gRPC методы в `backend/proto/*.proto`, сгенерируйте stubs, подключите в BFF.
4) `make ent-generate SERVICE=backend/services/<имя>` и `make migrate SERVICE=...`.
5) Зарегистрируйте сервис в BFF (dial + handler).

## Стек
- Go + chi (HTTP), gRPC (google.golang.org/grpc), Ent (entgo.io/ent), zap/log/slog, Vite + React + TS.
- Postgres для данных, MinIO/S3 для файлов.

## Примечания
- Ent миграции выполняются программно через `cmd/migrate` внутри сервиса, так сохраняется единый источник схем.
- Конфигурации читаются из env с дефолтами (см. `config` пакеты).
- В шаблоне включён health-check, базовые middlewares и заготовка для аутентификации на уровне BFF.
