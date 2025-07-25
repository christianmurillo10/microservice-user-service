import { Schema } from "joi";
import { GenericObject, Pagination } from "../types/common.type";

export const validateInput = async <I>(input: I, schema: Schema): Promise<I> => {
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

export const parseQueryFilters = <T>(data: T): GenericObject => {
  return data
    ? Object.assign({}, ...Object.entries(data)
      .map(([key, value]) => {
        const dateFields = [
          "createdAt",
          "updatedAt",
          "deletedAt",
          "lastLoggedAt",
          "verifiedAt",
          "date"
        ];

        if (dateFields.includes(key)) {
          const dateTime = new Date(value as Date);
          const dateTimeAfter = new Date(new Date(dateTime).setDate(dateTime.getDate() + 1));
          return {
            [key]: {
              gte: dateTime.toISOString(),
              lt: dateTimeAfter.toISOString()
            }
          };
        };

        if (typeof value === "string") {
          return { [key]: { contains: value } };
        };

        return { [key]: value };
      }))
    : {};
};

export const generateNonce = (): string => {
  return Math.floor(Math.random() * Date.now()).toString(16);
};

export const setSelectExclude = (val: string[]): GenericObject => {
  return val ? val.reduce((acc, item) => ({ ...acc, [item]: false }), {}) : {};
};

export const getPagination = (
  totalItems: number,
  totalPageItems: number,
  page: number,
  pageSize: number
): Pagination => {
  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    totalItems: totalItems,
    totalPageItems: totalPageItems,
    totalPages: totalPages,
    page,
    pageSize: pageSize,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  };
}