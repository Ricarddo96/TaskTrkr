"use client";
import CardForm from "./CardForm";
import { useState } from "react";

export default function AddCardButton({ listId }: { listId: string }) {
  const [showForm, setShowForm] = useState(false);

  const closeForm = () => setShowForm(false);

  return (
    <>
      {showForm && <CardForm listId={listId} closeFormAction={closeForm} />}
      <button
        onClick={() => setShowForm(true)}
        className="w-full hover:bg-gray-300/80 p-2 rounded flex items-center justify-start text-gray-600 gap-2 transition-all active:scale-98"
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
          className="text-gray-600"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M12 5l0 14" />
          <path d="M5 12l14 0" />
        </svg>
        <span className="text-gray-600">Añadir nueva tarjeta</span>
      </button>
    </>
  );
}
