import { PrismaClient } from "@prisma/client";
import Companies from "../entities/companies.entity";
import CompaniesRepositoryInterface from "../interfaces/repositories/companies.interface";
import {
  GenericObject,
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
} from "../types/common.type";
import { parseQueryFilters, setSelectExclude } from "../helpers/common.helper";
import { companiesSubsets } from "../helpers/select-subset.helper";


export default class CompaniesRepository implements CompaniesRepositoryInterface {
  private client;

  readonly logoPath = "public/images/companies/";

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.companies;
  };

  findAll = async (
    args: FindAllArgs
  ): Promise<Companies[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findMany({
      select: {
        ...companiesSubsets,
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

    return res.map(item => new Companies(item));
  };

  findAllBetweenCreatedAt = async (
    args: FindAllBetweenCreatedAtArgs
  ): Promise<Companies[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const betweenCreatedAt = args.date_from && args.date_to
      ? { created_at: { gte: new Date(args.date_from), lte: new Date(args.date_to) } }
      : undefined;
    const res = await this.client.findMany({
      select: {
        ...companiesSubsets,
        ...exclude
      },
      where: {
        ...args.condition,
        ...betweenCreatedAt,
      }
    });

    return res.map(item => new Companies(item));
  };

  findById = async (
    args: FindByIdArgs<number>
  ): Promise<Companies | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...companiesSubsets,
        ...exclude
      },
      where: {
        id: args.id,
        deleted_at: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new Companies(res);
  };

  findByName = async (
    args: FindByNameArgs
  ): Promise<Companies | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...companiesSubsets,
        ...exclude
      },
      where: {
        name: args.name,
        deleted_at: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new Companies(res);
  };

  findByApiKey = async (
    args: FindByApiKeyArgs
  ): Promise<Companies | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...companiesSubsets,
        ...exclude
      },
      where: {
        api_key: args.api_key,
        deleted_at: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new Companies(res);
  };

  create = async (
    args: CreateArgs<Companies>
  ): Promise<Companies> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.create({
      select: {
        ...companiesSubsets,
        ...exclude
      },
      data: args.params
    });

    return new Companies(data);
  };

  update = async (
    args: UpdateArgs<number, Companies>
  ): Promise<Companies> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...companiesSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        ...args.params,
        updated_at: new Date(),
      }
    });

    return new Companies(data);
  };

  softDelete = async (
    args: SoftDeleteArgs<number>
  ): Promise<Companies> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...companiesSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        deleted_at: new Date(),
      }
    });

    return new Companies(data);
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
        deleted_at: new Date(),
      }
    });

    return data;
  };

  count = async (
    args?: CountArgs
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