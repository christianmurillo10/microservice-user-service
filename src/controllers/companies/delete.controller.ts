import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../shared/utils/api-response";
import { MESSAGE_DATA_DELETED, MESSAGE_DATA_NOT_EXIST, MESSAGE_INVALID_PARAMETER } from "../../shared/constants/message.constant";
import { ERROR_ON_DELETE } from "../../shared/constants/error.constant";
import CompaniesRepository from "../../shared/repositories/companies.repository";
import RolesRepository from "../../shared/repositories/roles.repository";
import UsersRepository from "../../shared/repositories/users.repository";
import BadRequestException from "../../shared/exceptions/bad-request.exception";
import NotFoundException from "../../shared/exceptions/not-found.exception";

const router = Router();
const repository = new CompaniesRepository();
const rolesRepository = new RolesRepository();
const usersRepository = new UsersRepository();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(req)
  .then(async (req) => {
    const { params } = req;
    const id = params.id;

    if (id === ":id" || typeof id !== "number") {
      throw new BadRequestException([MESSAGE_INVALID_PARAMETER]);
    }

    const record = await repository.findById({ id: Number(id) });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    const result = await repository.softDelete({ id: Number(id) });
    await rolesRepository.softDeleteManyByCompanyIds({ ids: [Number(id)] });
    await usersRepository.softDeleteManyByCompanyIds({ ids: [Number(id)] });

    return result;
  })
  .then(result => {
    apiResponse(res, {
      status_code: 200,
      message: MESSAGE_DATA_DELETED,
      result
    })
  })
  .catch(err => {
    console.error(`${ERROR_ON_DELETE}: `, err);
    next(err)
  });

export default router.delete(
  "/:id",
  controller
);