import Link from "next/link";
import React from "react";

type Column = {
  key: string;
  label: string;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
};

type ActionConfig = {
  showEdit?: boolean;
  showDelete?: boolean;
  showPrint?: boolean;
  onPrint?: (row: Record<string, unknown>) => void;
  editHref?: (row: Record<string, unknown>) => string;
  onDelete?: (row: Record<string, unknown>) => void | Promise<void>;
};

type ListPageProps = {
  title: string;
  description: string;
  columns: Column[];
  rows: Record<string, unknown>[] | null | undefined;
  createLabel?: string;
  createHref?: string;
  actions?: ActionConfig;
};

export function ListPage({
  title,
  description,
  columns,
  rows,
  createLabel = "Создать",
  createHref,
  actions,
}: ListPageProps) {
  const hasActions = Boolean(actions);
  const data = rows ?? [];

  return (
    <div className="flex min-h-screen bg-zinc-950 p-8">
      <div className="w-full">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-50">{title}</h1>
            <p className="text-zinc-400 mt-2">{description}</p>
          </div>
          <div>
            {createHref ? (
              <Link
                href={createHref}
                className="inline-flex items-center rounded-lg border  bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-950 shadow hover:bg-zinc-200"
              >
                {createLabel}
              </Link>
            ) : (
              <button
                type="button"
                className="inline-flex items-center rounded-lg border bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-950 shadow hover:bg-zinc-200"
                disabled
              >
                {createLabel}
              </button>
            )}
          </div>
        </header>

        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-zinc-900/70">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400"
                  >
                    {col.label}
                  </th>
                ))}
                {hasActions && (
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    Действия
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-zinc-900" : "bg-zinc-900/60"}
                >
                  {columns.map((col) => {
                    const value = row[col.key];
                    return (
                      <td key={col.key} className="px-4 py-3 text-zinc-100">
                        {col.render ? col.render(value, row) : String(value ?? "—")}
                      </td>
                    );
                  })}

                  {hasActions && (
                    <td className="px-4 py-3 text-zinc-100">
                      <div className="flex items-center gap-2 text-xs">
                        {actions?.showEdit && (
                          actions?.editHref ? (
                            <Link
                              href={actions.editHref(row)}
                              className="rounded-md border border-zinc-700 px-3 py-1 text-zinc-100 hover:border-zinc-500 hover:text-white"
                            >
                              Редактировать
                            </Link>
                          ) : (
                            <button
                              type="button"
                              className="rounded-md border border-zinc-800 px-3 py-1 text-zinc-400"
                              disabled
                            >
                              Редактировать
                            </button>
                          )
                        )}
                        {actions?.showDelete && (
                          <button
                            type="button"
                            className="rounded-md border border-red-500/60 px-3 py-1 text-red-200 hover:border-red-400 hover:text-red-100"
                            onClick={() => actions?.onDelete?.(row)}
                          >
                            Удалить
                          </button>
                        )}
                        {actions?.showPrint && (
                          <button
                            type="button"
                            className="rounded-md border border-blue-500/60 px-3 py-1 text-blue-200 hover:border-blue-400 hover:text-blue-100"
                            onClick={() => actions?.onPrint?.(row)}
                          >
                            Печать
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length + (hasActions ? 1 : 0)}
                    className="px-4 py-6 text-center text-zinc-500"
                  >
                    Данные отсутствуют
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
