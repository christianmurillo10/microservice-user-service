import { v4 as uuidv4 } from "uuid";
import UsersEntity, { AccessType, UserAccessType } from "../entities/users.entity";

class Users implements UsersEntity {
  id?: string = uuidv4();
  name: string = "";
  username: string = "";
  email: string = "";
  password: string = "";
  access_type: AccessType = UserAccessType.BUSINESS;
  image_path?: string | null = null;
  business_id: number | null = null;
  role_id!: number;
  is_active: boolean = true;
  is_logged: boolean = false;
  last_logged_at?: Date | null = null;
  created_at: Date = new Date();
  updated_at?: Date | null = new Date();
  deleted_at?: Date | null = null;

  constructor(props: UsersEntity) {
    Object.assign(this, props);
  };
};

export default Users;