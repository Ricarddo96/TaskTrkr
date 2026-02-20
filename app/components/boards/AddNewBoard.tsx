"use client";
import BoardForm from "./BoardForm";
import { useState } from "react";

export default function AddNewBoard() {
  const [openForm, setOpenForm] = useState(false);

  const handleClick = () => setOpenForm(true);
  const closeForm = () => setOpenForm(false);
  return (
    <div className="space-y-3">
      <button 
        type="button"
        onClick={handleClick}
        className="w-fit flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-gray-500/30 active:scale-97 hover:border-white/40 transition-colors text-center shadow-lg cursor-pointer">
        <span className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 inline-block"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Crear Tablero
        </span>
      </button>
      {openForm && <BoardForm closeFormAction={closeForm}/>}
    </div>
  );
}
