import { PrismaClient } from "@prisma/client";
import Users from "../entities/users.entity";
import UsersRepositoryInterface from "../shared/types/repositories/users.interface";
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
} from "../shared/types/repository.type";
import { GenericObject } from "../shared/types/common.type";
import { parseQueryFilters, setSelectExclude } from "../shared/helpers/common.helper";
import { usersSubsets, rolesSubsets, businessesSubsets } from "../shared/helpers/select-subset.helper";
import { AccessType } from "../models/users.model";

export default class UsersRepository implements UsersRepositoryInterface {
  private client;

  readonly imagePath = "public/images/users/";

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.users;
  };

  findAll = async (
    args: FindAllArgs
  ): Promise<Users[]> => {
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

    return res.map(item => new Users({
      ...item,
      access_type: item.access_type as AccessType
    }));
  };

  findAllBetweenCreatedAt = async (
    args: FindAllBetweenCreatedAtArgs
  ): Promise<Users[]> => {
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

    return res.map(item => new Users({
      ...item,
      access_type: item.access_type as AccessType
    }));
  };

  findById = async (
    args: FindByIdArgs<string>
  ): Promise<Users | null> => {
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

    return new Users({
      ...res,
      access_type: res.access_type as AccessType
    });
  };

  findByUsernameOrEmail = async (
    args: FindByUsernameOrEmailArgs
  ): Promise<Users | null> => {
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

    return new Users({
      ...res,
      access_type: res.access_type as AccessType
    });
  };

  create = async (
    args: CreateArgs<Users>
  ): Promise<Users> => {
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

    return new Users({
      ...data,
      access_type: data.access_type as AccessType
    });
  };

  update = async (
    args: UpdateArgs<string, Users>
  ): Promise<Users> => {
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

    return new Users({
      ...data,
      access_type: data.access_type as AccessType
    });
  };

  softDelete = async (
    args: SoftDeleteArgs<string>
  ): Promise<Users> => {
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

    return new Users({
      ...data,
      access_type: data.access_type as AccessType
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