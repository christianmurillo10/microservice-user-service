export enum UserAccessType {
  Portal = "PORTAL",
  Business = "BUSINESS",
  AppRecognized = "APP_RECOGNIZED"
};

export type UserAccessTypeValue = UserAccessType.Portal | UserAccessType.Business | UserAccessType.AppRecognized;

export default interface User {
  id?: string;
  name: string;
  username: string;
  email: string;
  password: string;
  accessType: UserAccessTypeValue;
  imagePath?: string | null;
  businessId?: number | null;
  isActive: boolean;
  isLogged: boolean;
  lastLoggedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};