import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useKanbanStore } from '../store/kanbanStore';
import Header from '../components/layout/Header';
import KanbanBoard from '../components/kanban/KanbanBoard';
import CardDetailModal from '../components/modals/CardDetailModal';
import LabelManageModal from '../components/modals/LabelManageModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorToast from '../components/ui/ErrorToast';

export default function BoardDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { board, loading, error, loadBoard, clearError, renameCurrentBoard, deleteCurrentBoard } = useKanbanStore();
  const [labelModalOpen, setLabelModalOpen] = useState(false);

  useEffect(() => {
    if (id) loadBoard(Number(id));
  }, [id, loadBoard]);

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col">
      <Header
        showBack
        boardName={board?.name}
        onRenameBoard={board ? renameCurrentBoard : undefined}
        onDeleteBoard={board ? deleteCurrentBoard : undefined}
        onOpenLabels={board ? () => setLabelModalOpen(true) : undefined}
      />
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : board ? (
          <KanbanBoard lists={board.lists} />
        ) : null}
      </div>
      <CardDetailModal />
      {labelModalOpen && <LabelManageModal onClose={() => setLabelModalOpen(false)} />}
      {error && <ErrorToast message={error} onClose={clearError} />}
    </div>
  );
}
