"use server";
import { getAuthenticatedUser } from "@/lib/authUser";
import { prisma } from "@/lib/prisma";

export async function createCard(
  listId: string,
  title?: string,
  description?: string
) {
  try {
    if (!title || title.trim() === "") {
      throw new Error("El título es requerido");
    }
    if (!listId || listId.trim() === "") {
      throw new Error("El listId es requerido");
    }
    const authUser = await getAuthenticatedUser();
    const list = await prisma.list.findUnique({
      where: { id: listId },
      include: { board: true },
    });
    if (!list) {
      throw new Error("No existe la lista");
    }
    if (list.board.ownerId !== authUser.userId) {
      throw new Error("No tienes permiso para crear tarjetas en este tablero");
    }
    const lastOrderCard = await prisma.card.findFirst({
      where: { listId: listId },
      orderBy: { order: "desc" },
      select: { order: true },
    });
    const newOrder = lastOrderCard ? lastOrderCard.order + 1 : 0;
    const newCard = await prisma.card.create({
      data: {
        title: title.trim(),
        listId: listId,
        order: newOrder,
        description: description,
      },
    });
    return newCard;
  } catch (error) {
    console.error("Error al crear carta:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error al crear la carta");
  }
}

export async function updateCard(
  cardId: string,
  title?: string,
  description?: string
) {
  try {
    if (!cardId || cardId.trim() === "") {
      throw new Error("El cardId es requerido");
    }
    
    const authUser = await getAuthenticatedUser();
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: {
        list: {
          include: { board: true },
        },
      },
    });
    
    if (!card) {
      throw new Error("No se ha encontrado esta tarjeta");
    }
    
    if (card.list.board.ownerId !== authUser.userId) {
      throw new Error(
        "No tienes permiso para actualizar tarjetas en este tablero"
      );
    }
    // Construir objeto de actualización solo con los campos que se quieren cambiar
    const updateData: { title?: string; description?: string } = {};
    
    // Si title está definido (no undefined), validar y actualizar
    if (title !== undefined) {
      if (title.trim() === "") {
        throw new Error("El título no puede estar vacío");
      }
      updateData.title = title.trim();
    }
    // Si description está definido (no undefined), actualizar (puede ser vacío para limpiar)
    if (description !== undefined) {
      updateData.description = description.trim() || undefined;
    }
    // Solo actualizar si hay algo que cambiar
    if (Object.keys(updateData).length === 0) {
      return card; // No hay cambios, retornar la card original
    }
    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: updateData,
    });
    return updatedCard;
  } catch (error) {
    console.error("Error al actualizar la tarjeta:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error al actualizar la tarjeta");
  }
}

export async function deleteCard(cardId: string) {
  try {
    if (!cardId || cardId.trim() === "") {
      throw new Error("El cardId es requerido");
    }
    const authUser = await getAuthenticatedUser();
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: {
        list: {
          include: { board: true },
        },
      },
    });
    if (!card) {
      throw new Error("No se ha encontrado esta tarjeta");
    }
    if (card.list.board.ownerId !== authUser.userId) {
      throw new Error("No tienes permiso para borrar tarjetas en este tablero");
    }
    const deletedCard = await prisma.card.delete({
      where: { id: cardId },
    });
    return deletedCard;
  } catch (error) {
    console.error("Error al borrar la tarjeta:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error al borrar la tarjeta");
  }
}

export async function reorderCard(cardId: string, newListId: string, newIndex: number) {
  try {
    // 1. Validaciones básicas
    if (!cardId || !newListId || newIndex < 0) throw new Error("Datos inválidos");

    const authUser = await getAuthenticatedUser();

    // 2. Comprobar seguridad y obtener datos en un solo paso
    const cardToMove = await prisma.card.findFirst({
      where: { 
        id: cardId,
        list: { board: { ownerId: authUser.userId } } 
      },
    });

    if (!cardToMove) throw new Error("Acceso denegado o tarjeta no encontrada");

    const isMovingToDifferentList = cardToMove.listId !== newListId;

    return await prisma.$transaction(async (tx) => {
      if (isMovingToDifferentList) {
        // A. Hueco en la lista origen: Restar 1 a las que estaban por debajo
        await tx.card.updateMany({
          where: { listId: cardToMove.listId, order: { gt: cardToMove.order } },
          data: { order: { decrement: 1 } },
        });

        // B. Espacio en lista destino: Sumar 1 a las que están por debajo del nuevo índice
        await tx.card.updateMany({
          where: { listId: newListId, order: { gte: newIndex } },
          data: { order: { increment: 1 } },
        });
      } else {
        // C. Mover dentro de la misma lista (Lógica de desplazamiento)
        if (cardToMove.order < newIndex) {
          await tx.card.updateMany({
            where: { listId: newListId, order: { gt: cardToMove.order, lte: newIndex } },
            data: { order: { decrement: 1 } },
          });
        } else if (cardToMove.order > newIndex) {
          await tx.card.updateMany({
            where: { listId: newListId, order: { gte: newIndex, lt: cardToMove.order } },
            data: { order: { increment: 1 } },
          });
        }
      }
      // 3. Finalmente, mover la tarjeta a su sitio
      await tx.card.update({
        where: { id: cardId },
        data: { listId: newListId, order: newIndex },
      });

      return { success: true };
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}