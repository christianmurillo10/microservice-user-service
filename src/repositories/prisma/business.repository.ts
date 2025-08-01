import { PrismaClient } from "@prisma/client";
import BusinessModel from "../../models/business.model";
import BusinessRepository from "../business.interface";
import {
  FindAllArgs,
  FindAllBetweenCreatedAtArgs,
  FindByIdArgs,
  FindByNameArgs,
  FindByApiKeyArgs,
  CreateArgs,
  UpdateArgs,
  SoftDeleteArgs,
  SoftDeleteManyArgs,
  CountArgs
} from "../../shared/types/repository.type";
import { GenericObject } from "../../shared/types/common.type";
import { parseQueryFilters, setSelectExclude } from "../../shared/helpers/common.helper";
import { businessSubsets } from "../../shared/helpers/select-subset.helper";

export default class PrismaBusinessRepository implements BusinessRepository {
  private client;

  readonly logoPath = "public/images/business/";

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.business;
  };

  findAll = async (
    args: FindAllArgs
  ): Promise<BusinessModel[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findMany({
      select: {
        ...businessSubsets,
        ...exclude
      },
      where: {
        deletedAt: null,
        ...args.condition,
        ...parseQueryFilters(args.query?.filters)
      },
      orderBy: {
        ...args.query?.sorting
      },
      take: args.query?.pageSize,
      skip: args.query?.page && args.query?.pageSize ?
        (args.query?.page - 1) * args.query?.pageSize :
        undefined
    });

    return res.map(item => new BusinessModel(item));
  };

  findAllBetweenCreatedAt = async (
    args: FindAllBetweenCreatedAtArgs
  ): Promise<BusinessModel[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const betweenCreatedAt = args.dateFrom && args.dateTo
      ? { createdAt: { gte: new Date(args.dateFrom), lte: new Date(args.dateTo) } }
      : undefined;
    const res = await this.client.findMany({
      select: {
        ...businessSubsets,
        ...exclude
      },
      where: {
        ...args.condition,
        ...betweenCreatedAt,
      }
    });

    return res.map(item => new BusinessModel(item));
  };

  findById = async (
    args: FindByIdArgs<number>
  ): Promise<BusinessModel | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...businessSubsets,
        ...exclude
      },
      where: {
        id: args.id,
        deletedAt: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new BusinessModel(res);
  };

  findByName = async (
    args: FindByNameArgs
  ): Promise<BusinessModel | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...businessSubsets,
        ...exclude
      },
      where: {
        name: args.name,
        deletedAt: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new BusinessModel(res);
  };

  findByApiKey = async (
    args: FindByApiKeyArgs
  ): Promise<BusinessModel | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...businessSubsets,
        ...exclude
      },
      where: {
        apiKey: args.apiKey,
        deletedAt: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new BusinessModel(res);
  };

  create = async (
    args: CreateArgs<BusinessModel>
  ): Promise<BusinessModel> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.create({
      select: {
        ...businessSubsets,
        ...exclude
      },
      data: args.params
    });

    return new BusinessModel(data);
  };

  update = async (
    args: UpdateArgs<number, BusinessModel>
  ): Promise<BusinessModel> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...businessSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        ...args.params,
        updatedAt: new Date(),
      }
    });

    return new BusinessModel(data);
  };

  softDelete = async (
    args: SoftDeleteArgs<number>
  ): Promise<BusinessModel> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...businessSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        deletedAt: new Date(),
      }
    });

    return new BusinessModel(data);
  };

  softDeleteMany = async (
    args: SoftDeleteManyArgs<number>
  ): Promise<GenericObject> => {
    const data = await this.client.updateMany({
      where: {
        id: {
          in: args.ids
        }
      },
      data: {
        deletedAt: new Date(),
      }
    });

    return data;
  };

  count = async (
    args?: CountArgs
  ): Promise<number> => {
    const data = this.client.count({
      where: {
        deletedAt: null,
        ...args?.condition,
        ...parseQueryFilters(args?.query?.filters)
      }
    });

    return data;
  };
};