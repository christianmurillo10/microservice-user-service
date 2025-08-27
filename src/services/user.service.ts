import _ from "lodash";
import { MESSAGE_DATA_INCORRECT_OLD_PASSWORD, MESSAGE_DATA_NOT_EXIST, MESSAGE_DATA_SAME_NEW_PASSWORD_TO_OLD_PASSWORD } from "../shared/constants/message.constant";
import PrismaUserRepository from "../repositories/prisma/user.repository";
import UserModel from "../models/user.model";
import { CountAllArgs, GetAllArgs, GetAllBetweenCreatedAtArgs, GetByIdArgs, GetByUsernameOrEmailArgs } from "../shared/types/service.type";
import { comparePassword, hashedPassword } from "../shared/utils/bcrypt";
import NotFoundException from "../shared/exceptions/not-found.exception";
import BadRequestException from "../shared/exceptions/bad-request.exception";
import { setUploadPath, uploadFile } from "../shared/helpers/upload.helper";

export default class UserService {
  private repository: PrismaUserRepository;

  constructor() {
    this.repository = new PrismaUserRepository();
  };

  getAll = async (args?: GetAllArgs): Promise<UserModel[]> => {
    const record = await this.repository.findAll({
      condition: args?.condition,
      query: args?.query,
      // include: ["organization"],
      exclude: ["deletedAt"]
    });

    return record;
  };

  getAllBetweenCreatedAt = async (args: GetAllBetweenCreatedAtArgs): Promise<UserModel[]> => {
    const record = await this.repository.findAllBetweenCreatedAt({
      ...args,
      // include: ["organization"],
      exclude: ["deletedAt"]
    });

    return record;
  };

  getById = async (args: GetByIdArgs<string>): Promise<UserModel> => {
    const record = await this.repository.findById({
      id: args.id,
      condition: args?.condition,
      // include: ["organization"],
      exclude: ["deletedAt"]
    });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByUsernameOrEmail = async (args: GetByUsernameOrEmailArgs): Promise<UserModel> => {
    const record = await this.repository.findByUsernameOrEmail({
      username: args.username,
      email: args.email,
      // include: ["organization"],
      exclude: ["deletedAt"]
    });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  save = async (data: UserModel, file?: Express.Multer.File): Promise<UserModel> => {
    const uploadPath = setUploadPath(file, this.repository.imagePath);
    let record: UserModel;
    let newData = new UserModel(data);
    let option = {
      params: newData,
      // include: ["organization"],
      exclude: ["deletedAt"]
    };

    if (data.id) {
      // Update
      option.params.imagePath = uploadPath || data.imagePath || ""
      record = await this.repository.update({
        id: data.id,
        ...option
      });
    } else {
      // Create
      option.params.imagePath = uploadPath;
      option.params.password = hashedPassword(option.params.password as string);
      record = await this.repository.create(option);
    }

    if (!_.isUndefined(file) && record.imagePath) {
      uploadFile(record.imagePath, file);
    };

    return record;
  };

  delete = async (id: string): Promise<UserModel> => {
    return await this.repository.softDelete({
      id: id,
      exclude: ["password"]
    });
  };

  deleteMany = async (ids: string[]): Promise<void> => {
    await this.repository.softDeleteMany({ ids: ids });
  };

  deleteManyByOrganizationIds = async (ids: number[]): Promise<void> => {
    await this.repository.softDeleteManyByOrganizationIds({ ids: ids });
  };

  changePassword = async (
    id: string,
    hashPassword: string,
    oldPassword: string,
    newPassword: string
  ): Promise<UserModel> => {
    const compareOldPassword = comparePassword(oldPassword, hashPassword);

    if (!compareOldPassword) {
      throw new BadRequestException([MESSAGE_DATA_INCORRECT_OLD_PASSWORD]);
    };

    const compareNewPassword = comparePassword(newPassword, hashPassword);

    if (compareNewPassword) {
      throw new BadRequestException([MESSAGE_DATA_SAME_NEW_PASSWORD_TO_OLD_PASSWORD]);
    };

    return await this.repository.changePassword({
      id: id,
      newPassword: hashedPassword(newPassword)
    });
  };

  count = async (args: CountAllArgs): Promise<number> => {
    return this.repository.count(args);
  };
};