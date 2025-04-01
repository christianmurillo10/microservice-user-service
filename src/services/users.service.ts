import _ from "lodash";
import { MESSAGE_DATA_INCORRECT_OLD_PASSWORD, MESSAGE_DATA_NOT_EXIST, MESSAGE_DATA_SAME_NEW_PASSWORD_TO_OLD_PASSWORD } from "../shared/constants/message.constant";
import UsersRepository from "../repositories/users.repository";
import Users from "../entities/users.entity";
import { CountAllArgs, GetAllArgs, GetAllBetweenCreatedAtArgs, GetByIdArgs, GetByUsernameOrEmailArgs } from "../shared/types/service.type";
import { comparePassword, hashPassword } from "../shared/utils/bcrypt";
import NotFoundException from "../shared/exceptions/not-found.exception";
import BadRequestException from "../shared/exceptions/bad-request.exception";
import { setUploadPath, uploadFile } from "../shared/helpers/upload.helper";

export default class UsersService {
  private repository: UsersRepository;

  constructor() {
    this.repository = new UsersRepository();
  };

  getAll = async (args?: GetAllArgs): Promise<Users[]> => {
    const record = await this.repository.findAll({
      condition: args?.condition,
      query: args?.query,
      // include: ["roles", "businesses"],
      exclude: ["deleted_at"]
    });

    return record;
  };

  getAllBetweenCreatedAt = async (args: GetAllBetweenCreatedAtArgs): Promise<Users[]> => {
    const record = await this.repository.findAllBetweenCreatedAt({
      ...args,
      // include: ["roles", "businesses"],
      exclude: ["deleted_at"]
    });

    return record;
  };

  getById = async (args: GetByIdArgs<string>): Promise<Users> => {
    const record = await this.repository.findById({
      id: args.id,
      condition: args?.condition,
      // include: ["roles", "businesses"],
      exclude: ["deleted_at"]
    });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByUsernameOrEmail = async (args: GetByUsernameOrEmailArgs): Promise<Users> => {
    const record = await this.repository.findByUsernameOrEmail({
      username: args.username,
      email: args.email,
      // include: ["roles", "businesses"],
      exclude: ["deleted_at"]
    });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  save = async (data: Users, file?: Express.Multer.File): Promise<Users> => {
    const uploadPath = setUploadPath(file, this.repository.imagePath);
    let record: Users;
    let newData = new Users(data);
    let option = {
      params: newData,
      // include: ["roles", "businesses"],
      exclude: ["deleted_at"]
    };

    if (data.id) {
      // Update
      option.params.image_path = uploadPath || data.image_path || ""
      record = await this.repository.update({
        id: data.id,
        ...option
      });
    } else {
      // Create
      option.params.image_path = uploadPath;
      option.params.password = hashPassword(option.params.password as string);
      record = await this.repository.create(option);
    }

    if (!_.isUndefined(file) && record.image_path) {
      uploadFile(record.image_path, file);
    };

    return record;
  };

  delete = async (id: string): Promise<Users> => {
    return await this.repository.softDelete({
      id: id,
      exclude: ["password"]
    });
  };

  deleteMany = async (ids: string[]): Promise<void> => {
    await this.repository.softDeleteMany({ ids: ids });
  };

  deleteManyByBusinessIds = async (ids: number[]): Promise<void> => {
    await this.repository.softDeleteManyByBusinessIds({ ids: ids });
  };

  changePassword = async (
    id: string,
    hash_password: string,
    old_password: string,
    new_password: string
  ): Promise<void> => {
    const compareOldPassword = comparePassword(old_password, hash_password);

    if (!compareOldPassword) {
      throw new BadRequestException([MESSAGE_DATA_INCORRECT_OLD_PASSWORD]);
    };

    const compareNewPassword = comparePassword(new_password, hash_password);

    if (compareNewPassword) {
      throw new BadRequestException([MESSAGE_DATA_SAME_NEW_PASSWORD_TO_OLD_PASSWORD]);
    };

    await this.repository.changePassword({
      id: id,
      new_password: hashPassword(new_password)
    });
  };

  count = async (args: CountAllArgs): Promise<number> => {
    return this.repository.count(args);
  };
};