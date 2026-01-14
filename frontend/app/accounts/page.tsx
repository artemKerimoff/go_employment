"use client";

import { useEffect, useState } from "react";

import { ListPage } from "@/components/list-page";
import { apiDelete, apiGet } from "@/lib/api";

type AccountRow = { id: number; number: string; bank: string; bic: string };

const fallbackRows: AccountRow[] = []; // Removed account mocks

export default function AccountsPage() {
  const [rows, setRows] = useState<AccountRow[]>([]); // Start empty

  useEffect(() => {
    apiGet<AccountRow[]>("/api/accounts")
      .then((data) => setRows(data ?? [])) // Use server data only
      .catch((err) => {
        console.error("Failed to load accounts", err);
        setRows([]); // Keep rows empty on error
      });
  }, []);

  const handleDelete = async (row: AccountRow) => {
    try {
      await apiDelete(`/api/accounts/${row.id}`);
    } catch (err) {
      console.error("Failed to delete account", err);
    }
    setRows((prev) => prev.filter((item) => item.id !== row.id));
  };

  return (
    <ListPage
      title="Счета"
      description="Реквизиты расчётных счетов"
      columns={[
        { key: "number", label: "Номер" },
        { key: "bank", label: "Банк" },
        { key: "bic", label: "БИК" },
      ]}
      rows={rows}
      createHref="/accounts/new"
      actions={{
        showEdit: true,
        showDelete: true,
        editHref: (row) => `/accounts/${row.id}/edit`,
        onDelete: (row) => handleDelete(row as AccountRow),
      }}
    />
  );
}
