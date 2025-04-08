import UserRequestHeaderModel from "../models/user-request-header.model";

class UserRequestHeader implements UserRequestHeaderModel {
  user_agent?: string | null = null;
  host?: string | null = null;
  ip_address?: string | null = null;
  timestamp: Date = new Date();
};

export default UserRequestHeader;
