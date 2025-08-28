import { PrismaClient } from "../../prisma/client";
import UserEntity from "../../entities/user.entity";
import UserRepository from "../user.interface";
import {
  FindAllArgs,
  FindAllByBetweenCreatedAtArgs,
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
import { userSubsets } from "../../shared/helpers/select-subset.helper";
import { UserAccessTypeValue } from "../../models/user.model";

export default class PrismaUserRepository implements UserRepository {
  private client;

  readonly imagePath = "public/images/user/";

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.user;
  };

  findAll = async (
    args: FindAllArgs
  ): Promise<UserEntity[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findMany({
      select: {
        ...userSubsets,
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

    return res.map(item => new UserEntity({
      ...item,
      accessType: item.accessType as UserAccessTypeValue
    }));
  };

  findAllBetweenCreatedAt = async (
    args: FindAllByBetweenCreatedAtArgs
  ): Promise<UserEntity[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const betweenCreatedAt = args.dateFrom && args.dateTo
      ? { createdAt: { gte: new Date(args.dateFrom), lte: new Date(args.dateTo) } }
      : undefined;
    const res = await this.client.findMany({
      select: {
        ...userSubsets,
        ...exclude
      },
      where: {
        ...args.condition,
        ...betweenCreatedAt,
      }
    });

    return res.map(item => new UserEntity({
      ...item,
      accessType: item.accessType as UserAccessTypeValue
    }));
  };

  findById = async (
    args: FindByIdArgs<string>
  ): Promise<UserEntity | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...userSubsets,
        ...exclude
      },
      where: {
        id: args.id,
        deletedAt: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new UserEntity({
      ...res,
      accessType: res.accessType as UserAccessTypeValue
    });
  };

  findByUsernameOrEmail = async (
    args: FindByUsernameOrEmailArgs
  ): Promise<UserEntity | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...userSubsets,
        ...exclude
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
        deletedAt: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new UserEntity({
      ...res,
      accessType: res.accessType as UserAccessTypeValue
    });
  };

  create = async (
    args: CreateArgs<UserEntity>
  ): Promise<UserEntity> => {
    const { organization, ...params } = args.params;
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.create({
      select: {
        ...userSubsets,
        ...exclude
      },
      data: params
    });

    return new UserEntity({
      ...data,
      accessType: data.accessType as UserAccessTypeValue
    });
  };

  update = async (
    args: UpdateArgs<string, UserEntity>
  ): Promise<UserEntity> => {
    const { organization, ...params } = args.params;
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...userSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        ...params,
        updatedAt: new Date(),
      }
    });

    return new UserEntity({
      ...data,
      accessType: data.accessType as UserAccessTypeValue
    });
  };

  softDelete = async (
    args: SoftDeleteArgs<string>
  ): Promise<UserEntity> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...userSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        deletedAt: new Date(),
      }
    });

    return new UserEntity({
      ...data,
      accessType: data.accessType as UserAccessTypeValue
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
        deletedAt: new Date(),
      }
    });

    return data;
  };

  softDeleteManyByOrganizationIds = async (
    args: SoftDeleteManyArgs<string>
  ): Promise<GenericObject> => {
    const data = await this.client.updateMany({
      where: {
        organizationId: {
          in: args.ids
        }
      },
      data: {
        deletedAt: new Date(),
      }
    });

    return data;
  };

  changePassword = async (
    args: ChangePasswordArgs<string>
  ): Promise<UserEntity> => {
    const data = await this.client.update({
      where: { id: args.id },
      data: {
        password: args.newPassword,
        updatedAt: new Date(),
      }
    });

    return new UserEntity({
      ...data,
      accessType: data.accessType as UserAccessTypeValue
    });
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