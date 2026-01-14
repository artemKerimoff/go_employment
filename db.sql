CREATE SCHEMA IF NOT EXISTS "public";

CREATE TABLE "public"."employment_order_body" (
    "id" BIGSERIAL,
    "employment_order_header_id" bigint NOT NULL,
    "employment_contract_id" bigint NOT NULL,
    "department_id" bigint NOT NULL,
    "position_id" bigint NOT NULL,
    "salary" numeric(12, 2) NOT NULL,
    "work_date_from" date NOT NULL,
    "work_date_to" date NOT NULL,
    "probation_months" int,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."dismissal_order_header" (
    "id" BIGSERIAL,
    "number" varchar(6) NOT NULL,
    "preparation_date" date NOT NULL,
    "organization_id" bigint NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."departments" (
    "id" BIGSERIAL,
    "title" varchar(50) NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."positions" (
    "id" BIGSERIAL,
    "title" varchar(50) NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."organizations" (
    "id" BIGSERIAL,
    "title" varchar(200) NOT NULL,
    "address" text NOT NULL,
    "okpo" varchar(14) NOT NULL,
    "inn" varchar(12) NOT NULL,
    "kpp" varchar(9),
    "account_id" bigint NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."employment_order_header" (
    "id" BIGSERIAL,
    "number" varchar(6) NOT NULL,
    "preparation_date" date NOT NULL,
    "organization_id" bigint NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."employment_contract" (
    "id" BIGSERIAL,
    "number" varchar(6) NOT NULL,
    "conclusion_date" date NOT NULL,
    "organization_id" bigint NOT NULL,
    "representative_id" bigint NOT NULL,
    "employee_id" bigint NOT NULL,
    "department_id" bigint NOT NULL,
    "position_id" bigint NOT NULL,
    "conditions_class" int NOT NULL,
    "work_date_from" date NOT NULL,
    "probation_months" int,
    "salary" real NOT NULL,
    "work_hours_from" time NOT NULL,
    "work_hours_to" time NOT NULL,
    "break_from" time,
    "break_to" time,
    "paid_leave_days" int NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."dismissal_order_body" (
    "id" bigint NOT NULL,
    "dismissal_order_header_id" bigint NOT NULL,
    "employment_contract_id" bigint NOT NULL,
    "department_id" bigint NOT NULL,
    "position_id" bigint NOT NULL,
    "dismissal_date" date NOT NULL,
    "dismissal_ground" varchar(80) NOT NULL,
    "doc_number" int,
    "doc_date" date,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."individuals" (
    "id" BIGSERIAL,
    "first_name" varchar(50) NOT NULL,
    "last_name" varchar(50) NOT NULL,
    "patronymic" varchar(54) DEFAULT null,
    "registration_address" text NOT NULL,
    "passport_series" varchar(4) NOT NULL,
    "passport_number" varchar(6) NOT NULL,
    "passport_issued_by" text NOT NULL,
    "passport_issued_date" text NOT NULL,
    "passport_issued_department_code" varchar(7) NOT NULL,
    "is_authorized_representative" boolean DEFAULT false,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."accounts" (
    "id" BIGSERIAL,
    "number" varchar(20) NOT NULL,
    "bank" varchar(50) NOT NULL,
    "bic" varchar(9) NOT NULL,
    PRIMARY KEY ("id")
);

-- Foreign key constraints
-- Schema: public
ALTER TABLE "public"."organizations" ADD CONSTRAINT "fk_organizations_account_id_accounts_id" FOREIGN KEY("account_id") REFERENCES "public"."accounts"("id");
ALTER TABLE "public"."employment_order_body" ADD CONSTRAINT "fk_employment_order_body_employment_order_header_id_employme" FOREIGN KEY("employment_order_header_id") REFERENCES "public"."employment_order_header"("id");
ALTER TABLE "public"."employment_order_body" ADD CONSTRAINT "fk_employment_order_body_employment_contract_id_employment_c" FOREIGN KEY("employment_contract_id") REFERENCES "public"."employment_contract"("id");
ALTER TABLE "public"."employment_order_body" ADD CONSTRAINT "fk_employment_order_body_department_id_departments_id" FOREIGN KEY("department_id") REFERENCES "public"."departments"("id");
ALTER TABLE "public"."employment_order_body" ADD CONSTRAINT "fk_employment_order_body_position_id_positions_id" FOREIGN KEY("position_id") REFERENCES "public"."positions"("id");
ALTER TABLE "public"."employment_contract" ADD CONSTRAINT "fk_employment_contract_employee_id_individuals_id" FOREIGN KEY("employee_id") REFERENCES "public"."individuals"("id");
ALTER TABLE "public"."employment_order_header" ADD CONSTRAINT "fk_employment_order_header_organization_id_organizations_id" FOREIGN KEY("organization_id") REFERENCES "public"."organizations"("id");
ALTER TABLE "public"."employment_contract" ADD CONSTRAINT "fk_employment_contract_organization_id_organizations_id" FOREIGN KEY("organization_id") REFERENCES "public"."organizations"("id");
ALTER TABLE "public"."employment_contract" ADD CONSTRAINT "fk_employment_contract_representative_id_individuals_id" FOREIGN KEY("representative_id") REFERENCES "public"."individuals"("id");
ALTER TABLE "public"."employment_contract" ADD CONSTRAINT "fk_employment_contract_department_id_departments_id" FOREIGN KEY("department_id") REFERENCES "public"."departments"("id");
ALTER TABLE "public"."employment_contract" ADD CONSTRAINT "fk_employment_contract_position_id_positions_id" FOREIGN KEY("position_id") REFERENCES "public"."positions"("id");
ALTER TABLE "public"."dismissal_order_body" ADD CONSTRAINT "fk_dismissal_order_body_department_id_departments_id" FOREIGN KEY("department_id") REFERENCES "public"."departments"("id");
ALTER TABLE "public"."dismissal_order_body" ADD CONSTRAINT "fk_dismissal_order_body_employment_contract_id_employment_co" FOREIGN KEY("employment_contract_id") REFERENCES "public"."employment_contract"("id");
ALTER TABLE "public"."dismissal_order_body" ADD CONSTRAINT "fk_dismissal_order_body_position_id_positions_id" FOREIGN KEY("position_id") REFERENCES "public"."positions"("id");
ALTER TABLE "public"."dismissal_order_body" ADD CONSTRAINT "fk_dismissal_order_body_dismissal_order_header_id_dismissal_" FOREIGN KEY("dismissal_order_header_id") REFERENCES "public"."dismissal_order_header"("id");
ALTER TABLE "public"."dismissal_order_header" ADD CONSTRAINT "fk_dismissal_order_header_organization_id_organizations_id" FOREIGN KEY("organization_id") REFERENCES "public"."organizations"("id");