import { v4 as uuidv4 } from "uuid";
import { businesses as BusinessesModel } from "@prisma/client";

class Businesses implements BusinessesModel {
  id!: number;
  created_at: Date = new Date();
  updated_at: Date | null = new Date();
  deleted_at: Date | null = null;
  name: string = "";
  api_key: string = `key-${uuidv4()}`;
  domain: string | null = null;
  logo_path: string | null = null;
  preferred_timezone: string | null = null;
  currency: string | null = null;

  constructor(props: BusinessesModel) {
    Object.assign(this, props);
  };
};

export default Businesses;