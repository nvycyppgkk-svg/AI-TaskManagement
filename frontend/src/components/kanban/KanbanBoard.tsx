import { useState } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import type { BoardList } from '../../types';
import { useKanbanStore } from '../../store/kanbanStore';
import { validateName } from '../../utils/validation';
import KanbanColumn from './KanbanColumn';

interface Props {
  lists: BoardList[];
}

export default function KanbanBoard({ lists }: Props) {
  const moveCard = useKanbanStore(s => s.moveCard);
  const addList = useKanbanStore(s => s.addList);
  const board = useKanbanStore(s => s.board);
  const sorted = [...lists].sort((a, b) => a.position - b.position);

  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  const closeCreate = () => {
    setCreating(false);
    setNewName('');
    setNameError(null);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const cardId = active.data.current?.cardId as number | undefined;
    const targetListId = over.data.current?.listId as number | undefined;
    const targetIndex = over.data.current?.index as number | undefined;
    if (cardId === undefined || targetListId === undefined || targetIndex === undefined) return;

    moveCard(cardId, targetListId, targetIndex);
  };

  const handleAddList = async () => {
    if (!board) return;
    const error = validateName(newName, 'リスト名');
    if (error) {
      setNameError(error);
      return;
    }
    setSaving(true);
    await addList(board.id, newName.trim());
    setSaving(false);
    closeCreate();
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 p-6 overflow-x-auto h-full items-start">
        {sorted.map(list => (
          <KanbanColumn key={list.id} list={list} />
        ))}

        <div className="flex-shrink-0 w-64">
          {creating ? (
            <div className="bg-[#ebecf0] rounded-xl p-3 flex flex-col gap-2">
              <input
                autoFocus
                value={newName}
                onChange={e => { setNewName(e.target.value); setNameError(null); }}
                onKeyDown={e => { if (e.key === 'Enter') handleAddList(); if (e.key === 'Escape') closeCreate(); }}
                placeholder="リスト名を入力"
                aria-invalid={nameError !== null}
                className={`w-full bg-white rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/40 ${nameError ? 'ring-2 ring-red-400' : ''}`}
              />
              {nameError && <p className="text-xs text-red-600 -mt-1">{nameError}</p>}
              <div className="flex gap-2">
                <button
                  onClick={closeCreate}
                  className="flex-1 text-sm px-3 py-1 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-200"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleAddList}
                  disabled={saving}
                  className="flex-1 text-sm px-3 py-1 rounded-md bg-brand-blue text-white hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? '追加中...' : '追加'}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setCreating(true)}
              className="w-full bg-white/50 hover:bg-white/80 text-gray-500 hover:text-gray-700 rounded-xl px-4 py-3 text-sm font-medium transition text-left"
            >
              + リストを追加
            </button>
          )}
        </div>
      </div>
    </DndContext>
  );
}
