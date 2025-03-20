import { PrismaClient } from "@prisma/client";
import Roles from "../entities/roles.entity";
import RolesRepositoryInterface from "../types/repositories/roles.interface";
import {
  FindAllArgs,
  FindByIdArgs,
  FindByNameArgs,
  CreateArgs,
  UpdateArgs,
  SoftDeleteArgs,
  SoftDeleteManyArgs,
  CountArgs
} from "../types/repository.type";
import { GenericObject } from "../types/common.type";
import { parseQueryFilters, setSelectExclude } from "../helpers/common.helper";
import { companiesSubsets, rolesSubsets } from "../helpers/select-subset.helper";

export default class RolesRepository implements RolesRepositoryInterface {
  private client;

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.roles;
  };

  findAll = async (
    args: FindAllArgs
  ): Promise<Roles[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const companiesSelect = args.include?.includes("companies")
      ? { companies: { select: { ...companiesSubsets, deleted_at: false } } }
      : undefined;
    const res = await this.client.findMany({
      select: {
        ...rolesSubsets,
        ...exclude,
        ...companiesSelect
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

    return res.map(item => new Roles(item));
  };

  findById = async (
    args: FindByIdArgs<number>
  ): Promise<Roles | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const companiesSelect = args.include?.includes("companies")
      ? { companies: { select: { ...companiesSubsets, deleted_at: false } } }
      : undefined;
    const res = await this.client.findFirst({
      select: {
        ...rolesSubsets,
        ...exclude,
        ...companiesSelect
      },
      where: {
        id: args.id,
        deleted_at: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new Roles(res);
  };

  findByName = async (
    args: FindByNameArgs
  ): Promise<Roles | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const companiesSelect = args.include?.includes("companies")
      ? { companies: { select: { ...companiesSubsets, deleted_at: false } } }
      : undefined;
    const res = await this.client.findFirst({
      select: {
        ...rolesSubsets,
        ...exclude,
        ...companiesSelect
      },
      where: {
        name: args.name,
        deleted_at: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new Roles(res);
  };

  create = async (
    args: CreateArgs<Roles>
  ): Promise<Roles> => {
    const exclude = setSelectExclude(args.exclude!);
    const companiesSelect = args.include?.includes("companies")
      ? { companies: { select: { ...companiesSubsets, deleted_at: false } } }
      : undefined;
    const data = await this.client.create({
      select: {
        ...rolesSubsets,
        ...exclude,
        ...companiesSelect
      },
      data: args.params
    });

    return new Roles(data);
  };

  update = async (
    args: UpdateArgs<number, Roles>
  ): Promise<Roles> => {
    const exclude = setSelectExclude(args.exclude!);
    const companiesSelect = args.include?.includes("companies")
      ? { companies: { select: { ...companiesSubsets, deleted_at: false } } }
      : undefined;
    const data = await this.client.update({
      select: {
        ...rolesSubsets,
        ...exclude,
        ...companiesSelect
      },
      where: { id: args.id },
      data: {
        ...args.params,
        updated_at: new Date(),
      }
    });

    return new Roles(data);
  };

  softDelete = async (
    args: SoftDeleteArgs<number>
  ): Promise<Roles> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...rolesSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        deleted_at: new Date(),
      }
    });

    return new Roles(data);
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

  softDeleteManyByCompanyIds = async (
    args: SoftDeleteManyArgs<number>
  ): Promise<GenericObject> => {
    const data = await this.client.updateMany({
      where: {
        company_id: {
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