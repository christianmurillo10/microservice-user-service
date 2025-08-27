import _ from "lodash";
import { MESSAGE_DATA_NOT_EXIST } from "../shared/constants/message.constant";
import PrismaOrganizationRepository from "../repositories/prisma/organization.repository";
import PrismaUserRepository from "../repositories/prisma/user.repository";
import OrganizationModel from "../models/organization.model";
import NotFoundException from "../shared/exceptions/not-found.exception";
import { CountAllArgs, GetAllArgs, GetAllBetweenCreatedAtArgs } from "../shared/types/service.type";
import { setUploadPath, uploadFile } from "../shared/helpers/upload.helper";

export default class OrganizationService {
  private repository: PrismaOrganizationRepository;

  constructor() {
    this.repository = new PrismaOrganizationRepository();
  };

  getAll = async (args?: GetAllArgs): Promise<OrganizationModel[]> => {
    const record = await this.repository.findAll({
      condition: args?.condition,
      query: args?.query,
      exclude: ["deletedAt"]
    });

    return record;
  };

  getAllBetweenCreatedAt = async (args: GetAllBetweenCreatedAtArgs): Promise<OrganizationModel[]> => {
    const record = await this.repository.findAllBetweenCreatedAt({
      ...args,
      exclude: ["deletedAt"]
    });

    return record;
  };

  getById = async (id: number): Promise<OrganizationModel> => {
    const record = await this.repository.findById({ id: id });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByName = async (name: string): Promise<OrganizationModel> => {
    const record = await this.repository.findByName({ name: name });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByApiKey = async (apiKey: string): Promise<OrganizationModel> => {
    const record = await this.repository.findByApiKey({ apiKey: apiKey });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  save = async (data: OrganizationModel, file?: Express.Multer.File): Promise<OrganizationModel> => {
    const uploadPath = setUploadPath(file, this.repository.logoPath);
    let record: OrganizationModel;
    let newData = new OrganizationModel(data);
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

  delete = async (id: number): Promise<OrganizationModel> => {
    const userRepository = new PrismaUserRepository();
    const record = await this.repository.softDelete({ id: id });
    await userRepository.softDeleteManyByOrganizationIds({ ids: [id] });
    return record
  };

  deleteMany = async (ids: number[]): Promise<void> => {
    const userRepository = new PrismaUserRepository();
    await this.repository.softDeleteMany({ ids: ids });
    await userRepository.softDeleteManyByOrganizationIds({ ids: ids });
  };

  count = async (args: CountAllArgs): Promise<number> => {
    return await this.repository.count(args);
  };
};