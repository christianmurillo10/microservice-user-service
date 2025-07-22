export type GenericObject = Record<string, string> | object;

export type GenericArray = any[];

export type UniqueId = number | string | null;

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type ChangePassword = {
  old_password: string,
  new_password: string,
};

export type Query = {
  filters?: GenericObject,
  sorting?: GenericObject,
  page?: number,
  limit?: number
};

export type Pagination = {
  total_items: number,
  total_page_items: number,
  total_pages: number,
  page: number,
  page_size: number,
  has_next_page: boolean,
  has_previous_page: boolean,
};

export type ApiResponseInput = {
  service?: string,
  version?: string,
  status_code: number,
  status?: string,
  message?: string,
  errors?: string[],
  data?: unknown,
  pagination?: Pagination,
};

export type EventMessageData<T> = {
  old_details: T,
  new_details: T
};