import UserRequestHeader from "../entities/user-request-header.entity";

class UserRequestHeaderModel implements UserRequestHeader {
  userAgent?: string | null = null;
  host?: string | null = null;
  ipAddress?: string | null = null;
  timestamp: Date = new Date();
};

export default UserRequestHeaderModel;
