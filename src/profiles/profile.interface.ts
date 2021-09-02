export interface IProfile {
  id: number;
  userId: number;
  image: string | null;
  firstName: string;
  lastName: string;
  username: string;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
}
