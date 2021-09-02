import { Repositories } from '../database/constrains';
import { ProfileEntity } from './profile.entity';

export const ProfileProvider = [
  {
    provide: Repositories.ProfileRepository,
    useValue: ProfileEntity,
  },
];
