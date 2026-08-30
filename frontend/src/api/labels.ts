import { apiClient } from './client';
import type { CardDetail, Label, Priority } from '../types';

type RawPriority = 'HIGH' | 'MEDIUM' | 'LOW' | null;
type ApiCardDetail = Omit<CardDetail, 'priority'> & { priority: RawPriority };

function normalizePriority(raw: RawPriority | undefined): Priority {
  switch (raw) {
    case 'HIGH':   return 'high';
    case 'MEDIUM': return 'mid';
    case 'LOW':    return 'low';
    default:       return null;
  }
}

function normalizeCard(card: ApiCardDetail): CardDetail {
  return { ...card, priority: normalizePriority(card.priority), labels: card.labels ?? [] };
}

export async function fetchLabels(): Promise<Label[]> {
  const res = await apiClient.get<Label[]>('/api/labels');
  return res.data;
}

export async function createLabel(name: string, color: string): Promise<Label> {
  const res = await apiClient.post<Label>('/api/labels', { name, color });
  return res.data;
}

export async function deleteLabel(id: number): Promise<void> {
  await apiClient.delete(`/api/labels/${id}`);
}

export async function attachLabel(cardId: number, labelId: number): Promise<CardDetail> {
  const res = await apiClient.post<ApiCardDetail>(`/api/cards/${cardId}/labels/${labelId}`);
  return normalizeCard(res.data);
}

export async function detachLabel(cardId: number, labelId: number): Promise<CardDetail> {
  const res = await apiClient.delete<ApiCardDetail>(`/api/cards/${cardId}/labels/${labelId}`);
  return normalizeCard(res.data);
}
