import { PrismaClient } from "../../prisma/client";
import OrganizationEntity from "../../entities/organization.entity";
import OrganizationRepository from "../organization.interface";
import {
  FindAllArgs,
  FindAllBetweenCreatedAtArgs,
  FindByIdArgs,
  FindByNameArgs,
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
  ): Promise<OrganizationEntity[]> => {
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

    return res.map(item => new OrganizationEntity(item));
  };

  findAllBetweenCreatedAt = async (
    args: FindAllBetweenCreatedAtArgs
  ): Promise<OrganizationEntity[]> => {
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

    return res.map(item => new OrganizationEntity(item));
  };

  findById = async (
    args: FindByIdArgs<string>
  ): Promise<OrganizationEntity | null> => {
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

    return new OrganizationEntity(res);
  };

  findByName = async (
    args: FindByNameArgs
  ): Promise<OrganizationEntity | null> => {
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

    return new OrganizationEntity(res);
  };

  create = async (
    args: CreateArgs<OrganizationEntity>
  ): Promise<OrganizationEntity> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.create({
      select: {
        ...organizationSubsets,
        ...exclude
      },
      data: args.params
    });

    return new OrganizationEntity(data);
  };

  update = async (
    args: UpdateArgs<string, OrganizationEntity>
  ): Promise<OrganizationEntity> => {
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

    return new OrganizationEntity(data);
  };

  softDelete = async (
    args: SoftDeleteArgs<string>
  ): Promise<OrganizationEntity> => {
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

    return new OrganizationEntity(data);
  };

  softDeleteMany = async (
    args: SoftDeleteManyArgs<string>
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