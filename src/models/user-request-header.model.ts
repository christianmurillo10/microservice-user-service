export default interface UserRequestHeader {
  userAgent?: string | null,
  host?: string | null,
  ipAddress?: string | null,
  timestamp: Date
};