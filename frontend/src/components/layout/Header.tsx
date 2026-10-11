import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../ui/SearchBar';

interface Props {
  showBack?: boolean;
  boardName?: string;
  onRenameBoard?: (name: string) => Promise<void>;
  onDeleteBoard?: () => Promise<void>;
  onOpenLabels?: () => void;
}

export default function Header({ showBack, boardName, onRenameBoard, onDeleteBoard, onOpenLabels }: Props) {
  const navigate = useNavigate();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const startEdit = () => {
    setNameInput(boardName ?? '');
    setEditingName(true);
  };

  const handleRename = async () => {
    if (!nameInput.trim() || !onRenameBoard) {
      setEditingName(false);
      return;
    }
    setSaving(true);
    await onRenameBoard(nameInput.trim());
    setSaving(false);
    setEditingName(false);
  };

  const handleDelete = async () => {
    if (!onDeleteBoard) return;
    setDeleting(true);
    await onDeleteBoard();
    setDeleting(false);
    navigate('/boards');
  };

  return (
    <header className="bg-brand-dark text-white px-6 py-3 flex items-center gap-4 sticky top-0 z-30 shadow-md">
      {showBack && (
        <button
          onClick={() => navigate('/boards')}
          className="text-white/70 hover:text-white text-sm flex items-center gap-1 transition shrink-0"
        >
          ← ボード一覧
        </button>
      )}

      {editingName ? (
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <input
            autoFocus
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setEditingName(false); }}
            className="bg-white/10 border border-white/30 rounded px-2 py-0.5 text-white text-lg font-bold focus:outline-none focus:border-white/60 min-w-0 flex-1"
          />
          <button
            onClick={() => setEditingName(false)}
            className="text-white/60 hover:text-white text-sm shrink-0"
          >
            キャンセル
          </button>
          <button
            onClick={handleRename}
            disabled={saving || !nameInput.trim()}
            className="bg-white/20 hover:bg-white/30 text-white text-sm px-3 py-0.5 rounded disabled:opacity-50 shrink-0"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      ) : confirmingDelete ? (
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-sm text-white/80">このボードを削除しますか？</span>
          <button
            onClick={() => setConfirmingDelete(false)}
            className="text-white/60 hover:text-white text-sm shrink-0"
          >
            キャンセル
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-0.5 rounded disabled:opacity-50 shrink-0"
          >
            {deleting ? '削除中...' : '削除する'}
          </button>
        </div>
      ) : (
        <>
          <span className="font-bold text-lg flex-1 truncate min-w-0">
            {boardName ?? 'タスク管理アプリ'}
          </span>
          {showBack && onOpenLabels && (
            <button
              onClick={onOpenLabels}
              className="text-white/60 hover:text-white text-sm shrink-0 transition"
            >
              ラベル管理
            </button>
          )}
          {showBack && onRenameBoard && (
            <button
              onClick={startEdit}
              className="text-white/60 hover:text-white text-sm shrink-0 transition"
            >
              名前変更
            </button>
          )}
          {showBack && onDeleteBoard && (
            <button
              onClick={() => setConfirmingDelete(true)}
              className="text-white/60 hover:text-red-300 text-sm shrink-0 transition"
            >
              削除
            </button>
          )}
        </>
      )}

      {showBack && !editingName && !confirmingDelete && <SearchBar />}
    </header>
  );
}
