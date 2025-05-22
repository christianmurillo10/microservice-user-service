import Users from "../../../models/users.model";
import {
  TFindAllArgs,
  TFindAllBetweenCreatedAtArgs,
  TFindByIdArgs,
  TFindByUsernameOrEmailArgs,
  TCreateArgs,
  TUpdateArgs,
  TSoftDeleteArgs,
  TSoftDeleteManyArgs,
  TChangePasswordArgs,
  TCountArgs
} from "../repository.type";
import { TGenericObject } from "../common.type";

export default interface IUsersRepository {
  findAll: (args: TFindAllArgs) => Promise<Users[]>;

  findAllBetweenCreatedAt: (args: TFindAllBetweenCreatedAtArgs) => Promise<Users[]>;

  findById: (args: TFindByIdArgs<string>) => Promise<Users | null>;

  findByUsernameOrEmail: (args: TFindByUsernameOrEmailArgs) => Promise<Users | null>;

  create: (args: TCreateArgs<Users>) => Promise<Users>;

  update: (args: TUpdateArgs<string, Users>) => Promise<Users>;

  softDelete: (args: TSoftDeleteArgs<string>) => Promise<Users>;

  softDeleteMany: (args: TSoftDeleteManyArgs<string>) => Promise<TGenericObject>;

  softDeleteManyByBusinessIds: (args: TSoftDeleteManyArgs<number>) => Promise<TGenericObject>;

  changePassword: (args: TChangePasswordArgs<string>) => Promise<void>;

  count: (args?: TCountArgs) => Promise<number>;
};