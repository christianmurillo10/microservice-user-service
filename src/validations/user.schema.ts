import Joi from "joi";
import { UserAccessType } from "../entities/user.entity";

const usernameChecker = /^(?=[a-zA-Z0-9._]{1,30}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

export const createSchema = Joi.object({
  name: Joi.string().label("Name").max(100).required(),
  email: Joi.string().label("Email").max(100).email().required(),
  username: Joi.string().label("Username").min(6).max(30).regex(usernameChecker).required(),
  password: Joi.string().label("Password").max(100).required(),
  accessType: Joi.string().label("Access Type").valid(
    UserAccessType.Portal,
    UserAccessType.Organization,
    UserAccessType.AppRecognized
  ).required(),
  organizationId: Joi.number().label("Organization").allow(null),
  isActive: Joi.boolean().label("Active?"),
});

export const updateSchema = Joi.object({
  name: Joi.string().label("Name").max(100).empty(),
  email: Joi.string().label("Email").max(100).email().empty(),
  username: Joi.string().label("Username").min(6).max(30).regex(usernameChecker).empty(),
  accessType: Joi.string().label("Access Type").valid(
    UserAccessType.Portal,
    UserAccessType.Organization,
    UserAccessType.AppRecognized
  ).empty(),
  organizationId: Joi.number().label("Organization").empty().allow(null),
  isActive: Joi.boolean().label("Active?").empty(),
});

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().label("Old Password").max(100).required(),
  newPassword: Joi.string().label("New Password").max(100).required(),
});

export const listSchema = Joi.object({
  filters: Joi.object({
    createdAt: Joi.date().label("Date Created").empty(),
    updatedAt: Joi.date().label("Last Modified").empty(),
    name: Joi.string().label("Name").max(100).empty(),
    email: Joi.string().label("Email").max(100).empty(),
    username: Joi.string().label("Username").empty(),
    accessType: Joi.string().label("Access Type").empty(),
    organizationId: Joi.number().label("Organization").empty(),
    isActive: Joi.boolean().label("Active?").empty(),
  }).label("Filters").empty(),
  sorting: Joi.object({
    createdAt: Joi.string().label("Date Created").valid("asc", "desc").empty(),
    updatedAt: Joi.string().label("Last Modified").valid("asc", "desc").empty(),
    name: Joi.string().label("Name").valid("asc", "desc").empty(),
    email: Joi.string().label("Email").valid("asc", "desc").empty(),
    username: Joi.string().label("Username").valid("asc", "desc").empty(),
    accessType: Joi.string().label("Access Type").valid("asc", "desc").empty(),
  }).label("Sorting").empty(),
  page: Joi.number().min(1).label("Page").empty(),
  pageSize: Joi.number().min(1).label("Page Size").empty(),
});

export const deleteByIdsSchema = Joi.object({
  ids: Joi.array()
    .items(Joi.string())
    .min(1)
    .label("IDs")
    .required(),
});