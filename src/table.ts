import {
  createColumnHelper,
  getCoreRowModel,
  createTable,
} from "@tanstack/table-core";

import type { TodoItem } from "./types";
import { statusCell, textCell, createdAtCell, actionsCell } from "./components";

const columnHelper = createColumnHelper<TodoItem>();

export const createTodoColumns = (onToggle: (id: string) => void) => [
  columnHelper.accessor("completed", {
    header: "Status",
    cell: statusCell(onToggle),
    size: 80,
  }),
  columnHelper.accessor("text", {
    header: "Zadanie",
    cell: textCell,
  }),
  columnHelper.accessor("createdAt", {
    header: "Data utworzenia",
    cell: createdAtCell,
    size: 180,
  }),
  columnHelper.display({
    id: "actions",
    header: "Akcje",
    cell: actionsCell,
    size: 100,
  }),
];

export const createTodoTable = (
  data: TodoItem[],
  columns: any[],
  onStateChange: (updater: any) => void
) => {
  const table = createTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnPinning: {},
    },
    onStateChange,
    renderFallbackValue: null,
  });

  return table;
};

export const renderTable = (
  table: any,
  containerId: string,
  onDelete: (id: string) => void
) => {
  const wrapper = document.getElementById(containerId);
  if (!wrapper) return;

  const tableElement = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  table.getHeaderGroups().forEach((headerGroup: any) => {
    const tr = document.createElement("tr");
    headerGroup.headers.forEach((header: any) => {
      const th = document.createElement("th");
      if (!header.isPlaceholder) {
        const headerContent = header.column.columnDef.header;
        th.textContent =
          typeof headerContent === "function"
            ? headerContent(header.getContext())
            : headerContent;
      }
      tr.appendChild(th);
    });
    thead.appendChild(tr);
  });

  table.getRowModel().rows.forEach((row: any) => {
    const tr = document.createElement("tr");
    row.getVisibleCells().forEach((cell: any) => {
      const td = document.createElement("td");
      const rendered =
        typeof cell.column.columnDef.cell === "function"
          ? cell.column.columnDef.cell(cell.getContext())
          : cell.column.columnDef.cell;

      if (typeof rendered === "string") {
        td.innerHTML = rendered;
      } else if (rendered instanceof Node) {
        td.appendChild(rendered);
      } else {
        td.textContent = String(rendered);
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  tableElement.appendChild(thead);
  tableElement.appendChild(tbody);

  wrapper.innerHTML = "";
  wrapper.appendChild(tableElement);

  wrapper.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = (e.target as HTMLElement).getAttribute("data-id");
      if (id) onDelete(id);
    });
  });
};
