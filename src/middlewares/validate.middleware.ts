import { Request, Response, NextFunction } from "express";
import joi, { Schema } from "joi";
import _ from "lodash";
import BadRequestException from "../shared/exceptions/bad-request.exception";
import { MESSAGE_INVALID_BODY } from "../shared/constants/message.constant";

const validateInput = async <I>(input: I, schema: Schema): Promise<I> => {
  const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  };

  /** Filter unvalued input */
  input = input ?
    Object.assign({}, ...Object.entries(input).map(([key, value]) => {
      const newValue = value === "" || value === "null" || value === undefined ? null : value;
      return { [key]: newValue };
    }))
    : undefined;

  return await schema.validateAsync(input, options);
};

export const validateBody = (schema: joi.ObjectSchema) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    try {
      if (_.isEmpty(req.body)) {
        throw new BadRequestException([MESSAGE_INVALID_BODY]);
      };

      req.body = await validateInput(req.body, schema);
      next();
    } catch (error) {
      next(error);
    };
  };
};

export const validateQuery = (schema: joi.ObjectSchema) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    try {
      req.query?.filters ? req.query.filters = JSON.parse(<string>req.query.filters) : undefined;
      req.query?.sorting ? req.query.sorting = JSON.parse(<string>req.query.sorting) : undefined;

      const stringifyQuery = JSON.stringify(await validateInput(req.query, schema));
      req.query = JSON.parse(stringifyQuery);
      next();
    } catch (error) {
      next(error);
    };
  };
};