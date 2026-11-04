export default class User {
  readonly name: string | undefined;
  email: string | undefined;
  password: string | undefined;
  role: UserRole | undefined;
}

export type UserRole = "admin" | "user";

export type AccountRow = {
  id: string;
  user_id: string;
  username: string;
  password: string;
  email_address: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
  last_login: Date;
};
