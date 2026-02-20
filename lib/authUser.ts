import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

export async function getAuthenticatedUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      throw new Error("No autenticado");
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      throw new Error("Token inválido");
    }
    
    return decoded;
  }