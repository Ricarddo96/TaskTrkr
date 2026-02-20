import path from "path";
import fs from "fs/promises";

/**
 * Obtiene todas las imágenes de fondo disponibles para los boards
 */
export async function getBoardBackgrounds(): Promise<string[]> {
  const dir = path.join(process.cwd(), "public", "img", "boards_bg");
  const files = await fs.readdir(dir);
  return files.filter((file) => /\.(png|jpe?g|webp|avif)$/i.test(file));
}

/**
 * Selecciona determinísticamente una imagen de fondo basada en el ID del board.
 * Esto garantiza que el mismo board siempre tenga la misma imagen.
 */
export function pickBackground(id: string, backgrounds: string[]): string | null {
  if (backgrounds.length === 0) return null;
  let hash = 0;
  for (const char of id) {
    hash = (hash * 31 + char.charCodeAt(0)) % 2147483647;
  }
  const index = hash % backgrounds.length;
  return backgrounds[index];
}

