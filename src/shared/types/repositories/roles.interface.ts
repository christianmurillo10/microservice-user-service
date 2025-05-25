import RolesModel from "../../../models/roles.model";
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

export default interface RolesRepository {
  findAll: (args: FindAllArgs) => Promise<RolesModel[]>;

  findById: (args: FindByIdArgs<number>) => Promise<RolesModel | null>;

  findByName: (args: FindByNameArgs) => Promise<RolesModel | null>;

  create: (args: CreateArgs<RolesModel>) => Promise<RolesModel>;

  update: (args: UpdateArgs<number, RolesModel>) => Promise<RolesModel>;

  softDelete: (args: SoftDeleteArgs<number>) => Promise<RolesModel>;

  softDeleteMany: (args: SoftDeleteManyArgs<number>) => Promise<GenericObject>;

  softDeleteManyByBusinessIds: (args: SoftDeleteManyArgs<number>) => Promise<GenericObject>;

  count: (args?: CountArgs) => Promise<number>;
};