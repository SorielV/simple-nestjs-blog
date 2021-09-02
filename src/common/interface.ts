import { Request } from 'express';

export interface IPaging<T> {
  paging: {
    perPage: number;
    page: number;
    count?: number;
  };
  data: T[];
}

export interface ISession {
  userId: number;
  profileId: number;
  username: string;
  verified: boolean;
}

export interface IAuthRequest extends Request {
  user: ISession;
}
