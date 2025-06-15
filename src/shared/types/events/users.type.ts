export type UserLoggedIn = {
  id: string,
  is_logged: boolean,
  last_logged_at: Date,
  updated_at?: Date | null
};

export type UserLoggedOut = {
  id: string,
  is_logged: boolean,
  updated_at?: Date | null
};