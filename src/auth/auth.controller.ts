import {
  Controller,
  UseGuards,
  Get,
  Post,
  Req,
  HttpCode,
  Body,
} from '@nestjs/common';
import { CreateUserDto } from '../users/user.dto';
import { IAuthRequest } from '../common/interface';
import { AuthService } from './auth.service';
import { JWTAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  async logIn(@Req() request: IAuthRequest) {
    const { user } = request;
    return {
      ...user,
      token: await this.authService.generateJWTToken(user),
    };
  }

  @Post('singup')
  @HttpCode(201)
  async registration(@Body() dto: CreateUserDto) {
    const session = await this.authService.create(dto);
    return session;
  }

  @Get('status')
  @UseGuards(JWTAuthGuard)
  status(@Req() { user }: IAuthRequest) {
    return user;
  }
}
