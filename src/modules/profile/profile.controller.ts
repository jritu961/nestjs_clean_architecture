import { Controller, Get, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dtos/profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getProfile(@Param('id') id: number) {
    return this.profileService.getProfile(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.updateProfile(req.user.sub, updateProfileDto);
  }
}
