import jwt from "jsonwebtoken";
import config from "../../config/jwt.config";
import { IJWTEntity } from "../../entities/jwt.entity";
import { TAccessType, EAccessType } from "../../entities/users.entity";

class JWT implements IJWTEntity {
  id: number = 0;
  email: string = "";
  client: TAccessType = EAccessType.BUSINESS;
  scope: string = "";
  sub: number = 0;
  exp: number = 0;
  iat: number = Date.now();
  aud: string = "Microservice";

  constructor(props: IJWTEntity) {
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