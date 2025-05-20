import { AccessType } from "./users.entity";

export interface JWTEntity {
  id: number;
  email: string;
  client: AccessType;
  scope: string;
  sub: number;
  exp: number;
  iat: number;
  aud: string;
};