import type { CardSummary } from '../../types';
import { useKanbanStore } from '../../store/kanbanStore';

interface Props {
  card: CardSummary;
}

const priorityStyles: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  mid:  'bg-yellow-100 text-yellow-800',
  low:  'bg-blue-100 text-blue-700',
};

const priorityLabel: Record<string, string> = {
  high: '高',
  mid:  '中',
  low:  '低',
};

export default function KanbanCard({ card }: Props) {
  const openCardDetail = useKanbanStore(s => s.openCardDetail);

  return (
    <button
      onClick={() => openCardDetail(card.id)}
      className="w-full bg-white rounded-lg p-3 text-left shadow-sm hover:shadow-md transition cursor-pointer border border-transparent hover:border-brand-blue/30"
    >
      <p className="text-sm text-gray-800 font-medium leading-snug">{card.title}</p>
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        {card.priority && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityStyles[card.priority]}`}>
            {priorityLabel[card.priority]}
          </span>
        )}
        {card.dueDate && (
          <span className="text-xs text-gray-400 flex items-center gap-1">
            📅 {card.dueDate}
          </span>
        )}
      </div>
    </button>
  );
}
