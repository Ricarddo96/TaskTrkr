"use client";
import { SidebarProvider, useSidebar } from "@/app/contexts/SidebarContext";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

export function BoardsLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="relative min-h-screen flex">
      <div className="fixed top-0 left-0 right-0 z-20 w-full">
        <Navbar />
      </div>

      <Sidebar />

      <main
        className={`flex-1 pt-16 pb-10 px-8 min-h-screen transition-all duration-300 ease-in-out ${
          isCollapsed ? "ml-12" : "ml-62"
        }`}
      >
        {children}
      </main>
    </div>
  );
}

export default function BoardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <BoardsLayoutClient>{children}</BoardsLayoutClient>
    </SidebarProvider>
  );
}
