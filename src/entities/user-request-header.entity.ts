export default interface IUserRequestHeaderEntity {
  user_agent?: string | null,
  host?: string | null,
  ip_address?: string | null,
  timestamp: Date
};