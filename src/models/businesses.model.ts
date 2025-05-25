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
    Object.assign(this, props);
  };
};

export default BusinessesModel;