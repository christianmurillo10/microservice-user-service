import Businesses from "../../entities/businesses.entity";
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

export default interface BusinessesRepositoryInterface {
  findAll: (args: FindAllArgs) => Promise<Businesses[]>;

  findAllBetweenCreatedAt: (args: FindAllBetweenCreatedAtArgs) => Promise<Businesses[]>;

  findById: (args: FindByIdArgs<number>) => Promise<Businesses | null>;

  findByName: (args: FindByNameArgs) => Promise<Businesses | null>;

  findByApiKey: (args: FindByApiKeyArgs) => Promise<Businesses | null>;

  create: (args: CreateArgs<Businesses>) => Promise<Businesses>;

  update: (args: UpdateArgs<number, Businesses>) => Promise<Businesses>;

  softDelete: (args: SoftDeleteArgs<number>) => Promise<Businesses>;

  softDeleteMany: (args: SoftDeleteManyArgs<number>) => Promise<GenericObject>;

  count: (args?: CountArgs) => Promise<number>;
};