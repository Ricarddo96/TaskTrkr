"use client";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  closestCenter,
  pointerWithin,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverEvent,
} from "@dnd-kit/core";
import { useRouter } from "next/navigation";
import { reorderCard } from "@/app/actions/cards";
import { reorderList } from "@/app/actions/lists";
import DroppableBoard from "./DroppableBoard";
import { useEffect, useRef, useState } from "react";

export interface BoardWithDragDropProps {
  board: {
    id: string;
    title: string;
    lists: Array<{
      id: string;
      title: string;
      cards: Array<{
        id: string;
        title: string;
        description: string | null;
      }>;
    }>;
  };
}

// Función de detección de colisión fuera del componente
const customCollisionDetection = (
  args: Parameters<typeof closestCenter>[0]
) => {
  const activeType = args.active?.data?.current?.type;

  if (activeType === "List") {
    const filteredArgs = {
      ...args,
      droppableContainers: args.droppableContainers.filter(
        (c) => c.data?.current?.type === "List"
      ),
    };
    return closestCenter(filteredArgs);
  }

  if (activeType === "Card") {
    const filteredArgs = {
      ...args,
      droppableContainers: args.droppableContainers.filter(
        (c) =>
          c.data?.current?.type === "CardDropZone" ||
          c.data?.current?.type === "Card"
      ),
    };
    const pointerHits = pointerWithin(filteredArgs);
    return pointerHits.length > 0 ? pointerHits : closestCenter(filteredArgs);
  }

  return closestCenter(args);
};

