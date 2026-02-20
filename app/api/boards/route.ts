import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Token no proporcionado" },
        { status: 401 }
      );
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "token invalido o expirado" },
        { status: 401 }
      );
    }
    const boards = await prisma.board.findMany({
      where: {
        ownerId: decoded.userId,
      },
    });
    return NextResponse.json(boards, { status: 200 });
  } catch (error) {
    console.error("error", error);
    return NextResponse.json(
      { error: "Error al obtener boards" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Token no proporcionado" },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "Token inválido o expirado" },
        { status: 401 }
      );
    }
    const body = await request.json();
    const { title } = body;

    // Validar que el título exista
    if (!title) {
      return NextResponse.json(
        { error: "El título es requerido" },
        { status: 400 }
      );
    }
    // Crear el board con el ID del usuario
    const newBoard = await prisma.board.create({
      data: {
        title: title,
        ownerId: decoded.userId,
      },
    });

    return NextResponse.json(newBoard, { status: 201 });
  } catch (error) {
    console.error("Error al crear board:", error);
    return NextResponse.json(
      { error: "Error al crear el board" },
      { status: 500 }
    );
  }
}
