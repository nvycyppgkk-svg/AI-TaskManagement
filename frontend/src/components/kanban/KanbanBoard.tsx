import type { BoardList } from '../../types';
import KanbanColumn from './KanbanColumn';

interface Props {
  lists: BoardList[];
}

export default function KanbanBoard({ lists }: Props) {
  const sorted = [...lists].sort((a, b) => a.position - b.position);

  return (
    <div className="flex gap-4 p-6 overflow-x-auto h-full items-start">
      {sorted.map(list => (
        <KanbanColumn key={list.id} list={list} />
      ))}
    </div>
  );
}
