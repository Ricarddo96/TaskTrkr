"use client";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DraggableCard from "@/app/components/cards/DraggableCard";
import AddCardButton from "@/app/components/cards/AddCardButton";

interface DroppableListProps {
  listId: string;
  cards: Array<{
    id: string;
    title: string;
    description: string | null;
  }>;
}

export default function DroppableList({ listId, cards }: DroppableListProps) {
  const { setNodeRef } = useDroppable({
    id: `cards-${listId}`,
    data: {
      type: "CardDropZone",
      listId: listId,
    },
  });

  return (
    <div ref={setNodeRef} className="flex flex-col flex-1">
      <div className="px-4 pt-3 pb-1">
        {cards.length === 0 ? (
          <div className="text-gray-400 italic text-sm p-2">Sin tarjetas</div>
        ) : (
          <SortableContext
            items={cards.map((card) => card.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-2">
              {cards.map((card) => (
                <DraggableCard
                  key={card.id}
                  id={card.id}
                  title={card.title}
                  description={card.description}
                  listId={listId}
                />
              ))}
            </ul>
          </SortableContext>
        )}
      </div>

      <div className="px-4 pt-2 pb-3">
        <AddCardButton listId={listId} />
      </div>
    </div>
  );
}