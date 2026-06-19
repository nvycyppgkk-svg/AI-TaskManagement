import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useKanbanStore } from '../store/kanbanStore';
import Header from '../components/layout/Header';
import KanbanBoard from '../components/kanban/KanbanBoard';
import CardDetailModal from '../components/modals/CardDetailModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorToast from '../components/ui/ErrorToast';

export default function BoardDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { board, loading, error, loadBoard, clearError } = useKanbanStore();

  useEffect(() => {
    if (id) loadBoard(Number(id));
  }, [id, loadBoard]);

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col">
      <Header showBack boardName={board?.name} />
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : board ? (
          <KanbanBoard lists={board.lists} />
        ) : null}
      </div>
      <CardDetailModal />
      {error && <ErrorToast message={error} onClose={clearError} />}
    </div>
  );
}
