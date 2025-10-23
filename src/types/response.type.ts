import { ICategory } from "@/interfaces/ICategory";

export type Pagination = {
  total: number;
  page: number;
  pageSize: number;
}

export type CursorMeta = {
  nextCursor?: string | null;
  hasMore?: boolean;
  total?: number;
};

export type BaseResponse<T, M = unknown> = {
  success: boolean;
  message: string;
  data: T;
  meta?: M;
};

export type PageListResponse<T> = {
  data: T[];
  meta: Pagination;
  status: boolean;
  message: string;
};

export type ProductsByCategoryResponse<T> = {
  success: boolean;
  message: string;
  data: T[];
  meta: CursorMeta;
  category: ICategory;
};

export type NormalizedMeta = CursorMeta | Pagination | undefined;

export type NormalizedResponse<T> = {
  ok: boolean;                 // chuẩn hóa từ success/status
  message: string;
  data: T | T[];               // có thể là item hoặc list
  meta?: NormalizedMeta;       // CursorMeta hoặc Pagination hoặc undefined
  category?: ICategory;        // chỉ có khi BE trả kèm category
};

// export type TPaginatedResponse<T> = {
//     data: T[];
//     meta: Pagination;
//     status: boolean;
//     message: string;
//   };

// export type TBaseResponse<T, M = undefined> = {
//   success: boolean;
//   message: string;
//   data: T;
//   meta?: M;
// };

// export type TCursorPaginatedResponse<T> = {
//   success: boolean;
//   message: string;
//   data: T[];
//   meta: { nextCursor?: string|null; hasMore?: boolean; total?: number };
//   category: ICategory;
// };

// export type BackendEnvelope<T, M = unknown> = {
//   success: boolean;
//   message: string;
//   data: T;
//   meta?: M;
// };

// export type AppResult<T, M = unknown> =
//   | { ok: true; data: T; meta?: M }
//   | { ok: false; status: number; message: string; notFound?: true };