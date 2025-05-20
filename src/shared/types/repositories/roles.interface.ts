import Roles from "../../../models/roles.model";
import {
  FindAllArgs,
  FindByIdArgs,
  FindByNameArgs,
  CreateArgs,
  UpdateArgs,
  SoftDeleteArgs,
  SoftDeleteManyArgs,
  CountArgs
} from "../repository.type";
import { GenericObject } from "../common.type";

export default interface RolesRepositoryInterface {
  findAll: (args: FindAllArgs) => Promise<Roles[]>;

  findById: (args: FindByIdArgs<number>) => Promise<Roles | null>;

  findByName: (args: FindByNameArgs) => Promise<Roles | null>;

  create: (args: CreateArgs<Roles>) => Promise<Roles>;

  update: (args: UpdateArgs<number, Roles>) => Promise<Roles>;

  softDelete: (args: SoftDeleteArgs<number>) => Promise<Roles>;

  softDeleteMany: (args: SoftDeleteManyArgs<number>) => Promise<GenericObject>;

  softDeleteManyByBusinessIds: (args: SoftDeleteManyArgs<number>) => Promise<GenericObject>;

  count: (args?: CountArgs) => Promise<number>;
};