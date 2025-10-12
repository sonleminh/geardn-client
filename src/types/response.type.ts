import { ICategory } from "@/interfaces/ICategory";

export type Pagigation = {
  total: number;
  page: number;
  pageSize: number;
}

export type TPaginatedResponse<T> = {
    data: T[];
    meta: Pagigation;
    status: boolean;
    message: string;
  };

export type TBaseResponse<T, M = undefined> = {
  success: boolean;
  message: string;
  data: T;
  meta?: M;
};

export type TCursorPaginatedResponse<T> = {
  success: boolean;
  message: string;
  data: T[];
  meta: { nextCursor?: string|null; hasMore?: boolean; total?: number };
  category: ICategory;
};