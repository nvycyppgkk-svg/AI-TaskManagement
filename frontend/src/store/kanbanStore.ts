import { create } from 'zustand';
import type { BoardDetail, CardSummary, CardsByList, CardDetail, Label } from '../types';
import { fetchBoardById, updateBoard, deleteBoard } from '../api/boards';
import { fetchCardsByListId, fetchCardById, createCard, updateCard, deleteCard, type CardUpdatePayload } from '../api/cards';
import { createList, updateList, deleteList } from '../api/lists';
import { fetchLabels, createLabel, deleteLabel, attachLabel, detachLabel } from '../api/labels';

function toSummary(card: CardDetail): CardSummary {
  return {
    id: card.id,
    title: card.title,
    priority: card.priority,
    dueDate: card.dueDate,
    position: card.position,
    createdAt: card.createdAt,
    labels: card.labels ?? [],
  };
}

function replaceSummary(cardsByList: CardsByList, card: CardDetail): CardsByList {
  const next: CardsByList = {};
  for (const [listId, cards] of Object.entries(cardsByList)) {
    next[Number(listId)] = cards.map(c => (c.id === card.id ? { ...toSummary(card), position: c.position } : c));
  }
  return next;
}

interface KanbanStore {
  board: BoardDetail | null;
  cardsByList: CardsByList;
  selectedCard: CardDetail | null;
  labels: Label[];
  searchQuery: string;
  loading: boolean;
  cardsLoading: boolean;
  error: string | null;
  loadBoard: (id: number) => Promise<void>;
  loadAllCards: (listIds: number[]) => Promise<void>;
  loadLabels: () => Promise<void>;
  openCardDetail: (cardId: number) => Promise<void>;
  closeCardDetail: () => void;
  addCard: (listId: number, title: string) => Promise<void>;
  editCard: (cardId: number, payload: CardUpdatePayload) => Promise<void>;
  removeCard: (cardId: number) => Promise<void>;
  moveCard: (cardId: number, targetListId: number, targetIndex: number) => Promise<void>;
  renameCurrentBoard: (name: string) => Promise<void>;
  deleteCurrentBoard: () => Promise<void>;
  addList: (boardId: number, name: string) => Promise<void>;
  renameList: (listId: number, name: string) => Promise<void>;
  removeList: (listId: number) => Promise<void>;
  addLabel: (name: string, color: string) => Promise<void>;
  removeLabel: (labelId: number) => Promise<void>;
  attachCardLabel: (cardId: number, labelId: number) => Promise<void>;
  detachCardLabel: (cardId: number, labelId: number) => Promise<void>;
  setSearchQuery: (q: string) => void;
  clearError: () => void;
}

