import { apiClient } from './client';
import type { CardSummary, CardDetail, Priority } from '../types';

type RawPriority = 'HIGH' | 'MEDIUM' | 'LOW' | null;
type ApiCardSummary = Omit<CardSummary, 'priority'> & { priority: RawPriority };
type ApiCardDetail = Omit<CardDetail, 'priority'> & { priority: RawPriority };

function normalizePriority(raw: RawPriority | undefined): Priority {
  switch (raw) {
    case 'HIGH':   return 'high';
    case 'MEDIUM': return 'mid';
    case 'LOW':    return 'low';
    default:       return null;
  }
}

function denormalizePriority(priority: Priority): string | null {
  switch (priority) {
    case 'high': return 'HIGH';
    case 'mid':  return 'MEDIUM';
    case 'low':  return 'LOW';
    default:     return null;
  }
}

export interface CardUpdatePayload {
  title?: string;
  description?: string | null;
  priority?: Priority;
  dueDate?: string | null;
  listId?: number;
  position?: number;
}

export async function fetchCardsByListId(listId: number): Promise<CardSummary[]> {
  const res = await apiClient.get<ApiCardSummary[]>(`/api/lists/${listId}/cards`);
  return res.data.map(card => ({
    ...card,
    priority: normalizePriority(card.priority),
  }));
}

export async function fetchCardById(id: number): Promise<CardDetail> {
  const res = await apiClient.get<ApiCardDetail>(`/api/cards/${id}`);
  return {
    ...res.data,
    priority: normalizePriority(res.data.priority),
  };
}

export async function createCard(listId: number, title: string): Promise<CardDetail> {
  const res = await apiClient.post<ApiCardDetail>(`/api/lists/${listId}/cards`, { title });
  return {
    ...res.data,
    priority: normalizePriority(res.data.priority),
  };
}

export async function deleteCard(cardId: number): Promise<void> {
  await apiClient.delete(`/api/cards/${cardId}`);
}

export async function updateCard(cardId: number, payload: CardUpdatePayload): Promise<CardDetail> {
  const body = {
    ...payload,
    priority: payload.priority !== undefined ? denormalizePriority(payload.priority) : undefined,
  };
  const res = await apiClient.patch<ApiCardDetail>(`/api/cards/${cardId}`, body);
  return {
    ...res.data,
    priority: normalizePriority(res.data.priority),
  };
}
