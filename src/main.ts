import "./style.css";
import type { TodoItem, FilterType } from "./types";
import { loadTodos, saveTodos } from "./storage";
import { createTodoColumns, createTodoTable, renderTable } from "./table";
import { createStatsElement } from "./components";

export function initTodoApp() {
  let todos = loadTodos();
  let currentFilter: FilterType = "all";
  let table: any = null;

  function setupEventListeners() {
    const form = document.getElementById("todo-form") as HTMLFormElement;
    const input = document.getElementById("todo-input") as HTMLInputElement;

    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (text) {
        addTodo(text);
        input.value = "";
      }
    });

    document
      .getElementById("clear-completed")
      ?.addEventListener("click", () => {
        clearCompleted();
      });

    document.getElementById("filter-all")?.addEventListener("click", () => {
      setFilter("all");
    });

    document.getElementById("filter-active")?.addEventListener("click", () => {
      setFilter("active");
    });

    document
      .getElementById("filter-completed")
      ?.addEventListener("click", () => {
        setFilter("completed");
      });
  }

  function addTodo(text: string) {
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date(),
    };
    todos.unshift(newTodo);
    save();
    render();
  }

  function toggleTodo(id: string) {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      save();
      render();
    }
  }

  function deleteTodo(id: string) {
    todos = todos.filter((t) => t.id !== id);
    save();
    render();
  }

  function clearCompleted() {
    todos = todos.filter((t) => !t.completed);
    save();
    render();
  }

  function setFilter(filter: FilterType) {
    currentFilter = filter;
    render();
  }

  function getFilteredTodos(): TodoItem[] {
    switch (currentFilter) {
      case "active":
        return todos.filter((t) => !t.completed);
      case "completed":
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  }

  function save() {
    saveTodos(todos);
  }

  function updateStats() {
    const statsEl = document.getElementById("stats");
    if (statsEl) {
      statsEl.innerHTML = "";
      const statsElement = createStatsElement(todos);
      statsEl.appendChild(statsElement);
    }
  }

  function render() {
    const filteredData = getFilteredTodos();

    const columns = createTodoColumns((id) => toggleTodo(id));

    const onStateChange = (updater: any) => {
      if (table) {
        table.setOptions((prev: any) => ({
          ...prev,
          state: updater(table.getState()),
        }));
      }
    };

    table = createTodoTable(filteredData, columns, onStateChange);

    renderTable(table, "table-wrapper", (id) => deleteTodo(id));
    updateStats();
  }

  setupEventListeners();
  render();
}

document.addEventListener("DOMContentLoaded", () => {
  initTodoApp();
});
