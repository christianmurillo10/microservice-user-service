import { v4 as uuidv4 } from "uuid";
import Businesses from "../entities/businesses.entity";

class BusinessesModel implements Businesses {
  id?: number;
  name: string = "";
  api_key: string = `key-${uuidv4()}`;
  domain?: string | null = null;
  logo_path?: string | null = null;
  preferred_timezone?: string | null = null;
  currency?: string | null = null;
  created_at: Date = new Date();
  updated_at?: Date | null = new Date();
  deleted_at?: Date | null = null;

  constructor(props: Businesses) {
    this.id = props.id;
    this.name = props.name;
    this.api_key = props.api_key;
    this.domain = props.domain;
    this.logo_path = props.logo_path;
    this.preferred_timezone = props.preferred_timezone;
    this.currency = props.currency;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
    this.deleted_at = props.deleted_at;
  };
};

export default BusinessesModel;