package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// DismissalOrderBody holds line items for dismissal orders.
type DismissalOrderBody struct {
	ent.Schema
}

func (DismissalOrderBody) Fields() []ent.Field {
	return []ent.Field{
		field.Int64("id").Unique().Immutable().Comment("matches BIGSERIAL"),
		field.Int64("dismissal_order_header_id"),
		field.Int64("employment_contract_id"),
		field.Int64("department_id"),
		field.Int64("position_id"),
		field.Time("dismissal_date").SchemaType(map[string]string{"postgres": "date"}),
		field.String("dismissal_ground").NotEmpty().MaxLen(80),
		field.Int("doc_number").Optional().Nillable(),
		field.Time("doc_date").Optional().Nillable().SchemaType(map[string]string{"postgres": "date"}),
		field.Time("created_at").Default(time.Now),
		field.Time("updated_at").Default(time.Now).UpdateDefault(time.Now),
	}
}

func (DismissalOrderBody) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("header", DismissalOrderHeader.Type).
			Ref("bodies").
			Field("dismissal_order_header_id").
			Unique().
			Required().
			Annotations(entsql.Annotation{OnDelete: entsql.Cascade}),
	}
}
