"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteCard } from "../../actions/cards";
import { CardFormUpdate } from "./CardForm";

export default function CardMenu({
  cardId,
  currentTitle,
  currentDescription,
}: {
  cardId: string;
  currentTitle: string;
  currentDescription?: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
    setError("");
  };

  const handleEdit = () => {
    setIsOpen(false);
    setShowEditForm(true);
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres borrar esta tarjeta?")) {
      setIsOpen(false);
      return;
    }

    setDeleting(true);
    setError("");
    setIsOpen(false);
    try {
      await deleteCard(cardId);
      router.refresh();
    } catch (error) {
      console.error("Error al borrar la tarjeta", error);
      setError("Error al borrar la tarjeta");
      setDeleting(false);
    }
  };

  const handleUpdateSuccess = () => {
    setShowEditForm(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleToggleMenu}
        className="text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-300 transition-colors"
        aria-label="Menú de opciones"
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 min-w-[150px] z-50">
          <button
            onClick={handleEdit}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md transition-colors flex items-center gap-2"
          >
            <span>✏️</span>
            <span>Editar</span>
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 last:rounded-b-md transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <span>🗑️</span>
            <span>{deleting ? "Borrando..." : "Borrar"}</span>
          </button>
        </div>
      )}

      {showEditForm && (
        <CardFormUpdate
          cardId={cardId}
          currentTitle={currentTitle}
          currentDescription={currentDescription}
          onUpdateSuccessAction={handleUpdateSuccess}
          closeFormAction={() => setShowEditForm(false)}
        />
      )}

      {error && (
        <div className="absolute right-0 top-full mt-1 bg-red-50 border border-red-200 rounded-md p-2 text-red-600 text-xs z-50">
          {error}
        </div>
      )}
    </div>
  );
}

