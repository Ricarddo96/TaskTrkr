import DroppableList from "./DroppableList";
import ListMenu from "./ListMenu";
import { useSortable } from "@dnd-kit/sortable";
import type { CSSProperties } from "react";

interface DraggableListProps {
  id: string;
  title: string;
  cards: Array<{
    id: string;
    title: string;
    description: string | null;
  }>;
}

export default function DraggableList(list: DraggableListProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id: list.id,
      data: {
        type: "List",
        listId: list.id,
      },
    });

  const style: CSSProperties = {
    // Cuando se arrastra, el elemento original permanece invisible
    // El DragOverlay se encarga de seguir el cursor
    // El reordenamiento se hace de forma síncrona para que aparezca instantáneamente al soltar
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition: "none", // Sin transiciones - movimiento instantáneo
    opacity: isDragging ? 0.2 : 1, // Invisible durante el drag
    pointerEvents: isDragging ? "none" : "auto",
    zIndex: isDragging ? 0 : 0,
    transformOrigin: "0 0",
    willChange: "transform",
    
  };

  return (
    <div
      key={list.id}
      className="w-[300px] min-w-[300px] bg-white/80 backdrop-blur-lg rounded-lg shadow-lg flex flex-col"
      ref={setNodeRef}
      style={style}
      {...attributes}
      data-dragging={isDragging ? "true" : "false"}
    >
      <div
        className="flex justify-between items-center p-4 pb-3 border-b border-gray-200 cursor-grab active:cursor-grabbing select-none"
        {...listeners}
      >
        <h3 className="font-semibold text-gray-800 text-lg flex-1 pr-2">
          {list.title}
        </h3>
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <ListMenu listId={list.id} />
        </div>
      </div>
      <DroppableList
        key={list.id}
        listId={list.id}
        cards={list.cards}
      />
    </div>
  );
}
