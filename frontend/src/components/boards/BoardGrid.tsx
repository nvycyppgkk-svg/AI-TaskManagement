import { useState } from 'react';
import type { BoardSummary } from '../../types';
import BoardCard from './BoardCard';

interface Props {
  boards: BoardSummary[];
  onAdd: (name: string) => Promise<void>;
  onRename: (id: number, name: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function BoardGrid({ boards, onAdd, onRename, onDelete }: Props) {
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    await onAdd(newName.trim());
    setSaving(false);
    setNewName('');
    setCreating(false);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
      {boards.map(board => (
        <BoardCard key={board.id} board={board} onRename={onRename} onDelete={onDelete} />
      ))}

      {creating ? (
        <div className="bg-white rounded-xl p-4 shadow-md flex flex-col gap-2">
          <input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setCreating(false); }}
            placeholder="ボード名を入力"
            className="border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-brand-blue"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setCreating(false)}
              className="flex-1 text-sm px-3 py-1 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              onClick={handleCreate}
              disabled={saving || !newName.trim()}
              className="flex-1 text-sm px-3 py-1 rounded-md bg-brand-blue text-white hover:opacity-90 disabled:opacity-50"
            >
              {saving ? '作成中...' : '作成'}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="bg-white/70 hover:bg-white border-2 border-dashed border-gray-300 hover:border-brand-blue text-gray-400 hover:text-brand-blue rounded-xl p-5 text-left transition w-full"
        >
          <p className="font-semibold text-lg">+ 新しいボード</p>
        </button>
      )}
    </div>
  );
}
