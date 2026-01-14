package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/field"
)

// Organization captures company data.
type Organization struct {
	ent.Schema
}

func (Organization) Fields() []ent.Field {
	return []ent.Field{
		field.Int64("id").Unique().Immutable().Comment("matches BIGSERIAL"),
		field.String("title").NotEmpty().MaxLen(200),
		field.String("address").NotEmpty(),
		field.String("okpo").NotEmpty().MaxLen(14),
		field.String("inn").NotEmpty().MaxLen(12),
		field.String("kpp").Optional().Nillable().MaxLen(9),
		field.Int64("account_id"),
		field.Time("created_at").Default(time.Now),
		field.Time("updated_at").Default(time.Now).UpdateDefault(time.Now),
	}
}

func (Organization) Edges() []ent.Edge {
	return nil // account is a scalar FK to another service
}
