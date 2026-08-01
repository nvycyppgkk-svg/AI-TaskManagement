import { apiClient } from './client';
import type { BoardList } from '../types';

export async function createList(boardId: number, name: string): Promise<BoardList> {
  const res = await apiClient.post<BoardList>(`/api/boards/${boardId}/lists`, { name });
  return res.data;
}

export async function updateList(id: number, name: string): Promise<BoardList> {
  const res = await apiClient.patch<BoardList>(`/api/lists/${id}`, { name });
  return res.data;
}

export async function deleteList(id: number): Promise<void> {
  await apiClient.delete(`/api/lists/${id}`);
}
