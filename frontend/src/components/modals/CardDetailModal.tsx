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
  const removeCard = useKanbanStore(s => s.removeCard);
  const board = useKanbanStore(s => s.board);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(null);
  const [dueDate, setDueDate] = useState('');
  const [listId, setListId] = useState<number | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pickingLabel, setPickingLabel] = useState(false);

  const labels = useKanbanStore(s => s.labels);
  const attachCardLabel = useKanbanStore(s => s.attachCardLabel);
  const detachCardLabel = useKanbanStore(s => s.detachCardLabel);

  useEffect(() => {
    if (selectedCard) {
      setTitle(selectedCard.title);
      setDescription(selectedCard.description ?? '');
      setPriority(selectedCard.priority);
      setDueDate(selectedCard.dueDate ?? '');
      setListId(selectedCard.listId);
      setEditing(false);
      setConfirmingDelete(false);
      setPickingLabel(false);
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

  const handleDelete = async () => {
    setDeleting(true);
    await removeCard(selectedCard.id);
    setDeleting(false);
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

        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">ラベル</p>
          <div className="flex flex-wrap gap-2 items-center">
            {selectedCard.labels.map(label => (
              <span
                key={label.id}
                className="text-xs px-3 py-1 rounded-full text-white font-medium inline-flex items-center gap-1"
                style={{ backgroundColor: label.color }}
              >
                {label.name}
                <button
                  onClick={() => detachCardLabel(selectedCard.id, label.id)}
                  className="text-white/80 hover:text-white leading-none"
                  aria-label={`${label.name}を外す`}
                >
                  ×
                </button>
              </span>
            ))}
            <button
              onClick={() => setPickingLabel(v => !v)}
              className="text-xs px-3 py-1 rounded-full border border-dashed border-brand-blue text-brand-blue hover:bg-blue-50"
            >
              + ラベルを追加
            </button>
          </div>
          {pickingLabel && (
            <div className="mt-2 border border-gray-200 rounded-lg p-2 max-h-40 overflow-y-auto">
              {labels.length === 0 ? (
                <p className="text-xs text-gray-400 px-1 py-1">先にラベル管理から作成してください</p>
              ) : (
                labels.map(label => {
                  const attached = selectedCard.labels.some(l => l.id === label.id);
                  return (
                    <button
                      key={label.id}
                      disabled={attached}
                      onClick={async () => {
                        await attachCardLabel(selectedCard.id, label.id);
                        setPickingLabel(false);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 text-left disabled:opacity-40"
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0"
                        style={{ backgroundColor: label.color }}
                      />
                      <span className="text-sm text-gray-800">{label.name}</span>
                      {attached && <span className="ml-auto text-xs text-gray-400">付与済み</span>}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

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
          ) : confirmingDelete ? (
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmingDelete(false)}
                className="text-sm px-4 py-1.5 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-sm px-4 py-1.5 rounded-md bg-red-600 text-white hover:opacity-90 disabled:opacity-50"
              >
                {deleting ? '削除中...' : '本当に削除する'}
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmingDelete(true)}
                className="text-sm px-4 py-1.5 rounded-md border border-red-200 text-red-600 hover:bg-red-50"
              >
                削除
              </button>
              <button
                onClick={() => setEditing(true)}
                className="text-sm px-4 py-1.5 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                編集
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
