import Businesses from "../../../models/businesses.model";
import {
  TCountArgs,
  TCreateArgs,
  TFindAllArgs,
  TFindAllBetweenCreatedAtArgs,
  TFindByApiKeyArgs,
  TFindByIdArgs,
  TFindByNameArgs,
  TSoftDeleteArgs,
  TSoftDeleteManyArgs,
  TUpdateArgs
} from "../repository.type";
import { TGenericObject } from "../common.type";

export default interface IBusinessesRepository {
  findAll: (args: TFindAllArgs) => Promise<Businesses[]>;

  findAllBetweenCreatedAt: (args: TFindAllBetweenCreatedAtArgs) => Promise<Businesses[]>;

  findById: (args: TFindByIdArgs<number>) => Promise<Businesses | null>;

  findByName: (args: TFindByNameArgs) => Promise<Businesses | null>;

  findByApiKey: (args: TFindByApiKeyArgs) => Promise<Businesses | null>;

  create: (args: TCreateArgs<Businesses>) => Promise<Businesses>;

  update: (args: TUpdateArgs<number, Businesses>) => Promise<Businesses>;

  softDelete: (args: TSoftDeleteArgs<number>) => Promise<Businesses>;

  softDeleteMany: (args: TSoftDeleteManyArgs<number>) => Promise<TGenericObject>;

  count: (args?: TCountArgs) => Promise<number>;
};