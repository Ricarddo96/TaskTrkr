"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteList } from "../../actions/lists";

export default function DeleteListButton({ listId }: { listId: string }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres borrar esta lista?")) {
      return;
    }

    setDeleting(true);
    setError("");
    try {
      await deleteList(listId);
      router.refresh();
    } catch (error) {
      console.error("Error al borrar", error);
      setError("Error al borrar la lista");
      setDeleting(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
      >
        {deleting ? "Borrando..." : "🗑️"}
      </button>
      {error && (
        <div className="text-red-500 text-xs mt-1" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
