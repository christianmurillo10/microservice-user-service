import { PrismaClient } from "@prisma/client";
import Roles from "../models/roles.model";
import IRolesRepository from "../shared/types/repositories/roles.interface";
import {
  TFindAllArgs,
  TFindByIdArgs,
  TFindByNameArgs,
  TCreateArgs,
  TUpdateArgs,
  TSoftDeleteArgs,
  TSoftDeleteManyArgs,
  TCountArgs
} from "../shared/types/repository.type";
import { TGenericObject } from "../shared/types/common.type";
import { parseQueryFilters, setSelectExclude } from "../shared/helpers/common.helper";
import { businessesSubsets, rolesSubsets } from "../shared/helpers/select-subset.helper";

export default class RolesRepository implements IRolesRepository {
  private client;

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.roles;
  };

  findAll = async (
    args: TFindAllArgs
  ): Promise<Roles[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const businessesSelect = args.include?.includes("businesses")
      ? { businesses: { select: { ...businessesSubsets, deleted_at: false } } }
      : undefined;
    const res = await this.client.findMany({
      select: {
        ...rolesSubsets,
        ...exclude,
        ...businessesSelect
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
    args: TFindByIdArgs<number>
  ): Promise<Roles | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const businessesSelect = args.include?.includes("businesses")
      ? { businesses: { select: { ...businessesSubsets, deleted_at: false } } }
      : undefined;
    const res = await this.client.findFirst({
      select: {
        ...rolesSubsets,
        ...exclude,
        ...businessesSelect
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
    args: TFindByNameArgs
  ): Promise<Roles | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const businessesSelect = args.include?.includes("businesses")
      ? { businesses: { select: { ...businessesSubsets, deleted_at: false } } }
      : undefined;
    const res = await this.client.findFirst({
      select: {
        ...rolesSubsets,
        ...exclude,
        ...businessesSelect
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
    args: TCreateArgs<Roles>
  ): Promise<Roles> => {
    const exclude = setSelectExclude(args.exclude!);
    const businessesSelect = args.include?.includes("businesses")
      ? { businesses: { select: { ...businessesSubsets, deleted_at: false } } }
      : undefined;
    const data = await this.client.create({
      select: {
        ...rolesSubsets,
        ...exclude,
        ...businessesSelect
      },
      data: args.params
    });

    return new Roles(data);
  };

  update = async (
    args: TUpdateArgs<number, Roles>
  ): Promise<Roles> => {
    const exclude = setSelectExclude(args.exclude!);
    const businessesSelect = args.include?.includes("businesses")
      ? { businesses: { select: { ...businessesSubsets, deleted_at: false } } }
      : undefined;
    const data = await this.client.update({
      select: {
        ...rolesSubsets,
        ...exclude,
        ...businessesSelect
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
    args: TSoftDeleteArgs<number>
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

  softDeleteManyByBusinessIds = async (
    args: TSoftDeleteManyArgs<number>
  ): Promise<TGenericObject> => {
    const data = await this.client.updateMany({
      where: {
        business_id: {
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