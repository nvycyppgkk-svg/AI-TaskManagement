import { apiClient } from './client';
import type { BoardSummary, BoardDetail, BoardList } from '../types';

export async function fetchBoards(): Promise<BoardSummary[]> {
  const res = await apiClient.get<BoardSummary[]>('/api/boards');
  return res.data;
}

export async function fetchBoardById(id: number): Promise<BoardDetail> {
  const res = await apiClient.get<BoardDetail>(`/api/boards/${id}`);
  return res.data;
}

export async function fetchListsByBoardId(boardId: number): Promise<BoardList[]> {
  const res = await apiClient.get<BoardList[]>(`/api/boards/${boardId}/lists`);
  return res.data;
}
