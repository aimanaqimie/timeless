"use client";

import { useState, useEffect, useTransition } from "react";
import {
  getTodos,
  addTodo as addTodoAction,
  updateTodo as updateTodoAction,
  deleteTodo as deleteTodoAction,
} from "../../../utils/supabase/actions";

interface Todo {
  id: string;
  user_id: string;
  text: string;
  completed: boolean;
  created_at: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    setIsLoading(true);
    const data = await getTodos();
    setTodos(data);
    setIsLoading(false);
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    startTransition(async () => {
      const result = await addTodoAction(newTodo.trim());
      if (result.data) {
        setTodos([result.data, ...todos]);
        setNewTodo("");
      }
    });
  };

  const handleToggleTodo = async (todo: Todo) => {
    startTransition(async () => {
      const result = await updateTodoAction(todo.id, {
        completed: !todo.completed,
      });
      if (result.data) {
        setTodos(
          todos.map((t) => (t.id === todo.id ? { ...t, completed: !t.completed } : t))
        );
      }
    });
  };

  const handleDeleteTodo = async (id: string) => {
    startTransition(async () => {
      const result = await deleteTodoAction(id);
      if (result.success) {
        setTodos(todos.filter((t) => t.id !== id));
      }
    });
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editText.trim()) {
      handleDeleteTodo(id);
      return;
    }

    startTransition(async () => {
      const result = await updateTodoAction(id, { text: editText.trim() });
      if (result.data) {
        setTodos(
          todos.map((t) => (t.id === id ? { ...t, text: editText.trim() } : t))
        );
        setEditingId(null);
        setEditText("");
      }
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="flex h-full w-full max-w-md flex-col rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-black dark:text-white">
          To-Do List
        </h2>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {completedCount}/{todos.length} done
        </span>
      </div>

      <form onSubmit={handleAddTodo} className="mb-4 flex gap-2">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          disabled={isPending}
          className="h-10 flex-1 rounded-lg border border-black/20 bg-transparent px-3 text-sm text-black outline-none transition-colors focus:border-black disabled:opacity-50 dark:border-white/20 dark:text-white dark:focus:border-white"
        />
        <button
          type="submit"
          disabled={isPending}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
        </button>
      </form>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center text-sm text-zinc-400 dark:text-zinc-500">
            Loading...
          </div>
        ) : todos.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-sm text-zinc-400 dark:text-zinc-500">
            No tasks yet. Add one above!
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`group flex items-center gap-3 rounded-lg border border-black/5 bg-zinc-50 p-3 dark:border-white/5 dark:bg-zinc-800/50 ${isPending ? "opacity-50" : ""}`}
            >
              <button
                onClick={() => handleToggleTodo(todo)}
                disabled={isPending}
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                  todo.completed
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-600 dark:hover:border-zinc-500"
                }`}
              >
                {todo.completed && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
              </button>

              {editingId === todo.id ? (
                <div className="flex flex-1 gap-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEdit(todo.id);
                      if (e.key === "Escape") cancelEdit();
                    }}
                    className="h-8 flex-1 rounded border border-black/20 bg-white px-2 text-sm text-black outline-none focus:border-black dark:border-white/20 dark:bg-zinc-900 dark:text-white dark:focus:border-white"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveEdit(todo.id)}
                    disabled={isPending}
                    className="text-emerald-500 hover:text-emerald-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <span
                    className={`flex-1 text-sm transition-colors ${
                      todo.completed
                        ? "text-zinc-400 line-through dark:text-zinc-500"
                        : "text-black dark:text-white"
                    }`}
                  >
                    {todo.text}
                  </span>

                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => startEdit(todo)}
                      disabled={isPending}
                      className="rounded p-1 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m15 5 4 4" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      disabled={isPending}
                      className="rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
