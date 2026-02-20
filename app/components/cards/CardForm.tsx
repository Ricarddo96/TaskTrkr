"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { createCard, updateCard } from "@/app/actions/cards";

export function CardFormUpdate({
  cardId,
  currentTitle,
  currentDescription,
  onUpdateSuccessAction,
  closeFormAction,
}: {
  cardId: string;
  currentTitle: string;
  currentDescription?: string | null;
  onUpdateSuccessAction?: () => void;
  closeFormAction?: () => void;
}) {
  const [title, setTitle] = useState(currentTitle);
  const [description, setDescription] = useState(currentDescription || "");
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setUpdating(true);
    setError("");
    e.preventDefault();
    try {
      if (!title.trim()) {
        setError("El título es requerido");
        setUpdating(false);
        return;
      }
      await updateCard(cardId, title.trim(), description.trim());
      setTitle("");
      setDescription("");
      router.refresh();
      if (onUpdateSuccessAction) {
        onUpdateSuccessAction();
      }
      return;
    } catch (error) {
      console.error("error al actualizar la tarjeta", error);
      setError(
        error instanceof Error
          ? error.message
          : "Error al actualizar la tarjeta"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs"
      onClick={closeFormAction}
    >
      <div
        className="max-w-md w-full mx-4 bg-white/90 backdrop-blur-lg rounded-lg shadow-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
          Editar tarjeta
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="card-title-update"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Título de la tarjeta
            </label>
            <input
              id="card-title-update"
              type="text"
              placeholder="Título"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white/70 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
            />
          </div>

          <div>
            <label
              htmlFor="card-description-update"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Descripción (opcional)
            </label>
            <textarea
              id="card-description-update"
              placeholder="Descripción"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (error) setError("");
              }}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white/70 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 resize-none"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm" role="alert">
              {error}
            </div>
          )}

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
              {updating ? "Actualizando..." : "Actualizar tarjeta"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
export default function CardForm({
  listId,
  closeFormAction,
}: {
  listId: string;
  closeFormAction: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    try {
      if (!title.trim()) {
        setError("El título es requerido");
        setCreating(false);
        return;
      }
      await createCard(listId, title.trim(), description.trim());
      setTitle("");
      setDescription("");
      if (closeFormAction) {
        closeFormAction();
      }
      router.refresh();
    } catch (error) {
      console.error("error al crear la tarjeta", error);
      setError(
        error instanceof Error ? error.message : "Error al crear la tarjeta"
      );
    } finally {
      setCreating(false);
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs"
      onClick={closeFormAction}
    >
      <div
        className="max-w-md w-full mx-4 bg-white/90 backdrop-blur-lg rounded-lg shadow-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
          Nueva tarjeta
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="card-title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Título de la tarjeta
            </label>
            <input
              id="card-title"
              type="text"
              placeholder="Ej. Tarea importante"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white/70 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
            />
          </div>

          <div>
            <label
              htmlFor="card-description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Descripción (opcional)
            </label>
            <textarea
              id="card-description"
              placeholder="Ej. Detalles de la tarea..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (error) setError("");
              }}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white/70 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 resize-none"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm" role="alert">
              {error}
            </div>
          )}

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
              {creating ? "Creando..." : "Crear tarjeta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Renderizar el modal usando portal para que esté fuera del árbol DOM de la lista
  if (!mounted) return null;

  return createPortal(modalContent, document.body);
}
