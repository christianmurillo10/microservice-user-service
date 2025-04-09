export type JWTClient = "PORTAL" | "BUSINESS" | "APP_RECOGNIZED";

export interface JWTModel {
  id: number;
  email: string;
  client: JWTClient;
  scope: string;
  sub: number;
  exp: number;
  iat: number;
  aud: string;
};