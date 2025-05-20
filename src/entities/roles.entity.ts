export default interface RolesEntity {
  id?: number;
  name: string;
  description?: string | null;
  business_id?: number | null;
  created_at: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
};