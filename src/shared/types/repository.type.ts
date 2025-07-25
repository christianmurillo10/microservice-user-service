import { GenericObject, Query } from "./common.type";

export type FindAllArgs = {
  condition?: GenericObject | undefined,
  query?: Query | undefined,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type FindAllBetweenCreatedAtArgs = {
  dateFrom?: string | undefined,
  dateTo?: string | undefined,
  condition?: GenericObject | undefined,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type FindByIdArgs<I> = {
  id: I,
  condition?: GenericObject | undefined,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type FindOne = {
  condition: GenericObject,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type FindByNameArgs = {
  name: string,
  condition?: GenericObject | undefined,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type FindByApiKeyArgs = {
  apiKey: string,
  condition?: GenericObject | undefined,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type FindByEmailArgs = {
  email: string,
  condition?: GenericObject | undefined,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type FindByUsernameOrEmailArgs = {
  username: string,
  email: string,
  condition?: GenericObject | undefined,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type CreateArgs<P> = {
  params: P,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type CreateManyArgs<P> = {
  params: P[]
};

export type UpdateArgs<I, P> = {
  id: I,
  params: P,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type SoftDeleteArgs<I> = {
  id: I,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type DeleteArgs<I> = {
  id: I
};

export type SoftDeleteManyArgs<I> = {
  ids: I[]
};

export type ChangePasswordArgs<I> = {
  id: I,
  newPassword: string
};

export type CountArgs = {
  condition?: GenericObject | undefined,
  query?: Query | undefined
};