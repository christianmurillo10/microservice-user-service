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
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.business_id = props.business_id;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
    this.deleted_at = props.deleted_at;
  };
};

export default RolesModel;