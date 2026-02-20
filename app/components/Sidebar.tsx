"use client";
import { useSidebar } from "../contexts/SidebarContext";

export default function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed left-4 top-21 z-20 flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-600/20 border active:scale-97 border-none text-white transition-all duration-150"
        aria-label={isCollapsed ? "Abrir panel lateral" : "Cerrar panel lateral"}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 28 28"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 7h18M5 14h18M5 21h18"
          />
        </svg>
      </button>
      
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] z-10 w-64 backdrop-blur-2xl shadow-lg transition-all duration-150 ease-in-out overflow-hidden ${
          isCollapsed ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="p-4 px-4 space-y-4 text-white h-full flex flex-col">
          {/* Aquí puedes añadir el contenido de la sidebar */}
        </div>
      </aside>
    </>
  );
}

