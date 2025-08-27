export default interface Organization {
  id?: number;
  name: string;
  apiKey: string;
  domain?: string | null;
  logoPath?: string | null;
  preferredTimezone?: string | null;
  currency?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};