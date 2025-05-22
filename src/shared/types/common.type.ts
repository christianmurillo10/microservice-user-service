export type TGenericObject = Record<string, string> | object;

export type TGenericArray = any[];

export type TUniqueId = number | string | null;

export type TGender = "MALE" | "FEMALE" | "OTHER";

export type TChangePassword = {
  old_password: string,
  new_password: string,
};

export type TQuery = {
  filters?: TGenericObject,
  sorting?: TGenericObject,
  offset?: number,
  limit?: number
};

export type TApiResponseInput = {
  service?: string,
  version?: string,
  status_code: number,
  status?: string,
  message?: string,
  errors?: string[],
  result?: unknown,
};