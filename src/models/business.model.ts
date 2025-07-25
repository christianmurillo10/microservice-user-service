import { v4 as uuidv4 } from "uuid";
import Business from "../entities/business.entity";

class BusinessModel implements Business {
  id?: number;
  name: string = "";
  apiKey: string = `key-${uuidv4()}`;
  domain?: string | null = null;
  logoPath?: string | null = null;
  preferredTimezone?: string | null = null;
  currency?: string | null = null;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  deletedAt?: Date | null = null;

  constructor(props: Business) {
    this.id = props.id;
    this.name = props.name;
    this.apiKey = props.apiKey;
    this.domain = props.domain;
    this.logoPath = props.logoPath;
    this.preferredTimezone = props.preferredTimezone;
    this.currency = props.currency;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  };
};

export default BusinessModel;