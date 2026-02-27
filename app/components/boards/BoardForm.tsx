"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

export function BoardFormUpdate({
  boardId,
  onUpdateSuccessAction,
  closeFormAction,
}: {
  boardId: string;
  onUpdateSuccessAction?: () => void;
  closeFormAction?: () => void;
}) {
  const [title, setTitle] = useState("");
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUpdating(true);
    setError("");
    try {
      if (!title.trim()) {
        setError("Título requerido");
        setUpdating(false);
        return;
      }
      const response = await fetch(`/api/boards/${boardId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() }),
      });
      if (!response.ok) {
        throw new Error("Error al actualizar el tablero");
      }
      setTitle("");
      router.refresh();
      if (onUpdateSuccessAction) {
        onUpdateSuccessAction();
      }
    } catch (err) {
      console.error("Error", err);
      setError("Error al actualizar el tablero");
    } finally {
      setUpdating(false);
    }
  }

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-xs"
      onClick={closeFormAction}
    >
      <div
        className="max-w-md w-full mx-4 bg-white/90 backdrop-blur-lg rounded-lg shadow-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
          Editar tablero
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="board-title-update"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Título del tablero
            </label>
            <input
              id="board-title-update"
              type="text"
              placeholder="Nuevo título del tablero"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white/70 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
            />
            {error && (
              <div className="text-red-500 text-sm mt-2" role="alert">
                {error}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={closeFormAction}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-300/70 transition-colors active:scale-98"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={updating}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-sm hover:bg-gray-600 hover:shadow-md transition-all duration-300 ease-in-out text-sm font-medium active:scale-98 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {updating ? "Actualizando..." : "Actualizar tablero"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default function BoardForm({
  closeFormAction,
}: {
  closeFormAction: () => void;
}) {
  const [title, setTitle] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("El título es requerido");
      return;
    }

    try {
      const response = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() }),
      });
      if (response.ok) {
        setTitle("");
        closeFormAction();
        router.refresh();
      } else {
        alert("Error al crear el tablero");
      }
    } catch (error) {
      console.error("Error", error);
      alert("Error al crear el tablero");
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-xs"
      onClick={closeFormAction}
    >
       <div
         className="max-w-md w-full mx-4 bg-white/90 backdrop-blur-lg rounded-lg shadow-lg p-6"
         onClick={(e) => e.stopPropagation()} 
       >
        <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
          Nuevo tablero
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="board-title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Título del tablero
            </label>
            <input
              id="board-title"
              type="text"
              placeholder="Ej. Proyecto personal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white/70 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
            />
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={closeFormAction}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-300/70 transition-colors active:scale-98"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-sm hover:bg-gray-600 hover:shadow-md transition-all duration-300 ease-in-out text-sm font-medium active:scale-98"
            >
              Crear tablero
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
