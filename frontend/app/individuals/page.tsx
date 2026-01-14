"use client";

import { useEffect, useState } from "react";

import { ListPage } from "@/components/list-page";
import { apiDelete, apiGet } from "@/lib/api";

type IndividualRow = {
  id: number;
  fio: string;
  address: string;
  passportSeries: string;
  passportNumber: string;
  isAuthorizedRepresentative: boolean;
};

export default function IndividualsPage() {
  const [rows, setRows] = useState<IndividualRow[]>([]);

  useEffect(() => {
    apiGet<any[]>("/api/individuals")
      .then((data) => {
        if (!data) return setRows([]);
        setRows(
          data.map((item) => ({
            id: item.id,
            fio: [item.last_name, item.first_name, item.patronymic].filter(Boolean).join(" "),
            address: item.registration_address,
            passportSeries: item.passport_series,
            passportNumber: item.passport_number,
            isAuthorizedRepresentative: item.is_authorized_representative,
          }))
        );
      })
      .catch((err) => {
        console.error("Failed to load individuals", err);
        setRows([]);
      });
  }, []);

  const handleDelete = async (row: IndividualRow) => {
    try {
      await apiDelete(`/api/individuals/${row.id}`);
    } catch (err) {
      console.error("Failed to delete individual", err);
    }
    setRows((prev) => prev.filter((item) => item.id !== row.id));
  };

  return (
    <ListPage
      title="Сотрудники"
      description="ФИО, адрес и паспортные данные"
      columns={[
        { key: "fio", label: "ФИО" },
        { key: "address", label: "Адрес" },
        { key: "passportSeries", label: "Серия паспорта" },
        { key: "passportNumber", label: "Номер паспорта" },
        {
          key: "isAuthorizedRepresentative",
          label: "Уполномоченный представитель",
          render: (value) => (
            <span
              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                value ? "bg-emerald-500/20 text-emerald-200" : "bg-zinc-800 text-zinc-300"
              }`}
            >
              {value ? "Да" : "Нет"}
            </span>
          ),
        },
      ]}
      rows={rows}
      createHref="/individuals/new"
      actions={{
        showEdit: true,
        showDelete: true,
        editHref: (row) => `/individuals/${row.id}/edit`,
        onDelete: (row) => handleDelete(row as IndividualRow),
      }}
    />
  );
}
