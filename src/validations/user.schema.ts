import joi from "joi";
import { UserAccessType } from "../entities/user.entity";

const usernameChecker = /^(?=[a-zA-Z0-9._]{1,30}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

export const createSchema = joi.object({
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

export const updateSchema = joi.object({
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

export const changePasswordSchema = joi.object({
  oldPassword: joi.string().label("Old Password").max(100).required(),
  newPassword: joi.string().label("New Password").max(100).required(),
});

export const listSchema = joi.object({
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

export const deleteByIdsSchema = joi.object({
  ids: joi.array()
    .items(joi.string())
    .min(1)
    .label("IDs")
    .required(),
});