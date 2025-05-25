import { UsersAccessTypeValue } from "./users.entity";

export interface JWT {
  id: number;
  email: string;
  client: UsersAccessTypeValue;
  scope: string;
  sub: number;
  exp: number;
  iat: number;
  aud: string;
};