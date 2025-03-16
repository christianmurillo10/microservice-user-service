import { Request, Response, NextFunction } from "express";
import joi from "joi";
import _ from "lodash";
import { validateInput } from "../../shared/helpers/common.helper";
import { MESSAGE_INVALID_BODY } from "../../shared/constants/message.constant";
import BadRequestException from "../../shared/exceptions/bad-request.exception";

const usernameChecker = /^(?=[a-zA-Z0-9._]{1,30}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

export const create = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    if (_.isEmpty(req.body)) {
      throw new BadRequestException([MESSAGE_INVALID_BODY]);
    };

    const schema = joi.object({
      name: joi.string().label("Name").max(100).required(),
      email: joi.string().label("Email").max(100).email().required(),
      username: joi.string().label("Username").min(6).max(30).regex(usernameChecker).required(),
      password: joi.string().label("Password").max(100).required(),
      company_id: joi.number().label("Company").allow(null),
      role_id: joi.number().label("Role").required(),
      is_active: joi.boolean().label("Active?"),
    });
    req.body = await validateInput(req.body, schema);
    next();
  } catch (error) {
    next(error);
  };
};

export const update = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    if (_.isEmpty(req.body)) {
      throw new BadRequestException([MESSAGE_INVALID_BODY]);
    };

    const schema = joi.object({
      name: joi.string().label("Name").max(100).empty(),
      email: joi.string().label("Email").max(100).email().empty(),
      username: joi.string().label("Username").min(6).max(30).regex(usernameChecker).empty(),
      company_id: joi.number().label("Company").empty().allow(null),
      role_id: joi.number().label("Role").empty(),
      is_active: joi.boolean().label("Active?").empty(),
    });
    req.body = await validateInput(req.body, schema);
    next();
  } catch (error) {
    next(error);
  };
};

export const changePassword = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    if (_.isEmpty(req.body)) {
      throw new BadRequestException([MESSAGE_INVALID_BODY]);
    };

    const schema = joi.object({
      old_password: joi.string().label("Old Password").max(100).required(),
      new_password: joi.string().label("New Password").max(100).required(),
    });
    req.body = await validateInput(req.body, schema);
    next();
  } catch (error) {
    next(error);
  };
};

export const list = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    req.query?.filters ? req.query.filters = JSON.parse(<string>req.query.filters) : undefined;
    req.query?.sorting ? req.query.sorting = JSON.parse(<string>req.query.sorting) : undefined;

    const schema = joi.object({
      filters: joi.object({
        created_at: joi.date().label("Date Created").empty(),
        updated_at: joi.date().label("Last Modified").empty(),
        name: joi.string().label("Name").max(100).empty(),
        email: joi.string().label("Email").max(100).empty(),
        username: joi.string().label("Username").empty(),
        company_id: joi.number().label("Company").empty(),
        role_id: joi.number().label("Role").empty(),
        is_active: joi.boolean().label("Active?").empty(),
      }).label("Filters").empty(),
      sorting: joi.object({
        created_at: joi.string().label("Date Created").valid("asc", "desc").empty(),
        updated_at: joi.string().label("Last Modified").valid("asc", "desc").empty(),
        name: joi.string().label("Name").valid("asc", "desc").empty(),
        email: joi.string().label("Email").valid("asc", "desc").empty(),
        username: joi.string().label("Username").valid("asc", "desc").empty()
      }).label("Sorting").empty(),
      offset: joi.number().label("Offset").empty(),
      limit: joi.number().label("Limit").empty(),
    });
    const stringifyQuery = JSON.stringify(await validateInput(req.query, schema));
    req.query = JSON.parse(stringifyQuery);
    next();
  } catch (error) {
    next(error);
  };
};

export const deleteByIds = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    if (_.isEmpty(req.body)) {
      throw new BadRequestException([MESSAGE_INVALID_BODY]);
    };

    const schema = joi.object({
      ids: joi.array()
        .items(joi.string())
        .min(1)
        .label("IDs")
        .required(),
    });
    req.body = await validateInput(req.body, schema);
    next();
  } catch (error) {
    next(error);
  };
};

export const reports = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const schema = joi.object({
      date_from: joi.date().label("Date From"),
      date_to: joi.date().label("Date To"),
    }).and("date_from", "date_to").empty();
    const stringifyQuery = JSON.stringify(await validateInput(req.query, schema));
    req.query = JSON.parse(stringifyQuery);
    next();
  } catch (error) {
    next(error);
  };
};