"use client";

import { useEffect, useState } from "react";

import { ListPage } from "@/components/list-page";
import { apiDelete, apiGet } from "@/lib/api";

type PositionRow = { id: number; title: string };

export default function PositionsPage() {
  const [rows, setRows] = useState<PositionRow[]>([]);

  useEffect(() => {
    apiGet<PositionRow[]>("/api/positions")
      .then((data) => setRows(data ?? []))
      .catch((err) => {
        console.error("Failed to load positions", err);
        setRows([]);
      });
  }, []);

  const handleDelete = async (row: PositionRow) => {
    try {
      await apiDelete(`/api/positions/${row.id}`);
    } catch (err) {
      console.error("Failed to delete position", err);
    }
    setRows((prev) => prev.filter((item) => item.id !== row.id));
  };

  return (
    <ListPage
      title="Должности"
      description="Справочник должностей"
      columns={[{ key: "title", label: "Наименование" }]}
      rows={rows}
      createHref="/positions/new"
      actions={{
        showEdit: true,
        showDelete: true,
        editHref: (row) => `/positions/${row.id}/edit`,
        onDelete: (row) => handleDelete(row as PositionRow),
      }}
    />
  );
}
