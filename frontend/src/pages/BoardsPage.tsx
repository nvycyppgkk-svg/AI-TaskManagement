import { useEffect } from 'react';
import { useBoardStore } from '../store/boardStore';
import Header from '../components/layout/Header';
import BoardGrid from '../components/boards/BoardGrid';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorToast from '../components/ui/ErrorToast';

export default function BoardsPage() {
  const { boards, loading, error, loadBoards } = useBoardStore();

  useEffect(() => {
    loadBoards();
  }, [loadBoards]);

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Header />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <BoardGrid boards={boards} />
      )}
      {error && (
        <ErrorToast message={error} onClose={() => useBoardStore.setState({ error: null })} />
      )}
    </div>
  );
}
