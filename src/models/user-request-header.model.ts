import UserRequestHeader from "../entities/user-request-header.entity";

class UserRequestHeaderModel implements UserRequestHeader {
  user_agent?: string | null = null;
  host?: string | null = null;
  ip_address?: string | null = null;
  timestamp: Date = new Date();
};

export default UserRequestHeaderModel;
