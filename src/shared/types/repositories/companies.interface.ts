import Companies from "../../entities/companies.entity";
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
} from "../repository.type";
import { GenericObject } from "../common.type";

export default interface CompaniesRepositoryInterface {
  findAll: (args: FindAllArgs) => Promise<Companies[]>;

  findAllBetweenCreatedAt: (args: FindAllBetweenCreatedAtArgs) => Promise<Companies[]>;

  findById: (args: FindByIdArgs<number>) => Promise<Companies | null>;

  findByName: (args: FindByNameArgs) => Promise<Companies | null>;

  findByApiKey: (args: FindByApiKeyArgs) => Promise<Companies | null>;

  create: (args: CreateArgs<Companies>) => Promise<Companies>;

  update: (args: UpdateArgs<number, Companies>) => Promise<Companies>;

  softDelete: (args: SoftDeleteArgs<number>) => Promise<Companies>;

  softDeleteMany: (args: SoftDeleteManyArgs<number>) => Promise<GenericObject>;

  count: (args?: CountArgs) => Promise<number>;
};