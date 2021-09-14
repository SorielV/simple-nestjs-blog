import { Inject, Injectable } from '@nestjs/common';
import { Repositories } from '../database/constrains';
import { UserEntity, UserEntityScopes } from './user.entity';
import { CreateUserDto } from './user.dto';
import { ProfilesService } from '../profiles/profiles.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(Repositories.UserRepository)
    private readonly userRepository: typeof UserEntity,
    private readonly profilesService: ProfilesService,
  ) {}

  async create(data: CreateUserDto): Promise<UserEntity> {
    let user: UserEntity;
    try {
      user = await this.userRepository.create(data);
      user.profile = await this.profilesService.create({
        ...data,
        userId: user.id,
      });
      return user;
    } catch (err) {
      if (user) await user.destroy();
      throw err;
    }
  }

  async findByEmailAndCompare(
    email: string,
    password: string,
  ): Promise<UserEntity> {
    const err = new Error('Email or password not match');
    const user = await this.userRepository
      .scope(UserEntityScopes.Session)
      .findOne({
        where: {
          email,
        },
        rejectOnEmpty: err,
      });

    const match = await UserEntity.comparePassword(password, user.password);
    if (!match) {
      throw err;
    }

    return user;
  }
}
