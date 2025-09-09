export interface UserRequestHeader {
  userAgent?: string | null,
  host?: string | null,
  ipAddress?: string | null,
  timestamp: Date
};

class UserRequestHeaderEntity implements UserRequestHeader {
  userAgent?: string | null = null;
  host?: string | null = null;
  ipAddress?: string | null = null;
  timestamp: Date = new Date();
};

export default UserRequestHeaderEntity;
