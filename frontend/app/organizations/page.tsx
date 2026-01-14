"use client";

import { useEffect, useState } from "react";

import { ListPage } from "@/components/list-page";
import { apiDelete, apiGet } from "@/lib/api";

type OrgRow = {
  id: number;
  title: string;
  address: string;
  inn: string;
  kpp: string | null;
};


export default function OrganizationsPage() {
  const [rows, setRows] = useState<OrgRow[]>([]);

  useEffect(() => {
    apiGet<OrgRow[]>("/api/organizations")
      .then((data) => setRows(data ?? []))
      .catch((err) => {
        console.error("Failed to load organizations", err);
        setRows([]);
      });
  }, []);

  const handleDelete = async (row: OrgRow) => {
    try {
      await apiDelete(`/api/organizations/${row.id}`);
    } catch (err) {
      console.error("Failed to delete organization", err);
    }
    setRows((prev) => prev.filter((item) => item.id !== row.id));
  };

  return (
    <ListPage
      title="Организации"
      description="Основные сведения по организациям"
      columns={[
        { key: "title", label: "Наименование" },
        { key: "address", label: "Адрес" },
        { key: "inn", label: "ИНН" },
        { key: "kpp", label: "КПП" },
      ]}
      rows={rows}
      createHref="/organizations/new"
      actions={{
        showEdit: true,
        showDelete: true,
        editHref: (row) => `/organizations/${row.id}/edit`,
        onDelete: (row) => handleDelete(row as OrgRow),
      }}
    />
  );
}
