import Roles from "../entities/roles.entity";

class RolesModel implements Roles {
  id?: number;
  name: string = "";
  description?: string | null = null;
  business_id?: number | null = null;
  created_at: Date = new Date();
  updated_at?: Date | null = new Date();
  deleted_at?: Date | null = null;

  constructor(props: Roles) {
    Object.assign(this, props);
  };
};

export default RolesModel;