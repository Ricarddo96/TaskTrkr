"use client";
import { BoardWithDragDropProps } from "./BoardWithDragDrop";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import DraggableList from "../lists/DraggableList";
import { memo, useMemo } from "react";

function DroppableBoard({ board }: BoardWithDragDropProps) {
  // Memoizar el array de IDs para evitar recreaciones innecesarias
  const listIds = useMemo(
    () => board.lists.map((list) => list.id),
    [board.lists]
  );

  return (
    <SortableContext items={listIds} strategy={horizontalListSortingStrategy}>
      {board.lists.length === 0 ? (
        <div className="text-white bg-white/10 p-4 rounded-lg backdrop-blur-sm border-dashed border-white/20">
          No hay listas en este tablero. Empieza creando una.
        </div>
      ) : (
        <div className="flex space-x-4 overflow-x-auto items-start p-2 min-h-[calc(100vh-100px)]">
          {board.lists.map((list) => (
            <DraggableList key={list.id} {...list} />
          ))}
        </div>
      )}
    </SortableContext>
  );
}

export default memo(DroppableBoard);
