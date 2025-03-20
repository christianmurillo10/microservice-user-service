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
    let record: Companies;
    let newData = new Companies(data);

    if (data.id) {
      // Update
      newData.logo_path = setUploadPath(file, this.repository.logoPath) || data.logo_path || ""
      record = await this.repository.update({
        id: data.id,
        params: newData,
        exclude: ["deleted_at"]
      });
    } else {
      // Create
      newData.logo_path = setUploadPath(file, this.repository.logoPath);
      record = await this.repository.create({
        params: newData,
        exclude: ["deleted_at"]
      });
    }

    if (!_.isUndefined(file) && record.logo_path) {
      uploadFile(record.logo_path, file);
    };

    return record;
  };

  delete = async (id: number): Promise<Companies> => {
    return this.repository.softDelete({ id: id });
  };

  deleteMany = async (ids: number[]): Promise<void> => {
    this.repository.softDeleteMany({ ids: ids });
  };

  count = async (args: CountAllArgs): Promise<number> => {
    return this.repository.count(args);
  };
};