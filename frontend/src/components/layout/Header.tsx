import { useNavigate } from 'react-router-dom';
import SearchBar from '../ui/SearchBar';

interface Props {
  showBack?: boolean;
  boardName?: string;
}

export default function Header({ showBack, boardName }: Props) {
  const navigate = useNavigate();

  return (
    <header className="bg-brand-dark text-white px-6 py-3 flex items-center gap-4 sticky top-0 z-30 shadow-md">
      {showBack && (
        <button
          onClick={() => navigate('/boards')}
          className="text-white/70 hover:text-white text-sm flex items-center gap-1 transition"
        >
          ← ボード一覧
        </button>
      )}
      <span className="font-bold text-lg flex-1 truncate">
        {boardName ?? 'タスク管理アプリ'}
      </span>
      {showBack && <SearchBar />}
    </header>
  );
}
