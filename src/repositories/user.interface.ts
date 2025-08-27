import UserModel from "../models/user.model";
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

export default interface UserRepository {
  findAll: (args: FindAllArgs) => Promise<UserModel[]>;

  findAllBetweenCreatedAt: (args: FindAllBetweenCreatedAtArgs) => Promise<UserModel[]>;

  findById: (args: FindByIdArgs<string>) => Promise<UserModel | null>;

  findByUsernameOrEmail: (args: FindByUsernameOrEmailArgs) => Promise<UserModel | null>;

  create: (args: CreateArgs<UserModel>) => Promise<UserModel>;

  update: (args: UpdateArgs<string, UserModel>) => Promise<UserModel>;

  softDelete: (args: SoftDeleteArgs<string>) => Promise<UserModel>;

  softDeleteMany: (args: SoftDeleteManyArgs<string>) => Promise<GenericObject>;

  softDeleteManyByOrganizationIds: (args: SoftDeleteManyArgs<number>) => Promise<GenericObject>;

  changePassword: (args: ChangePasswordArgs<string>) => Promise<UserModel>;

  count: (args?: CountArgs) => Promise<number>;
};