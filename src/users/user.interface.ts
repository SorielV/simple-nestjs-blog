export interface IUser {
  id: number;
  email: string;
  password: string;
  verified: boolean;
  lastConnection: Date;
  updatedAt: Date;
  createdAt: Date;
}
