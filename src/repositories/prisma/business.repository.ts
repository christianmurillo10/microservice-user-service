import { PrismaClient } from "@prisma/client";
import OrganizationModel from "../../models/organization.model";
import OrganizationRepository from "../organization.interface";
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
import { organizationSubsets } from "../../shared/helpers/select-subset.helper";

export default class PrismaOrganizationRepository implements OrganizationRepository {
  private client;

  readonly logoPath = "public/images/organization/";

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.organization;
  };

  findAll = async (
    args: FindAllArgs
  ): Promise<OrganizationModel[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findMany({
      select: {
        ...organizationSubsets,
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

    return res.map(item => new OrganizationModel(item));
  };

  findAllBetweenCreatedAt = async (
    args: FindAllBetweenCreatedAtArgs
  ): Promise<OrganizationModel[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const betweenCreatedAt = args.dateFrom && args.dateTo
      ? { createdAt: { gte: new Date(args.dateFrom), lte: new Date(args.dateTo) } }
      : undefined;
    const res = await this.client.findMany({
      select: {
        ...organizationSubsets,
        ...exclude
      },
      where: {
        ...args.condition,
        ...betweenCreatedAt,
      }
    });

    return res.map(item => new OrganizationModel(item));
  };

  findById = async (
    args: FindByIdArgs<number>
  ): Promise<OrganizationModel | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...organizationSubsets,
        ...exclude
      },
      where: {
        id: args.id,
        deletedAt: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new OrganizationModel(res);
  };

  findByName = async (
    args: FindByNameArgs
  ): Promise<OrganizationModel | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...organizationSubsets,
        ...exclude
      },
      where: {
        name: args.name,
        deletedAt: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new OrganizationModel(res);
  };

  findByApiKey = async (
    args: FindByApiKeyArgs
  ): Promise<OrganizationModel | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...organizationSubsets,
        ...exclude
      },
      where: {
        apiKey: args.apiKey,
        deletedAt: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new OrganizationModel(res);
  };

  create = async (
    args: CreateArgs<OrganizationModel>
  ): Promise<OrganizationModel> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.create({
      select: {
        ...organizationSubsets,
        ...exclude
      },
      data: args.params
    });

    return new OrganizationModel(data);
  };

  update = async (
    args: UpdateArgs<number, OrganizationModel>
  ): Promise<OrganizationModel> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...organizationSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        ...args.params,
        updatedAt: new Date(),
      }
    });

    return new OrganizationModel(data);
  };

  softDelete = async (
    args: SoftDeleteArgs<number>
  ): Promise<OrganizationModel> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...organizationSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        deletedAt: new Date(),
      }
    });

    return new OrganizationModel(data);
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