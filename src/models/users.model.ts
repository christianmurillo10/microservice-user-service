import { v4 as uuidv4 } from "uuid";
import Users, { UsersAccessTypeValue, UsersAccessType } from "../entities/users.entity";

class UsersModel implements Users {
  id?: string = uuidv4();
  name: string = "";
  username: string = "";
  email: string = "";
  password: string = "";
  access_type: UsersAccessTypeValue = UsersAccessType.Business;
  image_path?: string | null = null;
  business_id?: number | null = null;
  role_id!: number;
  is_active: boolean = true;
  is_logged: boolean = false;
  last_logged_at?: Date | null = null;
  created_at: Date = new Date();
  updated_at?: Date | null = new Date();
  deleted_at?: Date | null = null;

  constructor(props: Users) {
    this.id = props.id;
    this.name = props.name;
    this.username = props.username;
    this.email = props.email;
    this.password = props.password;
    this.access_type = props.access_type;
    this.image_path = props.image_path;
    this.business_id = props.business_id;
    this.role_id = props.role_id;
    this.is_active = props.is_active;
    this.is_logged = props.is_logged;
    this.last_logged_at = props.last_logged_at;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
    this.deleted_at = props.deleted_at;
  };
};

export default UsersModel;