"use client";
import { useState } from "react";
import { CardFormUpdate } from "./CardForm";

export default function UpdateCardButton({ 
  cardId, 
  currentTitle, 
  currentDescription 
}: { 
  cardId: string;
  currentTitle: string;
  currentDescription?: string | null;
}) {
  const [openForm, setOpenForm] = useState(false);
  const [error, setError] = useState("");

  const handleToggleForm = () => {
    setOpenForm(!openForm);
    setError("");
  };
  const handleToggleSuccess = () => {
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
        <CardFormUpdate
          cardId={cardId}
          currentTitle={currentTitle}
          currentDescription={currentDescription}
          onUpdateSuccessAction={handleToggleSuccess}
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
