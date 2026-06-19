import { create } from 'zustand';
import type { BoardSummary } from '../types';
import { fetchBoards } from '../api/boards';

interface BoardStore {
  boards: BoardSummary[];
  loading: boolean;
  error: string | null;
  loadBoards: () => Promise<void>;
}

export const useBoardStore = create<BoardStore>((set) => ({
  boards: [],
  loading: false,
  error: null,
  loadBoards: async () => {
    set({ loading: true, error: null });
    try {
      const boards = await fetchBoards();
      set({ boards, loading: false });
    } catch {
      set({ error: 'ボードの取得に失敗しました', loading: false });
    }
  },
}));
