import { PrismaClient } from "@prisma/client";
import Businesses from "../models/businesses.model";
import IBusinessesRepository from "../shared/types/repositories/businesses.interface";
import {
  TFindAllArgs,
  TFindAllBetweenCreatedAtArgs,
  TFindByIdArgs,
  TFindByNameArgs,
  TFindByApiKeyArgs,
  TCreateArgs,
  TUpdateArgs,
  TSoftDeleteArgs,
  TSoftDeleteManyArgs,
  TCountArgs
} from "../shared/types/repository.type";
import { TGenericObject } from "../shared/types/common.type";
import { parseQueryFilters, setSelectExclude } from "../shared/helpers/common.helper";
import { businessesSubsets } from "../shared/helpers/select-subset.helper";

export default class BusinessesRepository implements IBusinessesRepository {
  private client;

  readonly logoPath = "public/images/businesses/";

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.businesses;
  };

  findAll = async (
    args: TFindAllArgs
  ): Promise<Businesses[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findMany({
      select: {
        ...businessesSubsets,
        ...exclude
      },
      where: {
        deleted_at: null,
        ...args.condition,
        ...parseQueryFilters(args.query?.filters)
      },
      orderBy: {
        ...args.query?.sorting
      },
      skip: args.query?.offset,
      take: args.query?.limit
    });

    return res.map(item => new Businesses(item));
  };

  findAllBetweenCreatedAt = async (
    args: TFindAllBetweenCreatedAtArgs
  ): Promise<Businesses[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const betweenCreatedAt = args.date_from && args.date_to
      ? { created_at: { gte: new Date(args.date_from), lte: new Date(args.date_to) } }
      : undefined;
    const res = await this.client.findMany({
      select: {
        ...businessesSubsets,
        ...exclude
      },
      where: {
        ...args.condition,
        ...betweenCreatedAt,
      }
    });

    return res.map(item => new Businesses(item));
  };

  findById = async (
    args: TFindByIdArgs<number>
  ): Promise<Businesses | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...businessesSubsets,
        ...exclude
      },
      where: {
        id: args.id,
        deleted_at: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new Businesses(res);
  };

  findByName = async (
    args: TFindByNameArgs
  ): Promise<Businesses | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...businessesSubsets,
        ...exclude
      },
      where: {
        name: args.name,
        deleted_at: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new Businesses(res);
  };

  findByApiKey = async (
    args: TFindByApiKeyArgs
  ): Promise<Businesses | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...businessesSubsets,
        ...exclude
      },
      where: {
        api_key: args.api_key,
        deleted_at: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new Businesses(res);
  };

  create = async (
    args: TCreateArgs<Businesses>
  ): Promise<Businesses> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.create({
      select: {
        ...businessesSubsets,
        ...exclude
      },
      data: args.params
    });

    return new Businesses(data);
  };

  update = async (
    args: TUpdateArgs<number, Businesses>
  ): Promise<Businesses> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...businessesSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        ...args.params,
        updated_at: new Date(),
      }
    });

    return new Businesses(data);
  };

  softDelete = async (
    args: TSoftDeleteArgs<number>
  ): Promise<Businesses> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...businessesSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        deleted_at: new Date(),
      }
    });

    return new Businesses(data);
  };

  softDeleteMany = async (
    args: TSoftDeleteManyArgs<number>
  ): Promise<TGenericObject> => {
    const data = await this.client.updateMany({
      where: {
        id: {
          in: args.ids
        }
      },
      data: {
        deleted_at: new Date(),
      }
    });

    return data;
  };

  count = async (
    args?: TCountArgs
  ): Promise<number> => {
    const data = this.client.count({
      where: {
        deleted_at: null,
        ...args?.condition,
        ...parseQueryFilters(args?.query?.filters)
      }
    });

    return data;
  };
};