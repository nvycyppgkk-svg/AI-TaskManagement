import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { BoardList } from '../../types';
import { useKanbanStore, getFilteredCards, sortCards, type SortOrder } from '../../store/kanbanStore';
import KanbanCard from './KanbanCard';

interface Props {
  list: BoardList;
}

const sortOptions: { value: SortOrder; label: string }[] = [
  { value: 'manual', label: '手動順' },
  { value: 'priority', label: '優先度順' },
  { value: 'dueDate', label: '期限順' },
];

export default function KanbanColumn({ list }: Props) {
  const cardsByList = useKanbanStore(s => s.cardsByList);
  const searchQuery = useKanbanStore(s => s.searchQuery);
  const cardsLoading = useKanbanStore(s => s.cardsLoading);
  const addCard = useKanbanStore(s => s.addCard);
  const renameList = useKanbanStore(s => s.renameList);
  const removeList = useKanbanStore(s => s.removeList);

  const [newTitle, setNewTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>('manual');
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(list.name);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [savingName, setSavingName] = useState(false);

  const allCards = cardsByList[list.id] ?? [];
  const visibleCards = sortCards(getFilteredCards(allCards, searchQuery), sortOrder);

  const { setNodeRef: setColumnDropRef, isOver: isOverColumn } = useDroppable({
    id: `column-drop-${list.id}`,
    data: { listId: list.id, index: allCards.length },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title || submitting) return;
    setSubmitting(true);
    await addCard(list.id, title);
    setSubmitting(false);
    setNewTitle('');
  };

  const handleRename = async () => {
    if (!nameInput.trim() || nameInput.trim() === list.name) {
      setEditingName(false);
      setNameInput(list.name);
      return;
    }
    setSavingName(true);
    await renameList(list.id, nameInput.trim());
    setSavingName(false);
    setEditingName(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await removeList(list.id);
    setDeleting(false);
  };

  return (
    <div className="flex-shrink-0 w-64 bg-[#ebecf0] rounded-xl flex flex-col max-h-full">
      <div className="px-3 pt-3 pb-2">
        {editingName ? (
          <div className="flex flex-col gap-1.5">
            <input
              autoFocus
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') { setEditingName(false); setNameInput(list.name); } }}
              className="w-full bg-white rounded px-2 py-1 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
            />
            <div className="flex gap-1">
              <button
                onClick={() => { setEditingName(false); setNameInput(list.name); }}
                className="flex-1 text-xs px-2 py-0.5 rounded border border-gray-300 text-gray-500 hover:bg-gray-200"
              >
                キャンセル
              </button>
              <button
                onClick={handleRename}
                disabled={savingName || !nameInput.trim()}
                className="flex-1 text-xs px-2 py-0.5 rounded bg-brand-blue text-white hover:opacity-90 disabled:opacity-50"
              >
                {savingName ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        ) : confirmingDelete ? (
          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-gray-600">このリストを削除しますか？</p>
            <div className="flex gap-1">
              <button
                onClick={() => setConfirmingDelete(false)}
                className="flex-1 text-xs px-2 py-0.5 rounded border border-gray-300 text-gray-500 hover:bg-gray-200"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 text-xs px-2 py-0.5 rounded bg-red-600 text-white hover:opacity-90 disabled:opacity-50"
              >
                {deleting ? '削除中...' : '削除'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <h3
              className="font-semibold text-sm text-gray-700 truncate cursor-pointer hover:text-brand-blue"
              onClick={() => { setNameInput(list.name); setEditingName(true); }}
              title="クリックで名前を変更"
            >
              {list.name}
            </h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              <select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value as SortOrder)}
                className="text-xs text-gray-500 bg-white rounded-full px-2 py-0.5 border border-gray-200 focus:outline-none"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <span className="text-xs text-gray-400 bg-white rounded-full px-2 py-0.5">{visibleCards.length}</span>
              <button
                onClick={() => setConfirmingDelete(true)}
                title="リストを削除"
                className="text-gray-400 hover:text-red-500 text-xs px-1 transition"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        ref={setColumnDropRef}
        className={`flex-1 overflow-y-auto px-2 pb-3 flex flex-col gap-2 min-h-[60px] rounded-lg transition ${isOverColumn ? 'bg-brand-blue/10' : ''}`}
      >
        {cardsLoading && allCards.length === 0 ? (
          <div className="h-10 bg-white/60 rounded animate-pulse" />
        ) : visibleCards.length > 0 ? (
          visibleCards.map((card, i) => (
            <KanbanCard
              key={card.id}
              card={card}
              listId={list.id}
              index={i}
              dragDisabled={sortOrder !== 'manual'}
            />
          ))
        ) : searchQuery.trim() ? (
          <p className="text-xs text-gray-400 text-center py-4">一致するカードなし</p>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="px-2 pb-3">
        <input
          type="text"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          placeholder="+ カードを追加"
          disabled={submitting}
          className="w-full bg-white rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 disabled:opacity-60"
        />
      </form>
    </div>
  );
}
