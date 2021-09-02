import { Repositories } from '../database/constrains';
import { UserEntity } from './user.entity';

export const UserProvider = [
  {
    provide: Repositories.UserRepository,
    useValue: UserEntity,
  },
];
