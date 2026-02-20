"use client";
import { useSortable } from "@dnd-kit/sortable";
import CardMenu from "./CardMenu";
import type { CSSProperties } from "react";
import { memo } from "react";

interface DraggableCardProps {
  id: string;
  title: string;
  description?: string | null;
  listId: string;
}

function DraggableCard({
  id,
  title,
  description,
  listId,
}: DraggableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: "Card",
      listId: listId,
    },
  });

  // Estilo sin animaciones - comportamiento instantáneo como Trello
  const style: CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition: undefined, // Sin transiciones - movimiento instantáneo
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 0,
    width: "100%",
    boxSizing: "border-box",
    transformOrigin: "0 0",
    willChange: "transform",
  };
  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-100/60 px-3 py-2 rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer active:cursor-grabbing"
    >
      <div className="flex justify-between items-start mb-1">
        <div className="flex-1 pr-2">
          <div className="font-medium text-gray-800">{title}</div>
          {description && (
            <div className="text-sm text-gray-600 mt-1">{description}</div>
          )}
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <CardMenu
            cardId={id}
            currentTitle={title}
            currentDescription={description}
          />
        </div>
      </div>
    </li>
  );
}

export default memo(DraggableCard);
