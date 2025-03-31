import { v4 as uuidv4 } from "uuid";
import { users as UsersPrismaModel } from "@prisma/client";
import { AccessType } from "../shared/types/common.type";

type UsersModel = UsersPrismaModel & {
  access_type: AccessType
};

class Users implements UsersModel {
  id: string = uuidv4();
  name: string = "";
  username: string = "";
  email: string = "";
  password: string = "";
  image_path: string | null = null;
  access_type: AccessType = "ADMIN";
  business_id: number | null = null;
  role_id!: number;
  is_active: boolean = true;
  is_logged: boolean = false;
  last_logged_at: Date | null = null;
  created_at: Date = new Date();
  updated_at: Date | null = new Date();
  deleted_at: Date | null = null;

  constructor(props: UsersModel) {
    Object.assign(this, props);
  };
};

export default Users;