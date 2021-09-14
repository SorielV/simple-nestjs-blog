import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ISession } from '../common/interface';
import { MailService } from '../mail/mail.service';
import { UserTokensService } from '../user-tokens/user-tokens.service';
import { CreateUserDto } from '../users/user.dto';
import { UserEntity } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly userTokensService: UserTokensService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  static getSessionFromUser(user: UserEntity): ISession {
    return {
      userId: user.id,
      profileId: user.profile.id,
      username: user.profile.username,
      verified: user.verified,
    };
  }

  async login(email: string, password: string): Promise<ISession> {
    const user = await this.usersService.findByEmailAndCompare(email, password);
    return AuthService.getSessionFromUser(user);
  }

  async create(data: CreateUserDto): Promise<ISession> {
    const user = await this.usersService.create(data);
    this.sendUserConfirmationToken(user);
    return AuthService.getSessionFromUser(user);
  }

  async generateJWTToken(session: ISession): Promise<string> {
    const token = await this.jwtService.signAsync(session);
    return token;
  }

  async sendUserConfirmationToken(user: UserEntity) {
    const { value: token } =
      await this.userTokensService.createVerificationToken(user.id);
    this.mailService.sendVerification(user, token);
  }

  async sendPasswordResetToken(user: UserEntity) {
    const { value: token } =
      await this.userTokensService.createPasswordResetToken(user.id);
    this.mailService.sendPasswordRecovery(user, token);
  }
}
