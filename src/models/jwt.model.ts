import jwt from "jsonwebtoken";
import config from "../config/jwt.config";
import { JWT } from "../entities/jwt.entity";
import { UsersAccessTypeValue, UsersAccessType } from "../entities/users.entity";

class JWTModel implements JWT {
  id: number = 0;
  email: string = "";
  client: UsersAccessTypeValue = UsersAccessType.Business;
  scope: string = "";
  sub: number = 0;
  exp: number = 0;
  iat: number = Date.now();
  aud: string = "Microservice";

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

  static decodeToken = (token: string): JWTModel => jwt.verify(token, config.secret) as unknown as JWTModel;

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

export default JWTModel;