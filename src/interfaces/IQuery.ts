export interface IQueryParams {
  q?: string;
  page?: number | undefined;
  limit?: number;
  sort: '' | 'desc' | 'asc';
}
