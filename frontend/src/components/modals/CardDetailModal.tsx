import { useEffect, useState } from 'react';
import { useKanbanStore } from '../../store/kanbanStore';
import type { Priority } from '../../types';

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
  const editCard = useKanbanStore(s => s.editCard);
  const board = useKanbanStore(s => s.board);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(null);
  const [dueDate, setDueDate] = useState('');
  const [listId, setListId] = useState<number | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selectedCard) {
      setTitle(selectedCard.title);
      setDescription(selectedCard.description ?? '');
      setPriority(selectedCard.priority);
      setDueDate(selectedCard.dueDate ?? '');
      setListId(selectedCard.listId);
      setEditing(false);
    }
  }, [selectedCard]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCardDetail();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [closeCardDetail]);

  if (!selectedCard) return null;

  const handleSave = async () => {
    setSaving(true);
    await editCard(selectedCard.id, {
      title,
      description: description || null,
      priority,
      dueDate: dueDate || null,
      listId,
    });
    setSaving(false);
    setEditing(false);
  };

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

        {editing ? (
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="text-xl font-bold text-gray-800 pr-8 mb-4 w-full border-b border-gray-200 focus:outline-none focus:border-brand-blue"
          />
        ) : (
          <h2 className="text-xl font-bold text-gray-800 pr-8 mb-4">{selectedCard.title}</h2>
        )}

        {editing ? (
          <div className="flex flex-wrap gap-3 mb-4">
            <select
              value={priority ?? ''}
              onChange={e => setPriority((e.target.value || null) as Priority)}
              className="text-xs px-3 py-1 rounded-full border border-gray-200"
            >
              <option value="">優先度なし</option>
              <option value="high">高</option>
              <option value="mid">中</option>
              <option value="low">低</option>
            </select>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="text-xs px-3 py-1 rounded-full border border-gray-200"
            />
            {board && (
              <select
                value={listId ?? ''}
                onChange={e => setListId(Number(e.target.value))}
                className="text-xs px-3 py-1 rounded-full border border-gray-200"
              >
                {board.lists.map(list => (
                  <option key={list.id} value={list.id}>{list.name}</option>
                ))}
              </select>
            )}
          </div>
        ) : (
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
            {board && (
              <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                リスト: {board.lists.find(l => l.id === selectedCard.listId)?.name}
              </span>
            )}
          </div>
        )}

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

        {editing ? (
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            placeholder="説明を入力"
            className="text-sm text-gray-600 w-full border border-gray-200 rounded-md p-2 leading-relaxed focus:outline-none focus:border-brand-blue"
          />
        ) : selectedCard.description ? (
          <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
            {selectedCard.description}
          </p>
        ) : (
          <p className="text-sm text-gray-400 italic">説明なし</p>
        )}

        <div className="flex items-center justify-between mt-6">
          <p className="text-xs text-gray-300">
            作成: {new Date(selectedCard.createdAt).toLocaleString('ja-JP')}
          </p>
          {editing ? (
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(false)}
                className="text-sm px-4 py-1.5 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !title.trim()}
                className="text-sm px-4 py-1.5 rounded-md bg-brand-blue text-white hover:opacity-90 disabled:opacity-50"
              >
                {saving ? '保存中...' : '保存'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="text-sm px-4 py-1.5 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              編集
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
