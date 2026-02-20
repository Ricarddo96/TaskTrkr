"use client";

import { logout } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="backdrop-blur-sm text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/boards" className="text-xl font-bold hover:opacity-80 active:scale-97">
          TaskTrkr
        </Link>
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
              className="filter brightness-0 invert hover:opacity-80  transition-opacity"
            />
          </button>
        </div>
      </div>
    </nav>
  );
}