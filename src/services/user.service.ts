import _ from "lodash";
import { MESSAGE_DATA_INCORRECT_OLD_PASSWORD, MESSAGE_DATA_NOT_EXIST, MESSAGE_DATA_SAME_NEW_PASSWORD_TO_OLD_PASSWORD } from "../shared/constants/message.constant";
import PrismaUserRepository from "../repositories/prisma/user.repository";
import UserEntity from "../entities/user.entity";
import { CountAllArgs, GetAllArgs, GetAllBetweenCreatedAtArgs } from "../shared/types/service.type";
import { comparePassword, hashedPassword } from "../shared/utils/bcrypt";
import NotFoundException from "../shared/exceptions/not-found.exception";
import BadRequestException from "../shared/exceptions/bad-request.exception";
import { setUploadPath, uploadFile } from "../shared/helpers/upload.helper";

export default class UserService {
  private repository: PrismaUserRepository;

  constructor() {
    this.repository = new PrismaUserRepository();
  };

  getAll = async (args?: GetAllArgs): Promise<UserEntity[]> => {
    const record = await this.repository.findAll({
      condition: args?.condition,
      query: args?.query,
      exclude: ["deletedAt"]
    });

    return record;
  };

  getAllBetweenCreatedAt = async (args: GetAllBetweenCreatedAtArgs): Promise<UserEntity[]> => {
    const record = await this.repository.findAllBetweenCreatedAt({
      ...args,
      exclude: ["deletedAt"]
    });

    return record;
  };

  getById = async (id: string): Promise<UserEntity> => {
    const record = await this.repository.findById({
      id: id,
      exclude: ["deletedAt"]
    });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByUsernameOrEmail = async (username: string, email: string): Promise<UserEntity> => {
    const record = await this.repository.findByUsernameOrEmail({
      username,
      email,
      exclude: ["deletedAt"]
    });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  save = async (data: UserEntity, file?: Express.Multer.File): Promise<UserEntity> => {
    const uploadPath = setUploadPath(file, this.repository.imagePath);
    const exclude = ["deletedAt"];
    let record: UserEntity;

    if (data.id) {
      // Update
      data.imagePath = uploadPath || data.imagePath || "";
      record = await this.repository.update({
        id: data.id,
        params: data,
        exclude
      });
    } else {
      // Create
      data.imagePath = uploadPath;
      data.password = hashedPassword(data.password as string);
      record = await this.repository.create({
        params: data,
        exclude
      });
    }

    if (!_.isUndefined(file) && record.imagePath) {
      uploadFile(record.imagePath, file);
    };

    return record;
  };

  delete = async (id: string): Promise<UserEntity> => {
    return await this.repository.softDelete({
      id: id,
      exclude: ["password"]
    });
  };

  deleteMany = async (ids: string[]): Promise<void> => {
    await this.repository.softDeleteMany({ ids: ids });
  };

  deleteManyByOrganizationIds = async (ids: string[]): Promise<void> => {
    await this.repository.softDeleteManyByOrganizationIds({ ids: ids });
  };

  changePassword = async (
    id: string,
    hashPassword: string,
    oldPassword: string,
    newPassword: string
  ): Promise<UserEntity> => {
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