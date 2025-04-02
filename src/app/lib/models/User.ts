export default class User {
  readonly name: string | undefined;
  email: string | undefined;
  password: string | undefined;
  role: Role | undefined;
}

export type Role = {
  admin: string;
};
