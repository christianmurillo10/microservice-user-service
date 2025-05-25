import { MESSAGE_DATA_NOT_EXIST } from "../shared/constants/message.constant";
import PrismaRolesRepository from "../repositories/prisma/roles.repository";
import RolesModel from "../models/roles.model";
import NotFoundException from "../shared/exceptions/not-found.exception";
import { CountAllArgs, GetAllArgs, GetByIdArgs, GetByNameArgs } from "../shared/types/service.type";

export default class RolesService {
  private repository: PrismaRolesRepository;

  constructor() {
    this.repository = new PrismaRolesRepository();
  };

  getAll = async (args?: GetAllArgs): Promise<RolesModel[]> => {
    const record = await this.repository.findAll({
      condition: args?.condition,
      query: args?.query,
      // include: ["businesses"],
      exclude: ["deleted_at"]
    });

    return record;
  };

  getById = async (args: GetByIdArgs<number>): Promise<RolesModel> => {
    const record = await this.repository.findById({
      id: args.id,
      condition: args?.condition,
      // include: ["businesses"],
      exclude: ["deleted_at"]
    });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByName = async (args: GetByNameArgs): Promise<RolesModel> => {
    const record = await this.repository.findByName({
      name: args.name,
      condition: args?.condition,
      // include: ["businesses"],
      exclude: ["deleted_at"]
    });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  save = async (data: RolesModel): Promise<RolesModel> => {
    let record: RolesModel;
    let newData = new RolesModel(data);
    let option = {
      params: newData,
      // include: ["businesses"],
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

  delete = async (id: number): Promise<RolesModel> => {
    return await this.repository.softDelete({ id: id });
  };

  deleteMany = async (ids: number[]): Promise<void> => {
    await this.repository.softDeleteMany({ ids: ids });
  };

  deleteManyByBusinessIds = async (ids: number[]): Promise<void> => {
    await this.repository.softDeleteManyByBusinessIds({ ids: ids });
  };

  count = async (args: CountAllArgs): Promise<number> => {
    return await this.repository.count(args);
  };
};