export enum UserAccessType {
  PORTAL = "PORTAL",
  BUSINESS = "BUSINESS",
  APP_RECOGNIZED = "APP_RECOGNIZED"
};

export type AccessType = UserAccessType.PORTAL | UserAccessType.BUSINESS | UserAccessType.APP_RECOGNIZED;

export default interface UsersEntity {
  id?: string;
  name: string;
  username: string;
  email: string;
  password: string;
  access_type: AccessType;
  image_path?: string | null;
  business_id?: number | null;
  role_id: number;
  is_active: boolean;
  is_logged: boolean;
  last_logged_at?: Date | null;
  created_at: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
};