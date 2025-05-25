import UsersModel from "../models/users.model";
import {
  FindAllArgs,
  FindAllBetweenCreatedAtArgs,
  FindByIdArgs,
  FindByUsernameOrEmailArgs,
  CreateArgs,
  UpdateArgs,
  SoftDeleteArgs,
  SoftDeleteManyArgs,
  ChangePasswordArgs,
  CountArgs
} from "../shared/types/repository.type";
import { GenericObject } from "../shared/types/common.type";

export default interface UsersRepository {
  findAll: (args: FindAllArgs) => Promise<UsersModel[]>;

  findAllBetweenCreatedAt: (args: FindAllBetweenCreatedAtArgs) => Promise<UsersModel[]>;

  findById: (args: FindByIdArgs<string>) => Promise<UsersModel | null>;

  findByUsernameOrEmail: (args: FindByUsernameOrEmailArgs) => Promise<UsersModel | null>;

  create: (args: CreateArgs<UsersModel>) => Promise<UsersModel>;

  update: (args: UpdateArgs<string, UsersModel>) => Promise<UsersModel>;

  softDelete: (args: SoftDeleteArgs<string>) => Promise<UsersModel>;

  softDeleteMany: (args: SoftDeleteManyArgs<string>) => Promise<GenericObject>;

  softDeleteManyByBusinessIds: (args: SoftDeleteManyArgs<number>) => Promise<GenericObject>;

  changePassword: (args: ChangePasswordArgs<string>) => Promise<void>;

  count: (args?: CountArgs) => Promise<number>;
};