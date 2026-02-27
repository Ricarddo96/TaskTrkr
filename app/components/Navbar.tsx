"use client";

import { logout } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import { useSidebarOptional } from "@/app/contexts/SidebarContext";

export default function Navbar() {
  const sidebar = useSidebarOptional();

  return (
    <nav className="backdrop-blur-sm text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          {sidebar && (
            <button
              onClick={sidebar.toggleSidebar}
              className="md:hidden flex items-center justify-center w-11 h-11 -ml-1 rounded-full hover:bg-white/10 active:scale-95 text-white transition-all duration-150"
              aria-label={sidebar.isCollapsed ? "Abrir panel lateral" : "Cerrar panel lateral"}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 28 28">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 7h18M5 14h18M5 21h18" />
              </svg>
            </button>
          )}
          <Link href="/boards" className="text-xl font-bold hover:opacity-80 active:scale-97">
            TaskTrkr
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={logout}
            className="p-2 rounded transition-transform duration-150 ease-in-out active:scale-95 cursor-pointer"
            aria-label="Cerrar sesión"
          >
            <Image
              src="/icons/salida.png"
              alt="Cerrar sesión"
              width={20}
              height={20}
              className="filter brightness-0 invert hover:opacity-80 transition-opacity"
            />
          </button>
        </div>
      </div>
    </nav>
  );
}