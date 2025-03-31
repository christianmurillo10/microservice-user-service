import { Request, Response, NextFunction } from "express";
import joi from "joi";
import _ from "lodash";
import { validateInput } from "../../shared/helpers/common.helper";
import { MESSAGE_INVALID_BODY } from "../../shared/constants/message.constant";
import BadRequestException from "../../shared/exceptions/bad-request.exception";

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
      description: joi.string().label("Description").max(255).allow("").allow(null),
      business_id: joi.number().label("Business").allow(null),
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
      description: joi.string().label("Description").max(255).empty().allow("").allow(null),
      business_id: joi.number().label("Business").empty().allow(null),
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
        description: joi.string().label("Description").max(255).empty(),
        business_id: joi.number().label("Business").empty(),
      }).label("Filters").empty(),
      sorting: joi.object({
        created_at: joi.string().label("Date Created").valid("asc", "desc").empty(),
        updated_at: joi.string().label("Last Modified").valid("asc", "desc").empty(),
        name: joi.string().label("Name").valid("asc", "desc").empty()
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
        .items(joi.number())
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