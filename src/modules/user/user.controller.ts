import { Controller, Post, Get, Body, Param, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/register.dto';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { AuthGuard } from '@nestjs/passport';

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

  // Protected route for admin only
  @Get('admin-data')
  @UseGuards(AuthGuard('jwt'), RolesGuard) // JWT Auth first, then Role Guard
  @Roles('admin')
  getAdminData() {
    return { message: 'This is protected admin data' };
  }

  // Protected route for both users and admins
  @Get('profile')
  @UseGuards(RolesGuard)
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
