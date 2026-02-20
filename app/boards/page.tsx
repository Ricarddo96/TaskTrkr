import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BoardsLayout from "../components/boards/BoardsLayout";
import Link from "next/link";
import Image from "next/image";
import { getBoardBackgrounds, pickBackground } from "@/lib/boardBackgrounds";
import AddNewBoard from "../components/boards/AddNewBoard";

export default async function BoardsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    redirect("/login");
  }

  const boardsPromise = prisma.board.findMany({
    where: { ownerId: decoded.userId },
  });

  // Recuperamos las imágenes disponibles en la carpeta pública para
  // asignar una aleatoria a cada tarjeta.
  const [boards, backgrounds] = await Promise.all([
    boardsPromise,
    getBoardBackgrounds(),
  ]);

  return (
    <>
      {/* Video de fondo con loop perfecto */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover -z-10"
        poster="/img/preload/pr-boards-bg.webp"
        style={{ transform: "rotate(360deg)" }}
      >
        <source
          src="/videos/background_loop_perfecto_240f.webm"
          type="video/webm"
        />
      </video>

      {/* Overlay oscuro para mejorar legibilidad */}
      <div className="fixed inset-0 b -z-10 bg-black/10" />

      <BoardsLayout>
        <div className="container mx-auto px-45 py-10">
          <div className="flex justify-between mt-3 mb-3">
            <h1 className="text-3xl font-semibold mb-8 text-white ">Mis Tableros</h1>
            <AddNewBoard />
          </div>
          

          {boards.length === 0 ? (
            <p className="text-white/90">
              No hay boards. Crea uno para empezar.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 [&_a]:aspect-video">
              {boards.map((board) => {
                const bg = pickBackground(board.id, backgrounds);

                return (
                  <Link
                    key={board.id}
                    href={`/boards/${board.id}`}
                    className="group relative z-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-200 ease-out flex flex-col aspect-square overflow-hidden active:scale-97 "
                    style={
                      !bg
                        ? {
                            backgroundColor: "rgba(30,30,30,0.8)",
                            opacity: 0.95,
                          }
                        : undefined
                    }
                  >
                    {bg && (
                      <>
                        <div className="absolute inset-0">
                          <Image
                            src={`/img/boards_bg/${bg}`}
                            alt={`Fondo de ${board.title}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            quality={70}
                            loading="lazy"
                          />
                        </div>
                        <div
                          className="absolute inset-0 bg-linear-to-b from-black/30 to-black/50"
                          aria-hidden
                        />
                      </>
                    )}
                    <div className="flex-1" />
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t  px-6 py-4 flex items-center justify-between">
                      <div className="pr-3">
                        <h3 className="text-xl font-normal text-white mb-1 line-clamp-2">
                          {board.title}
                        </h3>
                        <span className="text-xs text-white/80">
                          {new Date(board.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <svg
                        className="w-5 h-5 text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </BoardsLayout>
    </>
  );
}
