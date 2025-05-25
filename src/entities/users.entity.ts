export enum UsersAccessType {
  Portal = "PORTAL",
  Business = "BUSINESS",
  AppRecognized = "APP_RECOGNIZED"
};

export type UsersAccessTypeValue = UsersAccessType.Portal | UsersAccessType.Business | UsersAccessType.AppRecognized;

export default interface Users {
  id?: string;
  name: string;
  username: string;
  email: string;
  password: string;
  access_type: UsersAccessTypeValue;
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