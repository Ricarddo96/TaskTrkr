"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { BoardFormUpdate } from "./BoardForm";

export default function BoardMenu({ boardId }: { boardId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const clickedButton = buttonRef.current?.contains(target);
      const clickedMenu = menuRef.current?.contains(target);
      if (!clickedButton && !clickedMenu) {
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

  const handleToggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + window.scrollY + 4,
        right: window.innerWidth - rect.right,
      });
    }

    setIsOpen(!isOpen);
    setError("");
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
    setShowEditForm(true);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      !confirm(
        "¿Estás seguro de que quieres borrar este tablero? Se eliminarán todas sus listas y tarjetas."
      )
    ) {
      setIsOpen(false);
      return;
    }

    setDeleting(true);
    setError("");
    setIsOpen(false);
    try {
      const response = await fetch(`/api/boards/${boardId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error al borrar el tablero");
      }
      router.refresh();
    } catch (err) {
      console.error("Error al borrar", err);
      setError("Error al borrar el tablero");
      setDeleting(false);
    }
  };

  const dropdown =
    mounted && isOpen
      ? createPortal(
          <div
            ref={menuRef}
            style={{ top: menuPos.top, right: menuPos.right }}
            className="fixed bg-white shadow-lg rounded-md border border-gray-200 min-w-[150px] z-9999"
          >
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
          </div>,
          document.body
        )
      : null;

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <button
        ref={buttonRef}
        onClick={handleToggleMenu}
        disabled={deleting}
        className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50"
        aria-label="Menú de opciones del tablero"
      >
        {deleting ? (
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        )}
      </button>

      {dropdown}

      {showEditForm && (
        <BoardFormUpdate
          boardId={boardId}
          onUpdateSuccessAction={() => setShowEditForm(false)}
          closeFormAction={() => setShowEditForm(false)}
        />
      )}

      {mounted && error &&
        createPortal(
          <div
            style={{ top: menuPos.top, right: menuPos.right }}
            className="fixed bg-red-50 border border-red-200 rounded-md p-2 text-red-600 text-xs z-9999 whitespace-nowrap"
          >
            {error}
          </div>,
          document.body
        )}
    </div>
  );
}
