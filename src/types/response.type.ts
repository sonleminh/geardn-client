export type TPaginatedResponse<T> = {
    data: T[];
    meta: {
      total: number;
      page: number;
      pageSize: number;
    };
    status: boolean;
    message: string;
  };