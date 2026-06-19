import { useEffect } from 'react';
import { useKanbanStore } from '../../store/kanbanStore';

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

export default function CardDetailModal() {
  const selectedCard = useKanbanStore(s => s.selectedCard);
  const closeCardDetail = useKanbanStore(s => s.closeCardDetail);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCardDetail();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [closeCardDetail]);

  if (!selectedCard) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
      onClick={closeCardDetail}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={closeCardDetail}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none"
        >
          ×
        </button>

        <h2 className="text-xl font-bold text-gray-800 pr-8 mb-4">{selectedCard.title}</h2>

        <div className="flex flex-wrap gap-2 mb-4">
          {selectedCard.priority && (
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${priorityStyles[selectedCard.priority]}`}>
              優先度: {priorityLabel[selectedCard.priority]}
            </span>
          )}
          {selectedCard.dueDate && (
            <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
              📅 期限: {selectedCard.dueDate}
            </span>
          )}
        </div>

        {selectedCard.labels.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedCard.labels.map(label => (
              <span
                key={label.id}
                className="text-xs px-3 py-1 rounded-full text-white font-medium"
                style={{ backgroundColor: label.color }}
              >
                {label.name}
              </span>
            ))}
          </div>
        )}

        {selectedCard.description ? (
          <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
            {selectedCard.description}
          </p>
        ) : (
          <p className="text-sm text-gray-400 italic">説明なし</p>
        )}

        <p className="text-xs text-gray-300 mt-6">
          作成: {new Date(selectedCard.createdAt).toLocaleString('ja-JP')}
        </p>
      </div>
    </div>
  );
}
