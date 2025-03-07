import { Controller, Post, Get, Body, Param, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/register.dto';
import { Roles } from './roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Create a new user
  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  // User login
  @Post('login')
  async login(@Request() req) {
    return this.userService.login(req.body);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req) {
  console.log("req.user",req.user)
  return this.userService.logout(req.user);
}


  // Protected route for admin only
  @Get('admin-data')
  @UseGuards(AuthGuard('jwt'), JwtAuthGuard) // JWT Auth first, then Role Guard
  @Roles('admin')
  getAdminData() {
    return { message: 'This is protected admin data' };
  }

  // Protected route for both users and admins
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @Roles('user', 'admin')
  getProfile(@Request() req) {
    return req.user;
  }

  // Get all users
  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  // Get user by ID
  @Get(':id')
  async getUserById(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }
}

// Let me know if you want me to refine anything further! 🚀
