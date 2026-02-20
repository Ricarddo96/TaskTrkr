import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const newUser = await request.json();
    const { email, password } = newUser;
    const isEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (isEmail) {
      return NextResponse.json(
        { message: "El email ya está registrado." },
        { status: 409 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });
    
    return NextResponse.json(
      { message: "Usuario creado con éxito" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al procesar la solicitud POST:", error);
    return NextResponse.json(
      { message: "Ocurrió un error en el servidor." },
      { status: 500 }
    );
  }
}

