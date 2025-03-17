import { v4 as uuidv4 } from "uuid";

export interface CompaniesInterface {
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

class Companies implements CompaniesInterface {
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

  constructor(props: CompaniesInterface) {
    Object.assign(this, props);
  };
};

export default Companies;