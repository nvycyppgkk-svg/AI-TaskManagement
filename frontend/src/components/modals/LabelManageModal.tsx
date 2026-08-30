import { useState } from 'react';
import { useKanbanStore } from '../../store/kanbanStore';

interface Props {
  onClose: () => void;
}

export default function LabelManageModal({ onClose }: Props) {
  const labels = useKanbanStore(s => s.labels);
  const addLabel = useKanbanStore(s => s.addLabel);
  const removeLabel = useKanbanStore(s => s.removeLabel);

  const [name, setName] = useState('');
  const [color, setColor] = useState('#4f6ef7');
  const [nameError, setNameError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleCreate = async () => {
    if (!name.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
    setSaving(true);
    await addLabel(name.trim(), color);
    setSaving(false);
    setName('');
    setColor('#4f6ef7');
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    await removeLabel(id);
    setDeletingId(null);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none"
        >
          ×
        </button>
        <h2 className="text-xl font-bold text-gray-800 pr-8 mb-4">ラベル管理</h2>

        <div className="flex flex-col gap-2 mb-6 max-h-64 overflow-y-auto">
          {labels.length === 0 ? (
            <p className="text-sm text-gray-400">ラベルはまだありません</p>
          ) : (
            labels.map(label => (
              <div key={label.id} className="flex items-center gap-3 py-1.5">
                <span
                  className="w-4 h-4 rounded-full shrink-0"
                  style={{ backgroundColor: label.color }}
                />
                <span className="flex-1 text-sm text-gray-800 font-medium">{label.name}</span>
                <button
                  onClick={() => handleDelete(label.id)}
                  disabled={deletingId === label.id}
                  className="text-sm text-gray-400 hover:text-red-600 disabled:opacity-50"
                >
                  {deletingId === label.id ? '削除中...' : '削除'}
                </button>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-wrap items-end gap-3 border-t border-gray-100 pt-4">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs text-gray-500 mb-1">ラベル名</label>
            <input
              value={name}
              onChange={e => {
                setName(e.target.value);
                if (e.target.value.trim()) setNameError(false);
              }}
              onKeyDown={e => { if (e.key === 'Enter') handleCreate(); }}
              placeholder="ラベル名"
              className={`w-full border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-brand-blue ${nameError ? 'border-red-400' : 'border-gray-200'}`}
            />
            {nameError && (
              <p className="text-xs text-red-600 mt-1">ラベル名は必須です</p>
            )}
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">色</label>
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              className="w-10 h-9 p-0 border border-gray-200 rounded cursor-pointer"
            />
          </div>
          <button
            onClick={handleCreate}
            disabled={saving}
            className="text-sm px-4 py-1.5 rounded-md bg-brand-blue text-white hover:opacity-90 disabled:opacity-50"
          >
            {saving ? '追加中...' : '追加'}
          </button>
        </div>
      </div>
    </div>
  );
}
