"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { createList, updateList } from "@/app/actions/lists";

export function ListFormUpdate({
  listId,
  onUpdateSuccessAction,
  closeFormAction,
}: {
  listId: string;
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
      await updateList(listId, title.trim());
      setTitle("");
      router.refresh();
      if (onUpdateSuccessAction) {
        onUpdateSuccessAction();
      }
    } catch (error) {
      console.error("Error", error);
      setError("Error al actualizar la lista");
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
          Editar lista
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="list-title-update"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Título de la lista
            </label>
            <input
              id="list-title-update"
              type="text"
              placeholder="Nuevo título de la lista"
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
              {updating ? "Actualizando..." : "Actualizar lista"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default function ListForm({
  boardId,
  closeFormAction,
}: {
  boardId: string;
  closeFormAction?: () => void;
}) {
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreating(true);
    setError("");
    try {
      if (!title.trim()) {
        setError("Título requerido");
        setCreating(false);
        return;
      }
      await createList(boardId, title.trim());
      setTitle("");
      if (closeFormAction) {
        closeFormAction();
      }
      router.refresh();
    } catch (error) {
      console.error("Error", error);
      setError("Error al crear la lista");
    } finally {
      setCreating(false);
    }
  }

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
          Nueva lista
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="list-title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Título de la lista
            </label>
            <input
              id="list-title"
              type="text"
              placeholder="Ej. Pendientes"
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
              disabled={creating}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-sm hover:bg-gray-600 hover:shadow-md transition-all duration-300 ease-in-out text-sm font-medium active:scale-98 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {creating ? "Creando..." : "Crear lista"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
