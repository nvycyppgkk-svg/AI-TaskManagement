import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BoardSummary } from '../../types';

interface Props {
  board: BoardSummary;
  onRename: (id: number, name: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function BoardCard({ board, onRename, onDelete }: Props) {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(board.name);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleRename = async () => {
    if (!editName.trim() || editName.trim() === board.name) {
      setEditing(false);
      setEditName(board.name);
      return;
    }
    setSaving(true);
    await onRename(board.id, editName.trim());
    setSaving(false);
    setEditing(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(board.id);
    setDeleting(false);
  };

  if (editing) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-md flex flex-col gap-2">
        <input
          autoFocus
          value={editName}
          onChange={e => setEditName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') { setEditing(false); setEditName(board.name); } }}
          className="border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-brand-blue"
        />
        <div className="flex gap-2">
          <button
            onClick={() => { setEditing(false); setEditName(board.name); }}
            className="flex-1 text-sm px-3 py-1 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            onClick={handleRename}
            disabled={saving || !editName.trim()}
            className="flex-1 text-sm px-3 py-1 rounded-md bg-brand-blue text-white hover:opacity-90 disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    );
  }

  if (confirmingDelete) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-md flex flex-col gap-2">
        <p className="text-sm text-gray-700 font-medium">「{board.name}」を削除しますか？</p>
        <p className="text-xs text-gray-400">このボードのカードもすべて削除されます。</p>
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => setConfirmingDelete(false)}
            className="flex-1 text-sm px-3 py-1 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 text-sm px-3 py-1 rounded-md bg-red-600 text-white hover:opacity-90 disabled:opacity-50"
          >
            {deleting ? '削除中...' : '削除する'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative">
      <button
        onClick={() => navigate(`/boards/${board.id}`)}
        className="bg-brand-blue hover:bg-brand-hover text-white rounded-xl p-5 text-left transition shadow-md w-full"
      >
        <p className="font-semibold text-lg truncate pr-8">{board.name}</p>
        <p className="text-white/60 text-xs mt-2">
          更新: {new Date(board.updatedAt).toLocaleDateString('ja-JP')}
        </p>
      </button>
      <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
        <button
          onClick={e => { e.stopPropagation(); setEditName(board.name); setEditing(true); }}
          title="名前を変更"
          className="bg-white/20 hover:bg-white/30 text-white rounded px-2 py-0.5 text-xs transition"
        >
          編集
        </button>
        <button
          onClick={e => { e.stopPropagation(); setConfirmingDelete(true); }}
          title="削除"
          className="bg-white/20 hover:bg-red-500 text-white rounded px-2 py-0.5 text-xs transition"
        >
          削除
        </button>
      </div>
    </div>
  );
}
