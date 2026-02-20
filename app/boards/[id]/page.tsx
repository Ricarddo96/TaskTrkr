import { redirect } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/authUser";
import AddListButton from "@/app/components/lists/AddListButton";
import Navbar from "@/app/components/Navbar";
import { getBoardBackgrounds, pickBackground } from "@/lib/boardBackgrounds";
import BoardWithDragDrop from "@/app/components/boards/BoardWithDragDrop";

export default async function BoardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const authUser = await getAuthenticatedUser();
  if (!authUser) {
    redirect("/login");
  }
  const board = await prisma.board.findUnique({
    where: { id },
    include: {
      lists: {
        orderBy: { order: "asc" },
        include: {
          cards: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });
  if (!board || board.ownerId !== authUser.userId) {
    redirect("/boards");
  }

  const backgrounds = await getBoardBackgrounds();
  const bg = pickBackground(board.id, backgrounds);

  const bgUrl = bg ? `/img/boards_bg/${bg}` : null;

  return (
    <div
      className="min-h-screen relative"
      style={
        !bg ? { backgroundColor: "rgba(30,30,30,0.8)" } : undefined
      }
    >
      {bgUrl && (
        <div className="fixed inset-0 -z-10">
          <Image
            src={bgUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            quality={75}
            className="object-cover"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMzMzIi8+PC9zdmc+"
          />
          <div
            className="absolute inset-0 bg-linear-to-b from-black/20 to-black/40"
            aria-hidden
          />
        </div>
      )}
      <div className="fixed top-17 left-0 right-0 h-30 bg-linear-to-b from-gray-600/30  to-transparent pointer-events-none z-5"></div>
      <div className="fixed top-0 left-0 right-0 z-20 w-full">
        <Navbar />
      </div>
      <div className="container mx-auto px-6 py-23 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-white">{board.title}</h1>
          <AddListButton boardId={board.id} />
        </div>
        <BoardWithDragDrop board={board} />
      </div>
    </div>
  );
}
