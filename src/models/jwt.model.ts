import { UserAccessTypeValue } from "./user.model";

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