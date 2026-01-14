"use client";

import { useEffect, useState } from "react";

import { ListPage } from "@/components/list-page";
import { apiDelete, apiGet } from "@/lib/api";

type DepartmentRow = { id: number; title: string };

export default function DepartmentsPage() {
  const [rows, setRows] = useState<DepartmentRow[]>([]);

  useEffect(() => {
    apiGet<DepartmentRow[]>("/api/departments")
      .then((data) => setRows(data ?? []))
      .catch((err) => {
        console.error("Failed to load departments", err);
        setRows([]);
      });
  }, []);

  const handleDelete = async (row: DepartmentRow) => {
    try {
      await apiDelete(`/api/departments/${row.id}`);
    } catch (err) {
      console.error("Failed to delete department", err);
    }
    setRows((prev) => prev.filter((item) => item.id !== row.id));
  };

  return (
    <ListPage
      title="Отделы"
      description="Справочник отделов"
      columns={[{ key: "title", label: "Наименование" }]}
      rows={rows}
      createHref="/departments/new"
      actions={{
        showEdit: true,
        showDelete: true,
        editHref: (row) => `/departments/${row.id}/edit`,
        onDelete: (row) => handleDelete(row as DepartmentRow),
      }}
    />
  );
}
