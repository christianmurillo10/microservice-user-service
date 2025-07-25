import { GenericObject, Query } from "./common.type";

export type GetAllArgs = {
  condition?: GenericObject,
  query?: Query
};

export type GetAllBetweenCreatedAtArgs = {
  dateFrom: string,
  dateTo: string,
  condition?: GenericObject
};

export type GetByIdArgs<I> = {
  id: I,
  condition?: GenericObject
};

export type GetByNameArgs = {
  name: string,
  condition?: GenericObject
};

export type GetByUsernameOrEmailArgs = {
  username: string,
  email: string,
  condition?: GenericObject | undefined,
};

export type CountAllArgs = {
  condition?: GenericObject,
  query?: Query
};