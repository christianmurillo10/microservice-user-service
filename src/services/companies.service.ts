import _ from "lodash";
import { MESSAGE_DATA_NOT_EXIST } from "../shared/constants/message.constant";
import CompaniesRepository from "../shared/repositories/companies.repository";
import Companies from "../shared/entities/companies.entity";
import NotFoundException from "../shared/exceptions/not-found.exception";
import { CountAllArgs, GetAllArgs, GetAllBetweenCreatedAtArgs } from "../shared/types/service.type";
import { setUploadPath, uploadFile } from "../shared/helpers/upload.helper";

export default class CompaniesService {
  private repository: CompaniesRepository;

  constructor() {
    this.repository = new CompaniesRepository();
  };

  getAll = async (args?: GetAllArgs): Promise<Companies[]> => {
    const record = await this.repository.findAll({
      condition: args?.condition,
      query: args?.query,
      exclude: ["deleted_at"]
    });

    return record;
  };

  getAllBetweenCreatedAt = async (args: GetAllBetweenCreatedAtArgs): Promise<Companies[]> => {
    const record = await this.repository.findAllBetweenCreatedAt({
      ...args,
      exclude: ["deleted_at"]
    });

    return record;
  };

  getById = async (id: number): Promise<Companies> => {
    const record = await this.repository.findById({ id: id });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByName = async (name: string): Promise<Companies> => {
    const record = await this.repository.findByName({ name: name });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByApiKey = async (api_key: string): Promise<Companies> => {
    const record = await this.repository.findByApiKey({ api_key: api_key });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  save = async (data: Companies, file?: Express.Multer.File): Promise<Companies> => {
    const uploadPath = setUploadPath(file, this.repository.logoPath);
    let record: Companies;
    let newData = new Companies(data);
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

  delete = async (id: number): Promise<Companies> => {
    return await this.repository.softDelete({ id: id });
  };

  deleteMany = async (ids: number[]): Promise<void> => {
    this.repository.softDeleteMany({ ids: ids });
  };

  count = async (args: CountAllArgs): Promise<number> => {
    return await this.repository.count(args);
  };
};