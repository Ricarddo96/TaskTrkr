"use server";
import { getAuthenticatedUser } from "@/lib/authUser";
import { prisma } from "@/lib/prisma";

export async function createList(boardId: string, title: string) {
  try {
    if (!title || title.trim() === "") {
      throw new Error("El título es requerido");
    }
    if (!boardId || boardId.trim() === "") {
      throw new Error("El boardId es requerido");
    }
    const authUser = await getAuthenticatedUser();
    const board = await prisma.board.findUnique({
      where: { id: boardId },
    });
    if (!board) {
      throw new Error("No existe el tablero");
    }
    if (board.ownerId !== authUser.userId) {
      throw new Error("No tienes permiso para crear listas en este tablero");
    }
    const lastOrderList = await prisma.list.findFirst({
      where: { boardId: boardId },
      orderBy: { order: "desc" },
      select: { order: true },
    });
    const newOrder = lastOrderList ? lastOrderList.order + 1 : 0;
    const newList = await prisma.list.create({
      data: { title: title.trim(), boardId: boardId, order: newOrder },
    });
    return newList;
  } catch (error) {
    console.error("Error al crear lista:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error al crear la lista");
  }
}

// de momento solo podemos actualizar el titulo mas adelante actualizaremos todos los campos
export async function updateList(listId: string, title: string) {
  try {
    if (!listId || listId.trim() === "") {
      throw new Error("El listId es requerido");
    }
    if (!title || title.trim() === "") {
      throw new Error("El título es requerido");
    }
    const authUser = await getAuthenticatedUser();
    const list = await prisma.list.findUnique({
      where: { id: listId },
      include: { board: true },
    });
    if (!list) {
      throw new Error("No se ha encontrado esta lista");
    }
    if (list.board.ownerId !== authUser.userId) {
      throw new Error(
        "No tienes permiso para actualizar listas en este tablero"
      );
    }
    const updatedList = await prisma.list.update({
      where: { id: listId },
      data: { title: title.trim() },
    });
    return updatedList;
  } catch (error) {
    console.error("Error al actualizar la lista:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error al actualizar la lista");
  }
}

export async function deleteList(listId: string) {
  try {
    if (!listId || listId.trim() === "") {
      throw new Error("El listId es requerido");
    }
    const authUser = await getAuthenticatedUser();
    const list = await prisma.list.findUnique({
      where: { id: listId },
      include: { board: true },
    });
    if (!list) {
      throw new Error("No se ha encontrado esta lista");
    }
    if (list.board.ownerId !== authUser.userId) {
      throw new Error("No tienes permiso para borrar listas en este tablero");
    }
    const deletedList = await prisma.list.delete({
      where: { id: listId },
    });
    return deletedList;
  } catch (error) {
    console.error("Error al borrar la lista:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error al borrar la lista");
  }
}

export async function reorderList(
  boardId: string,
  listId: string,
  newIndex: number,
  oldIndex: number
) {
  try {
    // CAMBIO: validaciones más estrictas y consistentes.
    // - Antes solo comprobabas `=== -1`; ahora validamos enteros y no-negativos.
    // - Motivo: proteger la acción ante inputs inválidos/desincronizados.
    if (!boardId || !listId) throw new Error("Datos inválidos");
    if (!Number.isInteger(newIndex) || !Number.isInteger(oldIndex)) {
      throw new Error("Datos inválidos");
    }
    if (newIndex < 0 || oldIndex < 0) throw new Error("Datos inválidos");

    const authUser = await getAuthenticatedUser();

    // CAMBIO: mantenemos la seguridad por owner (esto lo hiciste bien),
    // y además seleccionamos solo lo necesario.
    const listToMove = await prisma.list.findFirst({
      where: {
        id: listId,
        boardId,
        board: { ownerId: authUser.userId },
      },
      select: { id: true, order: true },
    });

    if (!listToMove) throw new Error("Acceso denegado o lista no encontrada");

    // CAMBIO: no confiamos en `oldIndex` del cliente como fuente de verdad.
    // Motivo: el orden real y consistente lo da la DB.
    const oldOrder = listToMove.order;

    return await prisma.$transaction(async (tx) => {
      // CAMBIO: acotar `newIndex` al rango real del board.
      // Motivo: evitar órdenes fuera de rango (race conditions / UI desfasada).
      const totalLists = await tx.list.count({ where: { boardId } });
      if (totalLists <= 0) return { success: true };

      const clampedNewIndex = Math.max(0, Math.min(newIndex, totalLists - 1));

      // CAMBIO: early-return si no cambia de posición.
      if (clampedNewIndex === oldOrder) return { success: true };

      if (oldOrder < clampedNewIndex) {
        // CAMBIO: mover a la derecha => las listas entre medias bajan 1 (decrement).
        // Motivo: mantener `order` único y continuo.
        await tx.list.updateMany({
          where: {
            boardId,
            order: { gt: oldOrder, lte: clampedNewIndex },
          },
          data: { order: { decrement: 1 } },
        });
      } else {
        // CAMBIO: mover a la izquierda => las listas entre medias suben 1 (increment).
        await tx.list.updateMany({
          where: {
            boardId,
            order: { gte: clampedNewIndex, lt: oldOrder },
          },
          data: { order: { increment: 1 } },
        });
      }
      // CAMBIO: actualizamos la LISTA movida (antes estabas actualizando `card` por error).
      await tx.list.update({
        where: { id: listId },
        data: { order: clampedNewIndex },
      });

      return { success: true };
    });

  } catch (error) {
    console.error(error);
    throw error;
  }
}
