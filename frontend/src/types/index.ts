export type Priority = 'high' | 'mid' | 'low' | null;

export interface BoardSummary {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoardList {
  id: number;
  name: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface BoardDetail {
  id: number;
  name: string;
  lists: BoardList[];
  createdAt: string;
  updatedAt: string;
}

export interface Label {
  id: number;
  name: string;
  color: string;
}

export interface CardSummary {
  id: number;
  title: string;
  priority: Priority;
  dueDate: string | null;
  position: number;
  createdAt: string;
}

export interface CardDetail {
  id: number;
  listId: number;
  title: string;
  description: string | null;
  priority: Priority;
  dueDate: string | null;
  position: number;
  labels: Label[];
  createdAt: string;
  updatedAt: string;
}

export type CardsByList = Record<number, CardSummary[]>;
