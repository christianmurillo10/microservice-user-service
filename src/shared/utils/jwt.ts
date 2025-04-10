import jwt from "jsonwebtoken";
import config from "../../config/jwt.config";
import { JWTModel } from "../../models/jwt.model";
import { AccessType } from "../../models/users.model";
import { USERS_ACCESS_TYPE_BUSINESS } from "../constants/users.constant";

class JWT implements JWTModel {
  id: number = 0;
  email: string = "";
  client: AccessType = USERS_ACCESS_TYPE_BUSINESS;
  scope: string = "";
  sub: number = 0;
  exp: number = 0;
  iat: number = Date.now();
  aud: string = "Boilerplate";

  constructor(props: JWTModel) {
    Object.assign(this, props);
  };

  static decodeToken = (token: string): JWT => jwt.verify(token, config.secret) as unknown as JWT;

  encodeToken = () => jwt.sign(
    {
      id: this.id,
      email: this.email,
      client: this.client,
      scope: this.scope,
      sub: this.sub,
      exp: this.exp,
      iat: this.iat,
      aud: this.aud
    },
    config.secret
  );
};

export default JWT;