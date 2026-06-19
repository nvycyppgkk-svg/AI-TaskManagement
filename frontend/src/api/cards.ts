import { apiClient } from './client';
import type { CardSummary, CardDetail, Priority } from '../types';

function normalizePriority(raw: string | null | undefined): Priority {
  switch (raw?.toUpperCase()) {
    case 'HIGH':   return 'high';
    case 'MEDIUM': return 'mid';
    case 'LOW':    return 'low';
    default:       return null;
  }
}

export async function fetchCardsByListId(listId: number): Promise<CardSummary[]> {
  const res = await apiClient.get<CardSummary[]>(`/api/lists/${listId}/cards`);
  return res.data.map(card => ({
    ...card,
    priority: normalizePriority(card.priority as unknown as string),
  }));
}

export async function fetchCardById(id: number): Promise<CardDetail> {
  const res = await apiClient.get<CardDetail>(`/api/cards/${id}`);
  return {
    ...res.data,
    priority: normalizePriority(res.data.priority as unknown as string),
  };
}
