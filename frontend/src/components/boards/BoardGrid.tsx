import type { BoardSummary } from '../../types';
import BoardCard from './BoardCard';

interface Props {
  boards: BoardSummary[];
}

export default function BoardGrid({ boards }: Props) {
  if (boards.length === 0) {
    return <p className="text-gray-400 text-center py-16">ボードがありません</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
      {boards.map(board => (
        <BoardCard key={board.id} board={board} />
      ))}
    </div>
  );
}