export const useKanbanStore = create<KanbanStore>((set, get) => ({
  board: null,
  cardsByList: {},
  selectedCard: null,
  labels: [],
  searchQuery: '',
  loading: false,
  cardsLoading: false,
  error: null,

  loadBoard: async (id) => {
    set({ loading: true, error: null, board: null, cardsByList: {}, searchQuery: '' });
    try {
      const board = await fetchBoardById(id);
      set({ board, loading: false });
      await Promise.all([
        get().loadAllCards(board.lists.map(l => l.id)),
        get().loadLabels(),
      ]);
    } catch {
      set({ error: 'ボードの取得に失敗しました', loading: false });
    }
  },

  loadLabels: async () => {
    try {
      const labels = await fetchLabels();
      set({ labels });
    } catch {
      set({ error: 'ラベルの取得に失敗しました' });
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
            toSummary(card),
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

        cardsByList[updated.listId] = [...(cardsByList[updated.listId] ?? []), toSummary(updated)];

        return {
          cardsByList,
          selectedCard: state.selectedCard?.id === cardId ? updated : state.selectedCard,
        };
      });
    } catch {
      set({ error: 'カードの更新に失敗しました' });
    }
  },

  removeCard: async (cardId) => {
    const prevState = get().cardsByList;
    const sourceListId = Object.keys(prevState)
      .map(Number)
      .find(listId => prevState[listId].some(c => c.id === cardId));

    try {
      await deleteCard(cardId);
      set(state => {
        const cardsByList = { ...state.cardsByList };
        if (sourceListId !== undefined) {
          cardsByList[sourceListId] = cardsByList[sourceListId]
            .filter(c => c.id !== cardId)
            .map((c, i) => ({ ...c, position: i }));
        }
        return {
          cardsByList,
          selectedCard: state.selectedCard?.id === cardId ? null : state.selectedCard,
        };
      });
    } catch {
      set({ error: 'カードの削除に失敗しました' });
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

  renameCurrentBoard: async (name) => {
    const board = get().board;
    if (!board) return;
    try {
      const updated = await updateBoard(board.id, name);
      set(state => ({
        board: state.board ? { ...state.board, name: updated.name, updatedAt: updated.updatedAt } : null,
      }));
    } catch {
      set({ error: 'ボード名の変更に失敗しました' });
    }
  },

  deleteCurrentBoard: async () => {
    const board = get().board;
    if (!board) return;
    try {
      await deleteBoard(board.id);
      set({ board: null, cardsByList: {} });
    } catch {
      set({ error: 'ボードの削除に失敗しました' });
    }
  },

  addList: async (boardId, name) => {
    try {
      const newList = await createList(boardId, name);
      set(state => ({
        board: state.board
          ? { ...state.board, lists: [...state.board.lists, newList] }
          : null,
        cardsByList: { ...state.cardsByList, [newList.id]: [] },
      }));
    } catch {
      set({ error: 'リストの作成に失敗しました' });
    }
  },

  renameList: async (listId, name) => {
    try {
      const updated = await updateList(listId, name);
      set(state => ({
        board: state.board
          ? {
              ...state.board,
              lists: state.board.lists.map(l => l.id === listId ? { ...l, name: updated.name } : l),
            }
          : null,
      }));
    } catch {
      set({ error: 'リスト名の変更に失敗しました' });
    }
  },

  removeList: async (listId) => {
    try {
      await deleteList(listId);
      set(state => {
        const cardsByList = { ...state.cardsByList };
        delete cardsByList[listId];
        return {
          board: state.board
            ? { ...state.board, lists: state.board.lists.filter(l => l.id !== listId) }
            : null,
          cardsByList,
        };
      });
    } catch {
      set({ error: 'リストの削除に失敗しました' });
    }
  },

  addLabel: async (name, color) => {
    try {
      const created = await createLabel(name, color);
      set(state => ({ labels: [...state.labels, created] }));
    } catch {
      set({ error: 'ラベルの作成に失敗しました' });
    }
  },

  removeLabel: async (labelId) => {
    try {
      await deleteLabel(labelId);
      set(state => {
        const cardsByList: CardsByList = {};
        for (const [listId, cards] of Object.entries(state.cardsByList)) {
          cardsByList[Number(listId)] = cards.map(card => ({
            ...card,
            labels: (card.labels ?? []).filter(l => l.id !== labelId),
          }));
        }
        const selectedCard = state.selectedCard
          ? {
              ...state.selectedCard,
              labels: state.selectedCard.labels.filter(l => l.id !== labelId),
            }
          : null;
        return {
          labels: state.labels.filter(l => l.id !== labelId),
          cardsByList,
          selectedCard,
        };
      });
    } catch {
      set({ error: 'ラベルの削除に失敗しました' });
    }
  },

  attachCardLabel: async (cardId, labelId) => {
    try {
      const updated = await attachLabel(cardId, labelId);
      set(state => ({
        selectedCard: state.selectedCard?.id === cardId ? updated : state.selectedCard,
        cardsByList: replaceSummary(state.cardsByList, updated),
      }));
    } catch {
      set({ error: 'ラベルの付与に失敗しました' });
    }
  },

  detachCardLabel: async (cardId, labelId) => {
    try {
      const updated = await detachLabel(cardId, labelId);
      set(state => ({
        selectedCard: state.selectedCard?.id === cardId ? updated : state.selectedCard,
        cardsByList: replaceSummary(state.cardsByList, updated),
      }));
    } catch {
      set({ error: 'ラベルの解除に失敗しました' });
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
