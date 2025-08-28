import User from "./user.model";

export default interface Organization {
  id?: string;
  name: string;
  logoPath?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  users?: User[];
};