import type { TodoItem } from "./types";

export function statusCell(onToggle: (id: string) => void) {
  return (info: any) => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = info.getValue();
    checkbox.className = "todo-table-cell todo-checkbox";
    checkbox.addEventListener("change", () => {
      onToggle(info.row.original.id);
    });
    return checkbox;
  };
}

export function textCell(info: any) {
  const completed = info.row.original.completed;
  const span = document.createElement("span");
  span.className = "todo-table-cell" + (completed ? " todo-completed" : "");
  span.textContent = info.getValue();
  return span;
}

export function createdAtCell(info: any) {
  const date = info.getValue();
  const span = document.createElement("span");
  span.className = "todo-table-cell";
  span.textContent = date.toLocaleString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return span;
}

export function actionsCell(info: any) {
  const button = document.createElement("button");
  button.className = "todo-table-cell delete-btn";
  button.setAttribute("data-id", info.row.original.id);
  button.textContent = "Usuń";
  return button;
}

export function createStatsElement(todos: TodoItem[]) {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const active = total - completed;

  const container = document.createElement("div");
  container.className = "flex gap-4 items-center";

  const title = document.createElement("span");
  title.className = "font-semibold";
  title.textContent = "Statystyki:";
  container.appendChild(title);

  const totalEl = document.createElement("span");
  totalEl.textContent = `${total} ${total === 1 ? "zadanie" : "zadań"}`;
  container.appendChild(totalEl);

  const activeEl = document.createElement("span");
  activeEl.className = "text-blue-600";
  activeEl.textContent = `• ${active} aktywnych`;
  container.appendChild(activeEl);

  const completedEl = document.createElement("span");
  completedEl.className = "text-green-600";
  completedEl.textContent = `• ${completed} ukończonych`;
  container.appendChild(completedEl);

  return container;
}
