package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/field"
)

// EmploymentContract describes the contract data.
type EmploymentContract struct {
	ent.Schema
}

func (EmploymentContract) Fields() []ent.Field {
	return []ent.Field{
		field.Int64("id").Unique().Immutable().Comment("matches BIGSERIAL"),
		field.String("number").NotEmpty().MaxLen(6),
		field.String("personnel_number").NotEmpty(),
		field.Time("conclusion_date").SchemaType(map[string]string{"postgres": "date"}),
		field.Int64("organization_id"),
		field.Int64("representative_id"),
		field.Int64("employee_id"),
		field.Int64("department_id"),
		field.Int64("position_id"),
		field.Int("conditions_class"),
		field.Time("work_date_from").SchemaType(map[string]string{"postgres": "date"}),
		field.Time("work_date_to").SchemaType(map[string]string{"postgres": "date"}).Optional().Nillable(),
		field.Int("probation_months").Optional().Nillable(),
		field.Float("salary").SchemaType(map[string]string{"postgres": "real"}),
		// store work/break hours as strings (HH:MM) to avoid Scan issues with driver returning string for time type
		field.String("work_hours_from").SchemaType(map[string]string{"postgres": "time"}),
		field.String("work_hours_to").SchemaType(map[string]string{"postgres": "time"}),
		field.String("break_from").SchemaType(map[string]string{"postgres": "time"}).Optional().Nillable(),
		field.String("break_to").SchemaType(map[string]string{"postgres": "time"}).Optional().Nillable(),
		field.Int("paid_leave_days"),
		field.Time("created_at").Default(time.Now),
		field.Time("updated_at").Default(time.Now).UpdateDefault(time.Now),
	}
}

func (EmploymentContract) Edges() []ent.Edge { return nil }
