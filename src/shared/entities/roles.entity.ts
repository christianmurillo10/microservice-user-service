export interface RolesInterface {
  id?: number;
  created_at: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
  name: string;
  description?: string | null;
  company_id?: number | null;
};

class Roles implements RolesInterface {
  id?: number;
  created_at: Date = new Date();
  updated_at?: Date | null = new Date();
  deleted_at?: Date | null;
  name: string = "";
  description: string | null = "";
  company_id?: number | null;

  constructor(props: RolesInterface) {
    Object.assign(this, props);
  };
};

export default Roles;