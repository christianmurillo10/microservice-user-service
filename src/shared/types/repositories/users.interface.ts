import Users from "../../entities/users.entity";
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
} from "../repository.type";
import { GenericObject } from "../common.type";

export default interface UsersRepositoryInterface {
  findAll: (args: FindAllArgs) => Promise<Users[]>;

  findAllBetweenCreatedAt: (args: FindAllBetweenCreatedAtArgs) => Promise<Users[]>;

  findById: (args: FindByIdArgs<string>) => Promise<Users | null>;

  findByUsernameOrEmail: (args: FindByUsernameOrEmailArgs) => Promise<Users | null>;

  create: (args: CreateArgs<Users>) => Promise<Users>;

  update: (args: UpdateArgs<string, Users>) => Promise<Users>;

  softDelete: (args: SoftDeleteArgs<string>) => Promise<Users>;

  softDeleteMany: (args: SoftDeleteManyArgs<string>) => Promise<GenericObject>;

  softDeleteManyByBusinessIds: (args: SoftDeleteManyArgs<number>) => Promise<GenericObject>;

  changePassword: (args: ChangePasswordArgs<string>) => Promise<void>;

  count: (args?: CountArgs) => Promise<number>;
};