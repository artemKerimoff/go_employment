package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/field"
)

// Individual represents a person (employee or representative).
type Individual struct {
	ent.Schema
}

func (Individual) Fields() []ent.Field {
	return []ent.Field{
		field.Int64("id").Unique().Immutable().Comment("matches BIGSERIAL"),
		field.String("first_name").NotEmpty().MaxLen(50),
		field.String("last_name").NotEmpty().MaxLen(50),
		field.String("patronymic").Optional().Nillable().MaxLen(54),
		field.String("registration_address").NotEmpty(),
		field.String("passport_series").NotEmpty().MaxLen(4),
		field.String("passport_number").NotEmpty().MaxLen(6),
		field.String("passport_issued_by").NotEmpty(),
		field.String("passport_issued_date").NotEmpty(),
		field.String("passport_issued_department_code").NotEmpty().MaxLen(7),
		field.Bool("is_authorized_representative").Default(false),
		field.Time("created_at").Default(time.Now),
		field.Time("updated_at").Default(time.Now).UpdateDefault(time.Now),
	}
}

func (Individual) Edges() []ent.Edge { return nil }
