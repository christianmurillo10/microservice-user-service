import BusinessesModel from "../models/businesses.model";
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

export default interface BusinessesRepository {
  findAll: (args: FindAllArgs) => Promise<BusinessesModel[]>;

  findAllBetweenCreatedAt: (args: FindAllBetweenCreatedAtArgs) => Promise<BusinessesModel[]>;

  findById: (args: FindByIdArgs<number>) => Promise<BusinessesModel | null>;

  findByName: (args: FindByNameArgs) => Promise<BusinessesModel | null>;

  findByApiKey: (args: FindByApiKeyArgs) => Promise<BusinessesModel | null>;

  create: (args: CreateArgs<BusinessesModel>) => Promise<BusinessesModel>;

  update: (args: UpdateArgs<number, BusinessesModel>) => Promise<BusinessesModel>;

  softDelete: (args: SoftDeleteArgs<number>) => Promise<BusinessesModel>;

  softDeleteMany: (args: SoftDeleteManyArgs<number>) => Promise<GenericObject>;

  count: (args?: CountArgs) => Promise<number>;
};