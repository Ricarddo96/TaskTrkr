"use client";
import { useState } from "react";
import { ListFormUpdate } from "./ListForm";

export default function EditListButton({ listId }: { listId: string }) {
  const [openForm, setOpenForm] = useState(false);
  const [error, setError] = useState("");

  const handleToggleForm = () => {
    setOpenForm(!openForm);
    setError("");
  };

  const handleUpdateSuccess = () => {
    setOpenForm(false);
  };

  return (
    <div>
      <button
        onClick={handleToggleForm}
        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
      >
        {openForm ? "✖️" : "✏️ Editar"}
      </button>
      {openForm && (
        <ListFormUpdate
          listId={listId}
          onUpdateSuccessAction={handleUpdateSuccess}
          closeFormAction={() => setOpenForm(false)}
        />
      )}
      {error && (
        <div className="text-red-500 text-xs mt-1" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
