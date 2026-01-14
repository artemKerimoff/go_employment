package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// DismissalOrderHeader stores meta for dismissal orders.
type DismissalOrderHeader struct {
	ent.Schema
}

func (DismissalOrderHeader) Fields() []ent.Field {
	return []ent.Field{
		field.Int64("id").Unique().Immutable().Comment("matches BIGSERIAL"),
		field.String("number").NotEmpty().MaxLen(6),
		field.Time("preparation_date").SchemaType(map[string]string{"postgres": "date"}),
		field.Int64("organization_id"),
		field.Time("created_at").Default(time.Now),
		field.Time("updated_at").Default(time.Now).UpdateDefault(time.Now),
	}
}

func (DismissalOrderHeader) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("bodies", DismissalOrderBody.Type).
			Annotations(entsql.Annotation{OnDelete: entsql.Cascade}),
	}
}
