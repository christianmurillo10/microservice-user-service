import JWT from "../utils/jwt";

export const verifyToken = (token: string) => {
  try {
    return JWT.decodeToken(token);
  } catch (error) {
    return null;
  }
};