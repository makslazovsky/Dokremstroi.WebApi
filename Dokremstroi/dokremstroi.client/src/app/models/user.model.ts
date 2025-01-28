// models/user.model.ts
export interface User {
  id?: number;
  username: string;
  passwordHash: string;
  role: string;
}
