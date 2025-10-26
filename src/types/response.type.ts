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
  success: boolean;
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
};

export type Ok<T> = { ok: true; data: T; status: number; meta?: unknown };
export type NotFound = { ok: false; notFound: true; status: 404; message?: string };
export type Err = { ok: false; status: number; message: string };
export type Result<T> = Ok<T> | Err | NotFound;

// export type PageListResponse<T> = {
//     data: T[];
//     meta: Pagination;
//     status: boolean;
//     message: string;
//   };

// export type BaseResponse<T, M = undefined> = {
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