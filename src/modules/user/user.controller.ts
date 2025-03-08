import { Controller, Post, Get, Put, Body, Param, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/register.dto';
import { Roles } from '../auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  async login(@Request() req) {
    return this.userService.login(req.body);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req) {
    return this.userService.logout(req.user);
  }

  // ✅ Update User (Admin can update any user, Users can update their own profile)
  @Put('update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor') 
  async updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.userService.updateUser(id, updateUserDto, req.user);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor','viewer')
  async getUserById(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return this.userService.getUserById(req.user.sub);
  }
}
