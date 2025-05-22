import IUserRequestHeaderEntity from "../entities/user-request-header.entity";

class UserRequestHeader implements IUserRequestHeaderEntity {
  user_agent?: string | null = null;
  host?: string | null = null;
  ip_address?: string | null = null;
  timestamp: Date = new Date();
};

export default UserRequestHeader;
