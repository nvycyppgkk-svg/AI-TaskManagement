import { useNavigate } from 'react-router-dom';
import type { BoardSummary } from '../../types';

interface Props {
  board: BoardSummary;
}

export default function BoardCard({ board }: Props) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/boards/${board.id}`)}
      className="bg-brand-blue hover:bg-brand-hover text-white rounded-xl p-5 text-left transition shadow-md w-full"
    >
      <p className="font-semibold text-lg truncate">{board.name}</p>
      <p className="text-white/60 text-xs mt-2">
        更新: {new Date(board.updatedAt).toLocaleDateString('ja-JP')}
      </p>
    </button>
  );
}
