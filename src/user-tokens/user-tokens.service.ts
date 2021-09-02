import { Inject, Injectable } from '@nestjs/common';
import { addDays } from 'date-fns';
import { nanoid } from 'nanoid';
import { Op } from 'sequelize';

import { Repositories } from '../database/constrains';
import { UserTokenEntity } from './user-token.entity';
import { UserTokenType } from './user-token.interface';

@Injectable()
export class UserTokensService {
  constructor(
    @Inject(Repositories.UserToken)
    private readonly userTokenEntity: typeof UserTokenEntity,
  ) {}

  async createVerificationToken(userId: number) {
    const value = nanoid(200);
    const expiresAt = addDays(Date.now(), 7);
    const [verificationToken, created] =
      await this.userTokenEntity.findOrCreate({
        where: {
          userId,
          type: UserTokenType.EmailVerification,
        },
        defaults: {
          userId,
          type: UserTokenType.EmailVerification,
          value,
          expiresAt,
        },
      });

    if (created) return;

    return verificationToken
      .set({
        value,
        expiresAt,
      })
      .save({
        fields: ['value', 'expiresAt'],
      });
  }

  async createPasswordResetToken(userId: number) {
    const value = nanoid(200);
    const expiresAt = addDays(Date.now(), 7);
    const [verificationToken, created] =
      await this.userTokenEntity.findOrCreate({
        where: {
          userId,
          type: UserTokenType.PasswordReset,
        },
        defaults: {
          userId,
          type: UserTokenType.PasswordReset,
          value,
          expiresAt,
        },
      });

    if (created) return;

    return verificationToken
      .set({
        value,
        expiresAt,
      })
      .save({
        fields: ['value', 'expiresAt'],
      });
  }

  async findAndValidateVerificationToken(userId: number, value: string) {
    const verification = await this.userTokenEntity.findOne({
      where: {
        userId,
        value,
        type: UserTokenType.EmailVerification,
        expiresAt: {
          [Op.lt]: Date.now(),
        },
      },
      rejectOnEmpty: new Error('Verification token invalid or expired'),
    });

    if (!verification || verification.expiresAt < new Date()) {
      throw new Error('Verification token invalid or expired');
    }

    return verification;
  }

  async findAndValidatePasswordResetToken(userId: number, value: string) {
    return this.userTokenEntity.findOne({
      where: {
        userId,
        value,
        type: UserTokenType.EmailVerification,
        expiresAt: {
          [Op.lt]: Date.now(),
        },
      },
      rejectOnEmpty: new Error('Password reset token invalid or expired'),
    });
  }
}