export default function BoardWithDragDrop({ board }: BoardWithDragDropProps) {
  const router = useRouter();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 2 },
    })
  );

  type BoardData = BoardWithDragDropProps["board"];

  const [boardData, setBoardData] = useState<BoardData>(board);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const lastCardMoveOpIdRef = useRef(0);

  useEffect(() => {
    setBoardData(board);
  }, [board]);

  const handleCardDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const cardId = active.id as string;
    const overId = over.id as string;
    const sourceListId = active.data.current?.listId;
    const targetListId = over.data.current?.listId || (over.id as string);

    if (!sourceListId || !targetListId) return;
    if (cardId === overId && sourceListId === targetListId) return;

    // Encontrar la card en el estado actual (ya actualizado por handleDragOver si cambió de lista)
    const targetList = boardData.lists.find((list) => list.id === targetListId);
    if (!targetList) return;

    // Calcular el índice final de la card en la lista de destino
    const finalIndex = targetList.cards.findIndex((c) => c.id === cardId);

    // Si cambió de lista, handleDragOver ya actualizó el estado
    // Solo necesitamos persistir al servidor
    if (sourceListId !== targetListId) {
      // Guardar snapshot para rollback
      const opId = ++lastCardMoveOpIdRef.current;
      const snapshot = boardData;

      // Solo persistir al servidor (el estado ya fue actualizado por handleDragOver)
      reorderCard(cardId, targetListId, finalIndex).catch((error) => {
        console.error("Error al mover la tarjeta:", error);
        if (lastCardMoveOpIdRef.current === opId) {
          setBoardData(snapshot);
        }
      });
      return;
    }

    // Si es dentro de la misma lista, calcular el índice y actualizar
    const sourceList = boardData.lists.find((list) => list.id === sourceListId);
    if (!sourceList) return;

    const cardsInTarget = targetList.cards.filter((c) => c.id !== cardId);
    const overCardIndex = cardsInTarget.findIndex((c) => c.id === overId);

    let newIndex: number;

    if (overId === targetListId) {
      newIndex = cardsInTarget.length;
    } else if (overCardIndex !== -1) {
      const isMovingDownSameList =
        sourceList.cards.findIndex((c) => c.id === cardId) < overCardIndex;
      newIndex = isMovingDownSameList ? overCardIndex + 1 : overCardIndex;
    } else {
      newIndex = cardsInTarget.length;
    }

    // Guardar snapshot para rollback
    const opId = ++lastCardMoveOpIdRef.current;
    const snapshot = boardData;

    // Actualización optimista del estado para reordenamiento dentro de la misma lista
    setBoardData((prev) => {
      const lists = prev.lists.map((list) => {
        if (list.id === sourceListId) {
          const cardToMove = list.cards.find((c) => c.id === cardId)!;
          const cardsWithout = list.cards.filter((c) => c.id !== cardId);

          return {
            ...list,
            cards: [
              ...cardsWithout.slice(0, newIndex),
              cardToMove,
              ...cardsWithout.slice(newIndex),
            ],
          };
        }
        return list;
      });

      return { ...prev, lists };
    });

    // Persistir en servidor
    reorderCard(cardId, targetListId, newIndex).catch((error) => {
      console.error("Error al mover la tarjeta:", error);
      if (lastCardMoveOpIdRef.current === opId) {
        setBoardData(snapshot);
      }
    });
  };

  const handleListDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeListId = active.id as string;
    const overListId = over.id as string;

    const activeListIndex = boardData.lists.findIndex(
      (l) => l.id === activeListId
    );
    const overListIndex = boardData.lists.findIndex((l) => l.id === overListId);

    if (
      activeListId === overListId ||
      activeListIndex === -1 ||
      overListIndex === -1
    ) {
      return;
    }

    const previousBoardData = boardData;

    // Reordenamiento inmediato
    const newLists = [...boardData.lists];
    const [removed] = newLists.splice(activeListIndex, 1);
    newLists.splice(overListIndex, 0, removed);
    setBoardData({ ...boardData, lists: newLists });

    // Persistir en servidor
    reorderList(boardData.id, activeListId, overListIndex, activeListIndex)
      .then(() => router.refresh())
      .catch((error) => {
        console.error("Error al mover la lista:", error);
        setBoardData(previousBoardData);
      });
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "List") {
      setActiveListId(event.active.id as string);
    }
    if (event.active.data.current?.type === "Card") {
      setActiveCardId(event.active.id as string);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeType = active.data.current?.type;
    if (activeType !== "Card") return;

    const cardId = active.id as string;
    const overId = over.id as string;
    const sourceListId = active.data.current?.listId as string;
    const targetListId = over.data.current?.listId as string;

    if (!sourceListId || !targetListId) return;

    // Si la card está en la misma lista, no hacemos nada
    // (useSortable maneja el reordenamiento dentro de la misma lista)
    if (sourceListId === targetListId) return;

    // Actualización optimista: mover la card entre listas en tiempo real
    setBoardData((prev) => {
      const sourceList = prev.lists.find((list) => list.id === sourceListId);
      const targetList = prev.lists.find((list) => list.id === targetListId);
      
      if (!sourceList || !targetList) return prev;

      const cardToMove = sourceList.cards.find((c) => c.id === cardId);
      if (!cardToMove) return prev;

      // Verificar si la card ya está en la lista de destino
      const isCardAlreadyInTarget = targetList.cards.some(
        (card) => card.id === cardId
      );

      // Si ya está en la lista destino, no hacer nada
      // (evita actualizaciones innecesarias)
      if (isCardAlreadyInTarget) return prev;

      // Calcular el índice donde insertar la card
      let insertIndex = targetList.cards.length;

      // Si el overId es una card (no el dropzone), calcular posición relativa
      if (overId !== targetListId) {
        const overCardIndex = targetList.cards.findIndex(
          (c) => c.id === overId
        );
        if (overCardIndex !== -1) {
          insertIndex = overCardIndex;
        }
      }

      // Crear las nuevas listas con la card movida
      const newLists = prev.lists.map((list) => {
        // Remover la card de la lista de origen
        if (list.id === sourceListId) {
          return {
            ...list,
            cards: list.cards.filter((c) => c.id !== cardId),
          };
        }
        // Agregar la card en la posición correcta de la lista de destino
        if (list.id === targetListId) {
          const newCards = [...list.cards];
          newCards.splice(insertIndex, 0, cardToMove);
          return {
            ...list,
            cards: newCards,
          };
        }
        return list;
      });

      return { ...prev, lists: newLists };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const dragType = event.active.data.current?.type;

    if (dragType === "Card") {
      handleCardDragEnd(event);
    } else if (dragType === "List") {
      handleListDragEnd(event);
    }
    setActiveListId(null);
    setActiveCardId(null);
  };

  const activeList = activeListId
    ? boardData.lists.find((list) => list.id === activeListId)
    : null;

  const activeCard = activeCardId
    ? boardData.lists
        .flatMap((list) => list.cards)
        .find((card) => card.id === activeCardId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <DroppableBoard board={boardData} />
      <DragOverlay dropAnimation={null}>
        {activeList && (
          <div className="w-[300px] min-w-[300px] bg-white/70 backdrop-blur-lg rounded-lg shadow-2xl flex flex-col rotate-1 opacity-95">
            <div className="flex justify-between items-center p-4 pb-3 border-b border-gray-200 select-none">
              <h3 className="font-semibold text-gray-800 text-lg flex-1 pr-2">
                {activeList.title}
              </h3>
            </div>
            <div className="flex flex-col flex-1 px-4 pt-3 pb-1">
              {activeList.cards.length === 0 ? (
                <div className="text-gray-400 italic text-sm p-2">
                  Sin tarjetas
                </div>
              ) : (
                <ul className="space-y-2">
                  {activeList.cards.slice(0, 3).map((card) => (
                    <li
                      key={card.id}
                      className="bg-gray-100/50 px-3 py-2 rounded shadow-sm"
                    >
                      <div className="font-medium text-gray-800">
                        {card.title}
                      </div>
                    </li>
                  ))}
                  {activeList.cards.length > 3 && (
                    <li className="text-gray-400 text-sm px-3">
                      +{activeList.cards.length - 3} más
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
        )}
        {activeCard && (
          <div className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded shadow-2xl rotate-2 opacity-95 min-w-[280px] max-w-[280px] cursor-grabbing">
            <div className="font-medium text-gray-800">{activeCard.title}</div>
            {activeCard.description && (
              <div className="text-sm text-gray-600 mt-1">
                {activeCard.description}
              </div>
            )}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
