import { Repositories } from '../database/constrains';
import { UserTokenEntity } from './user-token.entity';

export const UserTokenProvider = [
  {
    provide: Repositories.UserToken,
    useValue: UserTokenEntity,
  },
];
