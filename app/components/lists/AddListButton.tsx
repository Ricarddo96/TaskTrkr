"use client";
import { useState } from "react";
import ListForm from "./ListForm";

export default function AddListButton({ boardId }: { boardId: string }) {
  const [showForm, setShowForm] = useState(false);

  const closeForm = () => setShowForm(false);

  if (showForm) {
    return <ListForm boardId={boardId} closeFormAction={closeForm} />;
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className="w-fit flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-400/50 backdrop-blur-md border border-white/20 text-white hover:bg-gray-500/30 active:scale-97 hover:border-white/40 transition-colors text-center shadow-lg cursor-pointer"
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
        className="text-white"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 5l0 14" />
        <path d="M5 12l14 0" />
      </svg>
      <span className="text-white">Añadir lista</span>
    </button>
  );
}

