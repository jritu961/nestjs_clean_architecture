import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Reflector } from '@nestjs/core';
import { CreateUserDto } from './dtos/register.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CanActivate } from '@nestjs/common';

// Mocking JwtAuthGuard and RolesGuard
class MockJwtAuthGuard implements CanActivate {
  canActivate(): boolean {
    return true;
  }
}

class MockRolesGuard implements CanActivate {
  canActivate(): boolean {
    return true;
  }
}

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUserService = {
    createUser: jest.fn().mockImplementation((dto) => ({ id: 1, ...dto })),
    login: jest.fn().mockResolvedValue({ accessToken: 'mockToken' }),
    logout: jest.fn().mockResolvedValue({ message: 'Logged out successfully' }),
    updateUser: jest.fn().mockImplementation((id, dto) => ({ id, ...dto })),
    getAllUsers: jest.fn().mockResolvedValue([{ id: 1, firstName: 'John Doe' }]),
    getUserById: jest.fn().mockImplementation((id) => ({ id, firstName: 'User' + id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Reflector, useValue: {} },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(new MockJwtAuthGuard())
      .overrideGuard(RolesGuard)
      .useValue(new MockRolesGuard())
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const dto: CreateUserDto = { firstName: 'John', email: 'john@example.com', password: '123456',username:"ritu" };
    expect(await controller.createUser(dto)).toEqual({ id: 1, ...dto });
    expect(userService.createUser).toHaveBeenCalledWith(dto);
  });

  it('should login a user', async () => {
    const req = { body: { email: 'john@example.com', password: '123456' } };
    expect(await controller.login(req)).toEqual({ accessToken: 'mockToken' });
    expect(userService.login).toHaveBeenCalledWith(req.body);
  });

  it('should logout a user', async () => {
    const req = { user: { sub: 1 } };
    expect(await controller.logout(req)).toEqual({ message: 'Logged out successfully' });
    expect(userService.logout).toHaveBeenCalledWith(req.user);
  });

  it('should update a user', async () => {
    const dto: UpdateUserDto = { firstName: 'Updated Name' };
    expect(await controller.updateUser(1, dto, { user: { sub: 1 } })).toEqual({ id: 1, ...dto });
    expect(userService.updateUser).toHaveBeenCalledWith(1, dto, { sub: 1 });
  });

  it('should return all users', async () => {
    expect(await controller.getAllUsers()).toEqual([{ id: 1, firstName: 'John Doe' }]);
    expect(userService.getAllUsers).toHaveBeenCalled();
  });

  it('should return a user by id', async () => {
    expect(await controller.getUserById(1)).toEqual({ id: 1, firstName: 'User1' });
    expect(userService.getUserById).toHaveBeenCalledWith(1);
  });

  it('should return profile of logged-in user', async () => {
    const req = { user: { sub: 1 } };
    expect(await controller.getProfile(req)).toEqual({ id: 1, firstName: 'User1' });
    expect(userService.getUserById).toHaveBeenCalledWith(1);
  });
});
