import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/* ¿por que un endpoint POST para eliminar la cookie?: 
 La cookie es httpOnly, así que el cliente no puede eliminarla.
El servidor debe eliminarla usando cookies().delete(). */

export async function POST() {
  try {
    (await cookies()).delete("token");
    return NextResponse.json({ message: "Logout exitoso" }, { status: 200 });
  } catch (error) {
    console.error("error en el logout", error);
    return NextResponse.json(
      { message: "error en el servidor" },
      { status: 500 }
    );
  }
}
