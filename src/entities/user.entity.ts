import { v4 as uuidv4 } from "uuid";
import User, { UserAccessTypeValue, UserAccessType } from "../models/user.model";
import Organization from "../models/organization.model";

class UserEntity implements User {
  id?: string = uuidv4();
  name: string = "";
  username: string = "";
  email: string = "";
  password: string = "";
  accessType: UserAccessTypeValue = UserAccessType.Organization;
  imagePath?: string | null = null;
  organizationId?: string | null = null;
  isActive: boolean = true;
  isLogged: boolean = false;
  lastLoggedAt?: Date | null = null;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  deletedAt?: Date | null = null;
  organization?: Organization;

  constructor(props: User) {
    this.id = props.id;
    this.name = props.name;
    this.username = props.username;
    this.email = props.email;
    this.password = props.password;
    this.accessType = props.accessType;
    this.imagePath = props.imagePath;
    this.organizationId = props.organizationId;
    this.isActive = props.isActive;
    this.isLogged = props.isLogged;
    this.lastLoggedAt = props.lastLoggedAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
    this.organization = props.organization;
  };
};

export default UserEntity;