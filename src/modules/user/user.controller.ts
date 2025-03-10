import { Controller, Post, Get, Put, Body, Param, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/register.dto';
import { Roles } from '../auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UpdateUserDto } from './dtos/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
      },
    },
  })
  async login(@Request() req) {
    return this.userService.login(req.body);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Logout the user' })
  @ApiBearerAuth()
  async logout(@Request() req) {
    return this.userService.logout(req.user);
  }

  @Put('update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Update user details Amin and Editor' })
  @ApiBearerAuth()
  @Roles('admin', 'editor')
  @ApiBody({ type: UpdateUserDto }) // Ensure Swagger shows the body input
  async updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.userService.updateUser(id, updateUserDto, req.user);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiBearerAuth()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor', 'viewer')
  @ApiOperation({ summary: 'Get user by ID (admin,editor,viewer' })
  @ApiBearerAuth()
  async getUserById(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }


}
