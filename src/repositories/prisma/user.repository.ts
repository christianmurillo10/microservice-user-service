import { PrismaClient } from "@prisma/client";
import UserModel from "../../models/user.model";
import UserRepository from "../user.interface";
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
import { userSubsets, organizationSubsets } from "../../shared/helpers/select-subset.helper";
import { UserAccessTypeValue } from "../../entities/user.entity";

export default class PrismaUserRepository implements UserRepository {
  private client;

  readonly imagePath = "public/images/user/";

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.user;
  };

  findAll = async (
    args: FindAllArgs
  ): Promise<UserModel[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const organizationSelect = args.include?.includes("organization")
      ? { organization: { select: { ...organizationSubsets, deletedAt: false } } }
      : undefined;
    const res = await this.client.findMany({
      select: {
        ...userSubsets,
        ...exclude,
        ...organizationSelect
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

    return res.map(item => new UserModel({
      ...item,
      accessType: item.accessType as UserAccessTypeValue
    }));
  };

  findAllBetweenCreatedAt = async (
    args: FindAllBetweenCreatedAtArgs
  ): Promise<UserModel[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const organizationSelect = args.include?.includes("organization")
      ? { organization: { select: { ...organizationSubsets, deletedAt: false } } }
      : undefined;
    const betweenCreatedAt = args.dateFrom && args.dateTo
      ? { createdAt: { gte: new Date(args.dateFrom), lte: new Date(args.dateTo) } }
      : undefined;
    const res = await this.client.findMany({
      select: {
        ...userSubsets,
        ...exclude,
        ...organizationSelect
      },
      where: {
        ...args.condition,
        ...betweenCreatedAt,
      }
    });

    return res.map(item => new UserModel({
      ...item,
      accessType: item.accessType as UserAccessTypeValue
    }));
  };

  findById = async (
    args: FindByIdArgs<string>
  ): Promise<UserModel | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const organizationSelect = args.include?.includes("organization")
      ? { organization: { select: { ...organizationSubsets, deletedAt: false } } }
      : undefined;
    const res = await this.client.findFirst({
      select: {
        ...userSubsets,
        ...exclude,
        ...organizationSelect
      },
      where: {
        id: args.id,
        deletedAt: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new UserModel({
      ...res,
      accessType: res.accessType as UserAccessTypeValue
    });
  };

  findByUsernameOrEmail = async (
    args: FindByUsernameOrEmailArgs
  ): Promise<UserModel | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const organizationSelect = args.include?.includes("organization")
      ? { organization: { select: { ...organizationSubsets, deletedAt: false } } }
      : undefined;
    const res = await this.client.findFirst({
      select: {
        ...userSubsets,
        ...exclude,
        ...organizationSelect
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

    return new UserModel({
      ...res,
      accessType: res.accessType as UserAccessTypeValue
    });
  };

  create = async (
    args: CreateArgs<UserModel>
  ): Promise<UserModel> => {
    const exclude = setSelectExclude(args.exclude!);
    const organizationSelect = args.include?.includes("organization")
      ? { organization: { select: { ...organizationSubsets, deletedAt: false } } }
      : undefined;
    const data = await this.client.create({
      select: {
        ...userSubsets,
        ...exclude,
        ...organizationSelect
      },
      data: args.params
    });

    return new UserModel({
      ...data,
      accessType: data.accessType as UserAccessTypeValue
    });
  };

  update = async (
    args: UpdateArgs<string, UserModel>
  ): Promise<UserModel> => {
    const exclude = setSelectExclude(args.exclude!);
    const organizationSelect = args.include?.includes("organization")
      ? { organization: { select: { ...organizationSubsets, deletedAt: false } } }
      : undefined;
    const data = await this.client.update({
      select: {
        ...userSubsets,
        ...exclude,
        ...organizationSelect
      },
      where: { id: args.id },
      data: {
        ...args.params,
        updatedAt: new Date(),
      }
    });

    return new UserModel({
      ...data,
      accessType: data.accessType as UserAccessTypeValue
    });
  };

  softDelete = async (
    args: SoftDeleteArgs<string>
  ): Promise<UserModel> => {
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

    return new UserModel({
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
    args: SoftDeleteManyArgs<number>
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
  ): Promise<UserModel> => {
    const data = await this.client.update({
      where: { id: args.id },
      data: {
        password: args.newPassword,
        updatedAt: new Date(),
      }
    });

    return new UserModel({
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