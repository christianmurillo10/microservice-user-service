export type UserLoggedIn = {
  id: string,
  is_logged: boolean,
  last_logged_at: Date
};

export type UserLoggedInData = {
  old_details: UserLoggedIn,
  new_details: UserLoggedIn
};

export type UserLoggedOut = {
  id: string,
  is_logged: boolean
};

export type UserLoggedOutData = {
  old_details: UserLoggedOut,
  new_details: UserLoggedOut
};