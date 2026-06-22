import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import type { BoardList } from '../../types';
import { useKanbanStore } from '../../store/kanbanStore';
import KanbanColumn from './KanbanColumn';

interface Props {
  lists: BoardList[];
}

export default function KanbanBoard({ lists }: Props) {
  const moveCard = useKanbanStore(s => s.moveCard);
  const sorted = [...lists].sort((a, b) => a.position - b.position);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const cardId = active.data.current?.cardId as number | undefined;
    const targetListId = over.data.current?.listId as number | undefined;
    const targetIndex = over.data.current?.index as number | undefined;
    if (cardId === undefined || targetListId === undefined || targetIndex === undefined) return;

    moveCard(cardId, targetListId, targetIndex);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 p-6 overflow-x-auto h-full items-start">
        {sorted.map(list => (
          <KanbanColumn key={list.id} list={list} />
        ))}
      </div>
    </DndContext>
  );
}
