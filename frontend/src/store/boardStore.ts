import { create } from 'zustand';
import type { BoardSummary } from '../types';
import { fetchBoards, createBoard, updateBoard, deleteBoard } from '../api/boards';

interface BoardStore {
  boards: BoardSummary[];
  loading: boolean;
  error: string | null;
  loadBoards: () => Promise<void>;
  addBoard: (name: string) => Promise<void>;
  renameBoard: (id: number, name: string) => Promise<void>;
  removeBoard: (id: number) => Promise<void>;
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

  addBoard: async (name) => {
    try {
      const board = await createBoard(name);
      set(state => ({ boards: [...state.boards, board] }));
    } catch {
      set({ error: 'ボードの作成に失敗しました' });
    }
  },

  renameBoard: async (id, name) => {
    try {
      const updated = await updateBoard(id, name);
      set(state => ({
        boards: state.boards.map(b => b.id === id ? updated : b),
      }));
    } catch {
      set({ error: 'ボード名の変更に失敗しました' });
    }
  },

  removeBoard: async (id) => {
    try {
      await deleteBoard(id);
      set(state => ({ boards: state.boards.filter(b => b.id !== id) }));
    } catch {
      set({ error: 'ボードの削除に失敗しました' });
    }
  },
}));
