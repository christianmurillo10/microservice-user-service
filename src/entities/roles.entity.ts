import { roles as RolesModel } from "@prisma/client";

class Roles implements RolesModel {
  id!: number;
  name: string = "";
  description: string | null = "";
  business_id: number | null = null;
  created_at: Date = new Date();
  updated_at: Date | null = new Date();
  deleted_at: Date | null = null;

  constructor(props: RolesModel) {
    Object.assign(this, props);
  };
};

export default Roles;