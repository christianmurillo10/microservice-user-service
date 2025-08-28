import { v4 as uuidv4 } from "uuid";
import Organization from "../entities/organization.entity";

class OrganizationModel implements Organization {
  id?: string = uuidv4();
  name: string = "";
  logoPath?: string | null = null;
  isActive: boolean = true;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  deletedAt?: Date | null = null;

  constructor(props: Organization) {
    this.id = props.id;
    this.name = props.name;
    this.logoPath = props.logoPath;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  };
};

export default OrganizationModel;