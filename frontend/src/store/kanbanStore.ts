import { create } from 'zustand';
import type { BoardDetail, CardSummary, CardsByList, CardDetail } from '../types';
import { fetchBoardById } from '../api/boards';
import { fetchCardsByListId, fetchCardById, createCard, updateCard, type CardUpdatePayload } from '../api/cards';

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
  editCard: (cardId: number, payload: CardUpdatePayload) => Promise<void>;
  moveCard: (cardId: number, targetListId: number, targetIndex: number) => Promise<void>;
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

  editCard: async (cardId, payload) => {
    const prevCard = get().selectedCard;
    const prevListId = prevCard?.id === cardId ? prevCard.listId : undefined;
    try {
      const updated = await updateCard(cardId, payload);
      set(state => {
        const cardsByList = { ...state.cardsByList };
        const sourceListId = prevListId ?? updated.listId;

        if (sourceListId !== undefined && cardsByList[sourceListId]) {
          cardsByList[sourceListId] = cardsByList[sourceListId].filter(c => c.id !== cardId);
        }

        const summary: CardSummary = {
          id: updated.id,
          title: updated.title,
          priority: updated.priority,
          dueDate: updated.dueDate,
          position: updated.position,
          createdAt: updated.createdAt,
        };
        cardsByList[updated.listId] = [...(cardsByList[updated.listId] ?? []), summary];

        return {
          cardsByList,
          selectedCard: state.selectedCard?.id === cardId ? updated : state.selectedCard,
        };
      });
    } catch {
      set({ error: 'カードの更新に失敗しました' });
    }
  },

  moveCard: async (cardId, targetListId, targetIndex) => {
    const prevState = get().cardsByList;
    const sourceListId = Object.keys(prevState)
      .map(Number)
      .find(listId => prevState[listId].some(c => c.id === cardId));
    if (sourceListId === undefined) return;

    const movingCard = prevState[sourceListId].find(c => c.id === cardId);
    if (!movingCard) return;

    if (sourceListId === targetListId) {
      const currentIndex = prevState[sourceListId].findIndex(c => c.id === cardId);
      if (currentIndex === targetIndex) return;
    }

    const optimistic: CardsByList = { ...prevState };
    optimistic[sourceListId] = optimistic[sourceListId].filter(c => c.id !== cardId);
    const targetCards = [...(optimistic[targetListId] ?? [])];
    const insertAt = Math.max(0, Math.min(targetIndex, targetCards.length));
    targetCards.splice(insertAt, 0, movingCard);
    optimistic[targetListId] = targetCards;
    set({ cardsByList: optimistic });

    try {
      await updateCard(cardId, { listId: targetListId, position: targetIndex });
      const refreshedLists = Array.from(new Set([sourceListId, targetListId]));
      const refreshed = await Promise.all(refreshedLists.map(id => fetchCardsByListId(id)));
      set(state => {
        const cardsByList = { ...state.cardsByList };
        refreshedLists.forEach((id, i) => { cardsByList[id] = refreshed[i]; });
        return { cardsByList };
      });
    } catch {
      set({ cardsByList: prevState, error: 'カードの移動に失敗しました' });
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

export type SortOrder = 'manual' | 'priority' | 'dueDate';

const priorityRank: Record<NonNullable<CardSummary['priority']>, number> = {
  high: 0,
  mid: 1,
  low: 2,
};

export function sortCards(cards: CardSummary[], order: SortOrder): CardSummary[] {
  if (order === 'manual') return cards;

  const sorted = [...cards];
  if (order === 'priority') {
    sorted.sort((a, b) => {
      const rankA = a.priority ? priorityRank[a.priority] : 3;
      const rankB = b.priority ? priorityRank[b.priority] : 3;
      return rankA - rankB;
    });
  } else {
    sorted.sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    });
  }
  return sorted;
}
