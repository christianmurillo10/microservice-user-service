import { v4 as uuidv4 } from "uuid";
import Organization from "../models/organization.model";
import User from "../models/user.model";

class OrganizationEntity implements Organization {
  id?: string;
  name: string;
  logoPath?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  users?: User[];

  constructor(props: Organization) {
    this.id = props.id ?? uuidv4();
    this.name = props.name;
    this.logoPath = props.logoPath ?? null;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.deletedAt = props.deletedAt ?? null;
    this.users = props.users;
  };

  activate() {
    this.isActive = true;
  };

  deactivate() {
    this.isActive = false;
  };
};

export default OrganizationEntity;