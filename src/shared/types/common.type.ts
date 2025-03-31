export type GenericObject = Record<string, string> | object;

export type GenericArray = any[];

export type UniqueId = number | string | null;

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type AccessType =
  "SUPERADMIN" |
  "BUSINESS_ADMIN" |
  "BUSINESS_USER" |
  "BUSINESS_CLIENT";

export type ChangePassword = {
  old_password: string,
  new_password: string,
};

export type Query = {
  filters?: GenericObject,
  sorting?: GenericObject,
  offset?: number,
  limit?: number
};