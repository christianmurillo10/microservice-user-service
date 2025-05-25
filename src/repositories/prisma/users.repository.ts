import { PrismaClient } from "@prisma/client";
import UsersModel from "../../models/users.model";
import UsersRepository from "../users.interface";
import {
  FindAllArgs,
  FindAllBetweenCreatedAtArgs,
  FindByIdArgs,
  FindByUsernameOrEmailArgs,
  CreateArgs,
  UpdateArgs,
  SoftDeleteArgs,
  SoftDeleteManyArgs,
  ChangePasswordArgs,
  CountArgs
} from "../../shared/types/repository.type";
import { GenericObject } from "../../shared/types/common.type";
import { parseQueryFilters, setSelectExclude } from "../../shared/helpers/common.helper";
import { usersSubsets, rolesSubsets, businessesSubsets } from "../../shared/helpers/select-subset.helper";
import { UsersAccessTypeValue } from "../../entities/users.entity";

export default class PrismaUsersRepository implements UsersRepository {
  private client;

  readonly imagePath = "public/images/users/";

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.users;
  };

  findAll = async (
    args: FindAllArgs
  ): Promise<UsersModel[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const rolesSelect = args.include?.includes("roles")
      ? { roles: { select: { ...rolesSubsets, deleted_at: false, business_id: false } } }
      : undefined;
    const businessesSelect = args.include?.includes("businesses")
      ? { businesses: { select: { ...businessesSubsets, deleted_at: false } } }
      : undefined;
    const res = await this.client.findMany({
      select: {
        ...usersSubsets,
        ...exclude,
        ...rolesSelect,
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

    return res.map(item => new UsersModel({
      ...item,
      access_type: item.access_type as UsersAccessTypeValue
    }));
  };

  findAllBetweenCreatedAt = async (
    args: FindAllBetweenCreatedAtArgs
  ): Promise<UsersModel[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const rolesSelect = args.include?.includes("roles")
      ? { roles: { select: { ...rolesSubsets, deleted_at: false, business_id: false } } }
      : undefined;
    const businessesSelect = args.include?.includes("businesses")
      ? { businesses: { select: { ...businessesSubsets, deleted_at: false } } }
      : undefined;
    const betweenCreatedAt = args.date_from && args.date_to
      ? { created_at: { gte: new Date(args.date_from), lte: new Date(args.date_to) } }
      : undefined;
    const res = await this.client.findMany({
      select: {
        ...usersSubsets,
        ...exclude,
        ...rolesSelect,
        ...businessesSelect
      },
      where: {
        ...args.condition,
        ...betweenCreatedAt,
      }
    });

    return res.map(item => new UsersModel({
      ...item,
      access_type: item.access_type as UsersAccessTypeValue
    }));
  };

  findById = async (
    args: FindByIdArgs<string>
  ): Promise<UsersModel | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const rolesSelect = args.include?.includes("roles")
      ? { roles: { select: { ...rolesSubsets, deleted_at: false, business_id: false } } }
      : undefined;
    const businessesSelect = args.include?.includes("businesses")
      ? { businesses: { select: { ...businessesSubsets, deleted_at: false } } }
      : undefined;
    const res = await this.client.findFirst({
      select: {
        ...usersSubsets,
        ...exclude,
        ...rolesSelect,
        ...businessesSelect
      },
      where: {
        id: args.id,
        deleted_at: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new UsersModel({
      ...res,
      access_type: res.access_type as UsersAccessTypeValue
    });
  };

  findByUsernameOrEmail = async (
    args: FindByUsernameOrEmailArgs
  ): Promise<UsersModel | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const rolesSelect = args.include?.includes("roles")
      ? { roles: { select: { ...rolesSubsets, deleted_at: false, business_id: false } } }
      : undefined;
    const businessesSelect = args.include?.includes("businesses")
      ? { businesses: { select: { ...businessesSubsets, deleted_at: false } } }
      : undefined;
    const res = await this.client.findFirst({
      select: {
        ...usersSubsets,
        ...exclude,
        ...rolesSelect,
        ...businessesSelect
      },
      where: {
        OR: [
          {
            username: {
              equals: args.username,
            },
          },
          {
            email: {
              equals: args.email,
            },
          },
        ],
        deleted_at: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new UsersModel({
      ...res,
      access_type: res.access_type as UsersAccessTypeValue
    });
  };

  create = async (
    args: CreateArgs<UsersModel>
  ): Promise<UsersModel> => {
    const exclude = setSelectExclude(args.exclude!);
    const rolesSelect = args.include?.includes("roles")
      ? { roles: { select: { ...rolesSubsets, deleted_at: false, business_id: false } } }
      : undefined;
    const businessesSelect = args.include?.includes("businesses")
      ? { businesses: { select: { ...businessesSubsets, deleted_at: false } } }
      : undefined;
    const data = await this.client.create({
      select: {
        ...usersSubsets,
        ...exclude,
        ...rolesSelect,
        ...businessesSelect
      },
      data: args.params
    });

    return new UsersModel({
      ...data,
      access_type: data.access_type as UsersAccessTypeValue
    });
  };

  update = async (
    args: UpdateArgs<string, UsersModel>
  ): Promise<UsersModel> => {
    const exclude = setSelectExclude(args.exclude!);
    const rolesSelect = args.include?.includes("roles")
      ? { roles: { select: { ...rolesSubsets, deleted_at: false, business_id: false } } }
      : undefined;
    const businessesSelect = args.include?.includes("businesses")
      ? { businesses: { select: { ...businessesSubsets, deleted_at: false } } }
      : undefined;
    const data = await this.client.update({
      select: {
        ...usersSubsets,
        ...exclude,
        ...rolesSelect,
        ...businessesSelect
      },
      where: { id: args.id },
      data: {
        ...args.params,
        updated_at: new Date(),
      }
    });

    return new UsersModel({
      ...data,
      access_type: data.access_type as UsersAccessTypeValue
    });
  };

  softDelete = async (
    args: SoftDeleteArgs<string>
  ): Promise<UsersModel> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...usersSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        deleted_at: new Date(),
      }
    });

    return new UsersModel({
      ...data,
      access_type: data.access_type as UsersAccessTypeValue
    });
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
        deleted_at: new Date(),
      }
    });

    return data;
  };

  softDeleteManyByBusinessIds = async (
    args: SoftDeleteManyArgs<number>
  ): Promise<GenericObject> => {
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

  changePassword = async (
    args: ChangePasswordArgs<string>
  ): Promise<void> => {
    await this.client.update({
      where: { id: args.id },
      data: {
        password: args.new_password,
        updated_at: new Date(),
      }
    });
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