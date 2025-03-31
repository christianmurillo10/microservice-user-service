export interface UserRequestHeaderModel {
  user_agent: string | null,
  host: string | null,
  ip_address: string | null,
  timestamp: Date
};

class UserRequestHeader implements UserRequestHeaderModel {
  user_agent: string | null = null;
  host: string | null = null;
  ip_address: string | null = null;
  timestamp: Date = new Date();
};

export default UserRequestHeader;
