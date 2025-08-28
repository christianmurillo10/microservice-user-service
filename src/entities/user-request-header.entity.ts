import UserRequestHeader from "../models/user-request-header.model";

class UserRequestHeaderEntity implements UserRequestHeader {
  userAgent?: string | null = null;
  host?: string | null = null;
  ipAddress?: string | null = null;
  timestamp: Date = new Date();
};

export default UserRequestHeaderEntity;
