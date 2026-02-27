import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

async function getAuthorizedBoard(boardId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { error: "Token no proporcionado", status: 401 };
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return { error: "Token inválido o expirado", status: 401 };
  }

  const board = await prisma.board.findUnique({ where: { id: boardId } });

  if (!board) {
    return { error: "Tablero no encontrado", status: 404 };
  }

  if (board.ownerId !== decoded.userId) {
    return { error: "No tienes permiso para modificar este tablero", status: 403 };
  }

  return { board, userId: decoded.userId };
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await getAuthorizedBoard(id);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    const body = await request.json();
    const { title } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "El título es requerido" }, { status: 400 });
    }

    const updatedBoard = await prisma.board.update({
      where: { id },
      data: { title: title.trim() },
    });

    return NextResponse.json(updatedBoard, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar board:", error);
    return NextResponse.json({ error: "Error al actualizar el tablero" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await getAuthorizedBoard(id);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    await prisma.board.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error al borrar board:", error);
    return NextResponse.json({ error: "Error al borrar el tablero" }, { status: 500 });
  }
}
