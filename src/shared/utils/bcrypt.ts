import bcrypt from "bcryptjs";

export const hashedPassword = (password: string): string => {
  return bcrypt.hashSync(password, 10);
}

export const comparePassword = (password: string, hashPassword: string): boolean => {
  return bcrypt.compareSync(password, hashPassword);
}