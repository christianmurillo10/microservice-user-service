import IRolesEntity from "../entities/roles.entity";

class Roles implements IRolesEntity {
  id?: number;
  name: string = "";
  description?: string | null = null;
  business_id?: number | null = null;
  created_at: Date = new Date();
  updated_at?: Date | null = new Date();
  deleted_at?: Date | null = null;

  constructor(props: IRolesEntity) {
    Object.assign(this, props);
  };
};

export default Roles;