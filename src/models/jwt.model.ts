import { AccessType } from "./users.model";

export interface JWTModel {
  id: number;
  email: string;
  client: AccessType;
  scope: string;
  sub: number;
  exp: number;
  iat: number;
  aud: string;
};