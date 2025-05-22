import Roles from "../../../models/roles.model";
import {
  TFindAllArgs,
  TFindByIdArgs,
  TFindByNameArgs,
  TCreateArgs,
  TUpdateArgs,
  TSoftDeleteArgs,
  TSoftDeleteManyArgs,
  TCountArgs
} from "../repository.type";
import { TGenericObject } from "../common.type";

export default interface IRolesRepository {
  findAll: (args: TFindAllArgs) => Promise<Roles[]>;

  findById: (args: TFindByIdArgs<number>) => Promise<Roles | null>;

  findByName: (args: TFindByNameArgs) => Promise<Roles | null>;

  create: (args: TCreateArgs<Roles>) => Promise<Roles>;

  update: (args: TUpdateArgs<number, Roles>) => Promise<Roles>;

  softDelete: (args: TSoftDeleteArgs<number>) => Promise<Roles>;

  softDeleteMany: (args: TSoftDeleteManyArgs<number>) => Promise<TGenericObject>;

  softDeleteManyByBusinessIds: (args: TSoftDeleteManyArgs<number>) => Promise<TGenericObject>;

  count: (args?: TCountArgs) => Promise<number>;
};