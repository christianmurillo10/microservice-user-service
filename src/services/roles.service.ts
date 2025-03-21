import { MESSAGE_DATA_NOT_EXIST } from "../shared/constants/message.constant";
import RolesRepository from "../shared/repositories/roles.repository";
import Roles from "../shared/entities/roles.entity";
import NotFoundException from "../shared/exceptions/not-found.exception";
import { CountAllArgs, GetAllArgs, GetByIdArgs, GetByNameArgs } from "../shared/types/service.type";

export default class RolesService {
  private repository: RolesRepository;

  constructor() {
    this.repository = new RolesRepository();
  };

  getAll = async (args?: GetAllArgs): Promise<Roles[]> => {
    const record = await this.repository.findAll({
      condition: args?.condition,
      query: args?.query,
      // include: ["companies"],
      exclude: ["deleted_at"]
    });

    return record;
  };

  getById = async (args: GetByIdArgs<number>): Promise<Roles> => {
    const record = await this.repository.findById({
      id: args.id,
      condition: args?.condition,
      // include: ["companies"],
      exclude: ["deleted_at"]
    });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByName = async (args: GetByNameArgs): Promise<Roles> => {
    const record = await this.repository.findByName({
      name: args.name,
      condition: args?.condition,
      // include: ["companies"],
      exclude: ["deleted_at"]
    });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  save = async (data: Roles): Promise<Roles> => {
    let record: Roles;
    let newData = new Roles(data);
    let option = {
      params: newData,
      // include: ["companies"],
      exclude: ["deleted_at"]
    };

    if (data.id) {
      // Update
      record = await this.repository.update({
        id: data.id,
        ...option
      });
    } else {
      // Create
      record = await this.repository.create(option);
    }

    return record;
  };

  delete = async (id: number): Promise<Roles> => {
    return await this.repository.softDelete({ id: id });
  };

  deleteMany = async (ids: number[]): Promise<void> => {
    this.repository.softDeleteMany({ ids: ids });
  };

  deleteManyByCompanyIds = async (ids: number[]): Promise<void> => {
    this.repository.softDeleteManyByCompanyIds({ ids: ids });
  };

  count = async (args: CountAllArgs): Promise<number> => {
    return await this.repository.count(args);
  };
};