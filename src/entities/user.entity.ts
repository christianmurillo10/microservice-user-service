export enum UserAccessType {
  Portal = "PORTAL",
  Organization = "BUSINESS",
  AppRecognized = "APP_RECOGNIZED"
};

export type UserAccessTypeValue = UserAccessType.Portal | UserAccessType.Organization | UserAccessType.AppRecognized;

export default interface User {
  id?: string;
  name: string;
  username: string;
  email: string;
  password: string;
  accessType: UserAccessTypeValue;
  imagePath?: string | null;
  organizationId?: number | null;
  isActive: boolean;
  isLogged: boolean;
  lastLoggedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};