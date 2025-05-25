import _ from "lodash";
import { MESSAGE_DATA_NOT_EXIST } from "../shared/constants/message.constant";
import PrismaBusinessesRepository from "../repositories/businesses.repository";
import PrismaRolesRepository from "../repositories/roles.repository";
import PrismaUsersRepository from "../repositories/users.repository";
import BusinessesModel from "../models/businesses.model";
import NotFoundException from "../shared/exceptions/not-found.exception";
import { CountAllArgs, GetAllArgs, GetAllBetweenCreatedAtArgs } from "../shared/types/service.type";
import { setUploadPath, uploadFile } from "../shared/helpers/upload.helper";

export default class BusinessesService {
  private repository: PrismaBusinessesRepository;

  constructor() {
    this.repository = new PrismaBusinessesRepository();
  };

  getAll = async (args?: GetAllArgs): Promise<BusinessesModel[]> => {
    const record = await this.repository.findAll({
      condition: args?.condition,
      query: args?.query,
      exclude: ["deleted_at"]
    });

    return record;
  };

  getAllBetweenCreatedAt = async (args: GetAllBetweenCreatedAtArgs): Promise<BusinessesModel[]> => {
    const record = await this.repository.findAllBetweenCreatedAt({
      ...args,
      exclude: ["deleted_at"]
    });

    return record;
  };

  getById = async (id: number): Promise<BusinessesModel> => {
    const record = await this.repository.findById({ id: id });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByName = async (name: string): Promise<BusinessesModel> => {
    const record = await this.repository.findByName({ name: name });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByApiKey = async (api_key: string): Promise<BusinessesModel> => {
    const record = await this.repository.findByApiKey({ api_key: api_key });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  save = async (data: BusinessesModel, file?: Express.Multer.File): Promise<BusinessesModel> => {
    const uploadPath = setUploadPath(file, this.repository.logoPath);
    let record: BusinessesModel;
    let newData = new BusinessesModel(data);
    let option = {
      params: newData,
      exclude: ["deleted_at"]
    };

    if (data.id) {
      // Update
      option.params.logo_path = uploadPath || data.logo_path || ""
      record = await this.repository.update({
        id: data.id,
        ...option
      });
    } else {
      // Create
      option.params.logo_path = uploadPath;
      record = await this.repository.create(option);
    }

    if (!_.isUndefined(file) && record.logo_path) {
      uploadFile(record.logo_path, file);
    };

    return record;
  };

  delete = async (id: number): Promise<BusinessesModel> => {
    const rolesRepository = new PrismaRolesRepository();
    const usersRepository = new PrismaUsersRepository();
    const record = await this.repository.softDelete({ id: id });
    await rolesRepository.softDeleteManyByBusinessIds({ ids: [id] });
    await usersRepository.softDeleteManyByBusinessIds({ ids: [id] });
    return record
  };

  deleteMany = async (ids: number[]): Promise<void> => {
    const rolesRepository = new PrismaRolesRepository();
    const usersRepository = new PrismaUsersRepository();
    await this.repository.softDeleteMany({ ids: ids });
    await rolesRepository.softDeleteManyByBusinessIds({ ids: ids });
    await usersRepository.softDeleteManyByBusinessIds({ ids: ids });
  };

  count = async (args: CountAllArgs): Promise<number> => {
    return await this.repository.count(args);
  };
};