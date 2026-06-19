import type { BoardList } from '../../types';
import { useKanbanStore, getFilteredCards } from '../../store/kanbanStore';
import KanbanCard from './KanbanCard';

interface Props {
  list: BoardList;
}

export default function KanbanColumn({ list }: Props) {
  const cardsByList = useKanbanStore(s => s.cardsByList);
  const searchQuery = useKanbanStore(s => s.searchQuery);
  const cardsLoading = useKanbanStore(s => s.cardsLoading);

  const allCards = cardsByList[list.id] ?? [];
  const visibleCards = getFilteredCards(allCards, searchQuery);

  return (
    <div className="flex-shrink-0 w-64 bg-[#ebecf0] rounded-xl flex flex-col max-h-full">
      <div className="px-3 pt-3 pb-2 flex items-center justify-between">
        <h3 className="font-semibold text-sm text-gray-700">{list.name}</h3>
        <span className="text-xs text-gray-400 bg-white rounded-full px-2 py-0.5">{visibleCards.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3 flex flex-col gap-2 min-h-[60px]">
        {cardsLoading && allCards.length === 0 ? (
          <div className="h-10 bg-white/60 rounded animate-pulse" />
        ) : visibleCards.length > 0 ? (
          visibleCards.map(card => <KanbanCard key={card.id} card={card} />)
        ) : searchQuery.trim() ? (
          <p className="text-xs text-gray-400 text-center py-4">一致するカードなし</p>
        ) : null}
      </div>
    </div>
  );
}
