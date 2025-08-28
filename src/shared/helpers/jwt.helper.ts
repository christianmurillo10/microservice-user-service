import JWTEntity from "../../entities/jwt.entity";

export const verifyToken = (token: string) => {
  try {
    return JWTEntity.decodeToken(token);
  } catch (error) {
    return null;
  }
};