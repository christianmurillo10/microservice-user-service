import { Request, Response, NextFunction } from "express";
import joi from "joi";
import _ from "lodash";
import { validateInput } from "../../shared/helpers/common.helper";
import { MESSAGE_INVALID_BODY } from "../../shared/constants/message.constant";
import BadRequestException from "../../shared/exceptions/bad-request.exception";
import { UserAccessType } from "../../models/user.model";

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
      accessType: joi.string().label("Access Type").valid(
        UserAccessType.Portal,
        UserAccessType.Organization,
        UserAccessType.AppRecognized
      ).required(),
      organizationId: joi.number().label("Organization").allow(null),
      isActive: joi.boolean().label("Active?"),
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
      accessType: joi.string().label("Access Type").valid(
        UserAccessType.Portal,
        UserAccessType.Organization,
        UserAccessType.AppRecognized
      ).empty(),
      organizationId: joi.number().label("Organization").empty().allow(null),
      isActive: joi.boolean().label("Active?").empty(),
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
      oldPassword: joi.string().label("Old Password").max(100).required(),
      newPassword: joi.string().label("New Password").max(100).required(),
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
        createdAt: joi.date().label("Date Created").empty(),
        updatedAt: joi.date().label("Last Modified").empty(),
        name: joi.string().label("Name").max(100).empty(),
        email: joi.string().label("Email").max(100).empty(),
        username: joi.string().label("Username").empty(),
        accessType: joi.string().label("Access Type").empty(),
        organizationId: joi.number().label("Organization").empty(),
        isActive: joi.boolean().label("Active?").empty(),
      }).label("Filters").empty(),
      sorting: joi.object({
        createdAt: joi.string().label("Date Created").valid("asc", "desc").empty(),
        updatedAt: joi.string().label("Last Modified").valid("asc", "desc").empty(),
        name: joi.string().label("Name").valid("asc", "desc").empty(),
        email: joi.string().label("Email").valid("asc", "desc").empty(),
        username: joi.string().label("Username").valid("asc", "desc").empty(),
        accessType: joi.string().label("Access Type").valid("asc", "desc").empty(),
      }).label("Sorting").empty(),
      page: joi.number().min(1).label("Page").empty(),
      pageSize: joi.number().min(1).label("Page Size").empty(),
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