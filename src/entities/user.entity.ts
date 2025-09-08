import { v4 as uuidv4 } from "uuid";
import User, { UserAccessTypeValue } from "../models/user.model";
import Organization from "../models/organization.model";
import { comparePassword } from "../shared/utils/bcrypt";

class UserEntity implements User {
  id?: string;
  name: string;
  username: string;
  email: string;
  password: string;
  accessType: UserAccessTypeValue;
  imagePath?: string | null;
  organizationId?: string | null;
  isActive: boolean;
  isLogged: boolean;
  lastLoggedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  organization?: Organization;

  constructor(props: User) {
    this.id = props.id ?? uuidv4();
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

  activate() {
    this.isActive = true;
    this.updatedAt = new Date();
  };

  deactivate() {
    this.isActive = false;
    this.updatedAt = new Date();
  };

  markLoggedIn() {
    this.isLogged = true;
    this.lastLoggedAt = new Date();
    this.updatedAt = new Date();
  };

  markLoggedOut() {
    this.isLogged = false;
    this.updatedAt = new Date();
  };

  setOrganization(orgId?: string | null) {
    this.organizationId = orgId ?? null;
    this.updatedAt = new Date();
  };

  changePassword(newHash: string) {
    this.password = newHash;
    this.updatedAt = new Date();
  };

  delete() {
    this.deletedAt = new Date();
  };

  checkPassword(password: string): boolean {
    return comparePassword(password, this.password);
  };
};

export default UserEntity;