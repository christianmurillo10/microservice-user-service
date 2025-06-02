export type MessageData<T> = {
  old_details: T,
  new_details: T
};

export type UserLoggedIn = {
  id: string,
  is_logged: boolean,
  last_logged_at: Date
};

export type UserLoggedOut = {
  id: string,
  is_logged: boolean
};