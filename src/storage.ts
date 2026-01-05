import type { TodoItem } from "./types";

const STORAGE_KEY = "todos";

export const loadTodos = (): TodoItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored) as TodoItem[];
    return parsed.map((item) => ({
      ...item,
      createdAt: new Date(item.createdAt),
    }));
  } catch (error) {
    alert("Error loading todos: " + error);
    return [];
  }
};

export const saveTodos = (todos: TodoItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    alert("Error saving todos: " + error);
  }
};
