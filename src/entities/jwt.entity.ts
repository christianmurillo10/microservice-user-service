import { UserAccessTypeValue } from "./user.entity";

export interface JWT {
  id: number;
  email: string;
  client: UserAccessTypeValue;
  scope: string;
  sub: number;
  exp: number;
  iat: number;
  aud: string;
};