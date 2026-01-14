package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/field"
)

// Position represents a job title.
type Position struct {
	ent.Schema
}

func (Position) Fields() []ent.Field {
	return []ent.Field{
		field.Int64("id").Unique().Immutable().Comment("matches BIGSERIAL"),
		field.String("title").NotEmpty().MaxLen(50),
		field.Time("created_at").Default(time.Now),
		field.Time("updated_at").Default(time.Now).UpdateDefault(time.Now),
	}
}

func (Position) Edges() []ent.Edge { return nil }
