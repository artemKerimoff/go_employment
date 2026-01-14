package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// EmploymentOrderBody holds line items for hiring orders.
type EmploymentOrderBody struct {
	ent.Schema
}

func (EmploymentOrderBody) Fields() []ent.Field {
	return []ent.Field{
		field.Int64("id").Unique().Immutable().Comment("matches BIGSERIAL"),
		field.Int64("employment_order_header_id"),
		field.Int64("employment_contract_id"),
		field.Int64("department_id"),
		field.Int64("position_id"),
		field.Float("salary").SchemaType(map[string]string{"postgres": "numeric(12,2)"}),
		field.Time("work_date_from").SchemaType(map[string]string{"postgres": "date"}),
		field.Time("work_date_to").SchemaType(map[string]string{"postgres": "date"}),
		field.Int("probation_months").Optional().Nillable(),
		field.Time("created_at").Default(time.Now),
		field.Time("updated_at").Default(time.Now).UpdateDefault(time.Now),
	}
}

func (EmploymentOrderBody) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("header", EmploymentOrderHeader.Type).
			Ref("bodies").
			Field("employment_order_header_id").
			Unique().
			Required().
			Annotations(entsql.Annotation{OnDelete: entsql.Cascade}),
	}
}
