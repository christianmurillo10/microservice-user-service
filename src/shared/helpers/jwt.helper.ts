import JWTModel from "../../models/jwt.model";

export const verifyToken = (token: string) => {
  try {
    return JWTModel.decodeToken(token);
  } catch (error) {
    return null;
  }
};