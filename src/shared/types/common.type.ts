export type GenericObject = Record<string, string> | object;

export type GenericArray = any[];

export type UniqueId = number | string | null;

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type ChangePassword = {
  oldPassword: string,
  newPassword: string,
};

export type Query = {
  filters?: GenericObject,
  sorting?: GenericObject,
  page?: number,
  limit?: number
};

export type Pagination = {
  totalItems: number,
  totalPageItems: number,
  totalPages: number,
  page: number,
  pageSize: number,
  hasNextPage: boolean,
  hasPreviousPage: boolean,
};

export type ApiResponseInput = {
  service?: string,
  version?: string,
  statusCode: number,
  status?: string,
  message?: string,
  errors?: string[],
  data?: unknown,
  pagination?: Pagination,
};

export type EventMessageData<T> = {
  oldDetails: T,
  newDetails: T
};