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
    this.imagePath = props.imagePath ?? null;
    this.organizationId = props.organizationId ?? null;
    this.isActive = props.isActive ?? true;
    this.isLogged = props.isLogged ?? false;
    this.lastLoggedAt = props.lastLoggedAt ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.deletedAt = props.deletedAt ?? null;
    this.organization = props.organization;
  };

  activate() {
    this.isActive = true;
  };

  deactivate() {
    this.isActive = false;
  };

  markLoggedIn() {
    this.isLogged = true;
    this.lastLoggedAt = new Date();
  };

  markLoggedOut() {
    this.isLogged = false;
  };

  setOrganization(orgId?: string | null) {
    this.organizationId = orgId ?? null;
  };

  changePassword(newHash: string) {
    this.password = newHash;
  };

  delete() {
    this.deletedAt = new Date();
  };

  checkPassword(password: string): boolean {
    return comparePassword(password, this.password);
  };
};

export default UserEntity;