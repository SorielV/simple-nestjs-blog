import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JWTAuthGuard } from '../auth/jwt-auth.guard';
import { IAuthRequest } from '../common/interface';
import { UpdateProfileDto } from './dto/create-profile.dto';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('/:id')
  async findById(@Param('id') id: number) {
    return this.profilesService.findById(id);
  }

  @Put('/:id')
  @UseGuards(JWTAuthGuard)
  async updateById(
    @Param('id') id: number,
    @Body() data: UpdateProfileDto,
    @Req() { user: { profileId, userId } }: IAuthRequest,
  ) {
    return this.profilesService.updateById(profileId, { ...data, userId });
  }
}
