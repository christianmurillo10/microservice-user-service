import { TAccessType } from "./users.entity";

export interface IJWTEntity {
  id: number;
  email: string;
  client: TAccessType;
  scope: string;
  sub: number;
  exp: number;
  iat: number;
  aud: string;
};