import jwt from "jsonwebtoken";
import config from "../config/jwt.config";
import { JWT } from "../models/jwt.model";
import { UserAccessTypeValue } from "../models/user.model";

class JWTEntity implements JWT {
  id: number;
  email: string;
  client: UserAccessTypeValue;
  scope: string;
  sub: number;
  exp: number;
  iat: number;
  aud: string;

  constructor(props: JWT) {
    this.id = props.id;
    this.email = props.email;
    this.client = props.client;
    this.scope = props.scope;
    this.sub = props.sub;
    this.exp = props.exp;
    this.iat = props.iat;
    this.aud = props.aud;
  };

  static decodeToken = (token: string): JWTEntity => jwt.verify(token, config.secret) as unknown as JWTEntity;

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

export default JWTEntity;