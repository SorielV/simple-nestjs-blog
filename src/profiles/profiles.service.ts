import { Inject, Injectable } from '@nestjs/common';
import { Optional } from 'sequelize';
import { Repositories } from '../database/constrains';
import { UpdateProfileDto } from './dto/create-profile.dto';
import { ProfileEntity } from './profile.entity';
import { IProfile } from './profile.interface';

interface IFindByOptions {
  scope?: string;
  rejectOnEmpty: boolean;
}

@Injectable()
export class ProfilesService {
  constructor(
    @Inject(Repositories.ProfileRepository)
    private readonly profileEntity: typeof ProfileEntity,
  ) {}

  async create(
    data: Optional<
      IProfile,
      'id' | 'bio' | 'image' | 'createdAt' | 'updatedAt'
    >,
  ): Promise<ProfileEntity> {
    return this.profileEntity.create(data);
  }

  async findById(
    id: number,
    options?: Omit<IFindByOptions, 'rejectOnEmpty'> & {
      rejectOnEmpty: false;
    },
  ): Promise<ProfileEntity | null>;

  async findById(
    id: number,
    options?: Omit<IFindByOptions, 'rejectOnEmpty'> & { rejectOnEmpty: true },
  ): Promise<ProfileEntity>;

  async findById(
    id: number,
    options?: IFindByOptions,
  ): Promise<ProfileEntity | null> {
    return this.profileEntity.scope(options?.scope).findOne({
      where: {
        id,
      },
      rejectOnEmpty: options?.rejectOnEmpty ?? false,
    });
  }

  async findByUserId(
    userId: number,
    options?: Omit<IFindByOptions, 'rejectOnEmpty'> & {
      rejectOnEmpty: false;
    },
  ): Promise<ProfileEntity | null>;

  async findByUserId(
    userId: number,
    options?: Omit<IFindByOptions, 'rejectOnEmpty'> & { rejectOnEmpty: true },
  ): Promise<ProfileEntity>;

  async findByUserId(
    userId: number,
    options?: IFindByOptions,
  ): Promise<ProfileEntity | null> {
    return this.profileEntity.scope(options?.scope).findOne({
      where: {
        userId,
      },
      rejectOnEmpty: options?.rejectOnEmpty ?? false,
    });
  }

  async findUserIdByUsername(
    username: string,
    options?: Omit<IFindByOptions, 'rejectOnEmpty'> & {
      rejectOnEmpty: false;
    },
  ): Promise<number | null>;

  async findUserIdByUsername(
    username: string,
    options?: Omit<IFindByOptions, 'rejectOnEmpty'> & { rejectOnEmpty: true },
  ): Promise<number>;

  async findUserIdByUsername(
    username: string,
    options?: IFindByOptions,
  ): Promise<number | null> {
    const profile = await this.profileEntity.findOne({
      attributes: ['userId'],
      where: {
        username,
      },
      rejectOnEmpty: options?.rejectOnEmpty ?? false,
      raw: true,
    });
    return profile?.userId ?? null;
  }

  async updateById(id: number, data: UpdateProfileDto & { userId: number }) {
    const profile = await this.profileEntity.findOne({
      where: {
        id,
        userId: data.userId,
      },
      rejectOnEmpty: true,
    });
    await profile.set(data).save();
    return profile;
  }
}
