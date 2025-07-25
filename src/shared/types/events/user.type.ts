export type UserLoggedIn = {
  id: string,
  isLogged: boolean,
  lastLoggedAt: Date,
  updatedAt?: Date | null
};

export type UserLoggedOut = {
  id: string,
  isLogged: boolean,
  updatedAt?: Date | null
};