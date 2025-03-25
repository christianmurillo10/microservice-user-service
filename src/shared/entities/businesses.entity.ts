import { v4 as uuidv4 } from "uuid";

export interface BusinessesInterface {
  id?: number;
  created_at: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
  name: string;
  api_key: string;
  domain?: string | null;
  logo_path?: string | null;
  preferred_timezone?: string | null;
  currency?: string | null;
};

class Businesses implements BusinessesInterface {
  id?: number;
  created_at: Date = new Date();
  updated_at?: Date | null = new Date();
  deleted_at?: Date | null;
  name: string = "";
  api_key: string = `key-${uuidv4()}`;
  domain?: string | null;
  logo_path?: string | null;
  preferred_timezone?: string | null;
  currency?: string | null;

  constructor(props: BusinessesInterface) {
    Object.assign(this, props);
  };
};

export default Businesses;