package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/field"
)

// Account stores bank requisites.
type Account struct {
	ent.Schema
}

func (Account) Fields() []ent.Field {
	return []ent.Field{
		field.Int64("id").Unique().Immutable().Comment("matches BIGSERIAL"),
		field.String("number").NotEmpty().MaxLen(20),
		field.String("bank").NotEmpty().MaxLen(50),
		field.String("bic").NotEmpty().MaxLen(9),
		field.Time("created_at").Default(time.Now),
		field.Time("updated_at").Default(time.Now).UpdateDefault(time.Now),
	}
}

func (Account) Edges() []ent.Edge { return nil }
