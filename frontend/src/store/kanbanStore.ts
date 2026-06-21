import { create } from 'zustand';
import type { BoardDetail, CardSummary, CardsByList, CardDetail } from '../types';
import { fetchBoardById } from '../api/boards';
import { fetchCardsByListId, fetchCardById, createCard } from '../api/cards';

interface KanbanStore {
  board: BoardDetail | null;
  cardsByList: CardsByList;
  selectedCard: CardDetail | null;
  searchQuery: string;
  loading: boolean;
  cardsLoading: boolean;
  error: string | null;
  loadBoard: (id: number) => Promise<void>;
  loadAllCards: (listIds: number[]) => Promise<void>;
  openCardDetail: (cardId: number) => Promise<void>;
  closeCardDetail: () => void;
  addCard: (listId: number, title: string) => Promise<void>;
  setSearchQuery: (q: string) => void;
  clearError: () => void;
}

export const useKanbanStore = create<KanbanStore>((set, get) => ({
  board: null,
  cardsByList: {},
  selectedCard: null,
  searchQuery: '',
  loading: false,
  cardsLoading: false,
  error: null,

  loadBoard: async (id) => {
    set({ loading: true, error: null, board: null, cardsByList: {}, searchQuery: '' });
    try {
      const board = await fetchBoardById(id);
      set({ board, loading: false });
      await get().loadAllCards(board.lists.map(l => l.id));
    } catch {
      set({ error: 'ボードの取得に失敗しました', loading: false });
    }
  },

  loadAllCards: async (listIds) => {
    set({ cardsLoading: true });
    try {
      const results = await Promise.all(listIds.map(id => fetchCardsByListId(id)));
      const cardsByList: CardsByList = {};
      listIds.forEach((id, i) => { cardsByList[id] = results[i]; });
      set({ cardsByList, cardsLoading: false });
    } catch {
      set({ error: 'カードの取得に失敗しました', cardsLoading: false });
    }
  },

  openCardDetail: async (cardId) => {
    try {
      const card = await fetchCardById(cardId);
      set({ selectedCard: card });
    } catch {
      set({ error: 'カード詳細の取得に失敗しました' });
    }
  },

  closeCardDetail: () => set({ selectedCard: null }),

  addCard: async (listId, title) => {
    try {
      const card = await createCard(listId, title);
      set(state => ({
        cardsByList: {
          ...state.cardsByList,
          [listId]: [
            ...(state.cardsByList[listId] ?? []),
            {
              id: card.id,
              title: card.title,
              priority: card.priority,
              dueDate: card.dueDate,
              position: card.position,
              createdAt: card.createdAt,
            },
          ],
        },
      }));
    } catch {
      set({ error: 'カードの作成に失敗しました' });
    }
  },

  setSearchQuery: (q) => set({ searchQuery: q }),
  clearError: () => set({ error: null }),
}));

export function getFilteredCards(cards: CardSummary[], query: string): CardSummary[] {
  if (!query.trim()) return cards;
  const lower = query.toLowerCase();
  return cards.filter(c => c.title.toLowerCase().includes(lower));
}
