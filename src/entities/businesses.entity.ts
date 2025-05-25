export default interface Businesses {
  id?: number;
  name: string;
  api_key: string;
  domain?: string | null;
  logo_path?: string | null;
  preferred_timezone?: string | null;
  currency?: string | null;
  created_at: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
};