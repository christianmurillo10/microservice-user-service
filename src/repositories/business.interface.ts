import BusinessModel from "../models/business.model";
import {
  CountArgs,
  CreateArgs,
  FindAllArgs,
  FindAllBetweenCreatedAtArgs,
  FindByApiKeyArgs,
  FindByIdArgs,
  FindByNameArgs,
  SoftDeleteArgs,
  SoftDeleteManyArgs,
  UpdateArgs
} from "../shared/types/repository.type";
import { GenericObject } from "../shared/types/common.type";

export default interface BusinessRepository {
  findAll: (args: FindAllArgs) => Promise<BusinessModel[]>;

  findAllBetweenCreatedAt: (args: FindAllBetweenCreatedAtArgs) => Promise<BusinessModel[]>;

  findById: (args: FindByIdArgs<number>) => Promise<BusinessModel | null>;

  findByName: (args: FindByNameArgs) => Promise<BusinessModel | null>;

  findByApiKey: (args: FindByApiKeyArgs) => Promise<BusinessModel | null>;

  create: (args: CreateArgs<BusinessModel>) => Promise<BusinessModel>;

  update: (args: UpdateArgs<number, BusinessModel>) => Promise<BusinessModel>;

  softDelete: (args: SoftDeleteArgs<number>) => Promise<BusinessModel>;

  softDeleteMany: (args: SoftDeleteManyArgs<number>) => Promise<GenericObject>;

  count: (args?: CountArgs) => Promise<number>;
};