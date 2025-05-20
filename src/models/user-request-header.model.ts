import UserRequestHeaderEntity from "../entities/user-request-header.entity";

class UserRequestHeader implements UserRequestHeaderEntity {
  user_agent?: string | null = null;
  host?: string | null = null;
  ip_address?: string | null = null;
  timestamp: Date = new Date();
};

export default UserRequestHeader;
