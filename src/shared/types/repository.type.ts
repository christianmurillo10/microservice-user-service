import { TGenericObject, TQuery } from "./common.type";

export type TFindAllArgs = {
  condition?: TGenericObject | undefined,
  query?: TQuery | undefined,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type TFindAllBetweenCreatedAtArgs = {
  date_from?: string | undefined,
  date_to?: string | undefined,
  condition?: TGenericObject | undefined,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type TFindByIdArgs<I> = {
  id: I,
  condition?: TGenericObject | undefined,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type TFindOne = {
  condition: TGenericObject,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type TFindByNameArgs = {
  name: string,
  condition?: TGenericObject | undefined,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type TFindByApiKeyArgs = {
  api_key: string,
  condition?: TGenericObject | undefined,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type TFindByEmailArgs = {
  email: string,
  condition?: TGenericObject | undefined,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type TFindByUsernameOrEmailArgs = {
  username: string,
  email: string,
  condition?: TGenericObject | undefined,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type TCreateArgs<P> = {
  params: P,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type TCreateManyArgs<P> = {
  params: P[]
};

export type TUpdateArgs<I, P> = {
  id: I,
  params: P,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type TSoftDeleteArgs<I> = {
  id: I,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type TDeleteArgs<I> = {
  id: I
};

export type TSoftDeleteManyArgs<I> = {
  ids: I[]
};

export type TChangePasswordArgs<I> = {
  id: I,
  new_password: string
};

export type TCountArgs = {
  condition?: TGenericObject | undefined,
  query?: TQuery | undefined
};