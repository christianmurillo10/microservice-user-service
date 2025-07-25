import _ from "lodash";
import { MESSAGE_DATA_NOT_EXIST } from "../shared/constants/message.constant";
import PrismaBusinessRepository from "../repositories/prisma/business.repository";
import PrismaUserRepository from "../repositories/prisma/user.repository";
import BusinessModel from "../models/business.model";
import NotFoundException from "../shared/exceptions/not-found.exception";
import { CountAllArgs, GetAllArgs, GetAllBetweenCreatedAtArgs } from "../shared/types/service.type";
import { setUploadPath, uploadFile } from "../shared/helpers/upload.helper";

export default class BusinessService {
  private repository: PrismaBusinessRepository;

  constructor() {
    this.repository = new PrismaBusinessRepository();
  };

  getAll = async (args?: GetAllArgs): Promise<BusinessModel[]> => {
    const record = await this.repository.findAll({
      condition: args?.condition,
      query: args?.query,
      exclude: ["deletedAt"]
    });

    return record;
  };

  getAllBetweenCreatedAt = async (args: GetAllBetweenCreatedAtArgs): Promise<BusinessModel[]> => {
    const record = await this.repository.findAllBetweenCreatedAt({
      ...args,
      exclude: ["deletedAt"]
    });

    return record;
  };

  getById = async (id: number): Promise<BusinessModel> => {
    const record = await this.repository.findById({ id: id });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByName = async (name: string): Promise<BusinessModel> => {
    const record = await this.repository.findByName({ name: name });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByApiKey = async (apiKey: string): Promise<BusinessModel> => {
    const record = await this.repository.findByApiKey({ apiKey: apiKey });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  save = async (data: BusinessModel, file?: Express.Multer.File): Promise<BusinessModel> => {
    const uploadPath = setUploadPath(file, this.repository.logoPath);
    let record: BusinessModel;
    let newData = new BusinessModel(data);
    let option = {
      params: newData,
      exclude: ["deletedAt"]
    };

    if (data.id) {
      // Update
      option.params.logoPath = uploadPath || data.logoPath || ""
      record = await this.repository.update({
        id: data.id,
        ...option
      });
    } else {
      // Create
      option.params.logoPath = uploadPath;
      record = await this.repository.create(option);
    }

    if (!_.isUndefined(file) && record.logoPath) {
      uploadFile(record.logoPath, file);
    };

    return record;
  };

  delete = async (id: number): Promise<BusinessModel> => {
    const userRepository = new PrismaUserRepository();
    const record = await this.repository.softDelete({ id: id });
    await userRepository.softDeleteManyByBusinessIds({ ids: [id] });
    return record
  };

  deleteMany = async (ids: number[]): Promise<void> => {
    const userRepository = new PrismaUserRepository();
    await this.repository.softDeleteMany({ ids: ids });
    await userRepository.softDeleteManyByBusinessIds({ ids: ids });
  };

  count = async (args: CountAllArgs): Promise<number> => {
    return await this.repository.count(args);
  };
};