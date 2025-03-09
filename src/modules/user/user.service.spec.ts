import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User, Role } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';

const mockUserRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  find: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn().mockReturnValue('mockedJwtToken'),
});

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<Repository<User>>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useFactory: mockUserRepository },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const createUserDto = {
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '1234567890',
        password: 'password123',
        role: Role.VIEWER,
      };
  
      const mockUser = {
        id: 1,  // ✅ Ensure ID is included
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, 10), // ✅ Hashed password
      } as User;
  
      userRepository.findOne.mockResolvedValue(null); // No existing user
      userRepository.create.mockReturnValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);
  
      const result = await service.createUser(createUserDto);
  
      expect(result).toEqual(mockUser);
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
    });
  });
  

  describe('login', () => {
    it('should return JWT token on successful login', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        role: Role.VIEWER,
      } as User;

      userRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.login({ email: 'test@example.com', password: 'password123' });

      expect(result).toHaveProperty('access_token');
      expect(result.status).toBe(true);
    });

    it('should throw error if login credentials are invalid', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(service.login({ email: 'wrong@example.com', password: 'wrongpass' }))
        .rejects
        .toThrow(BadRequestException);
    });
  });

  describe('logout', () => {
    it('should return logout success message', async () => {
      const result = await service.logout({ id: 1 });
      expect(result).toEqual({
        status: true,
        message: 'Logout successful',
      });
    });
  });

  describe('getUserById', () => {
    it('should return user if found', async () => {
      const mockUser = { id: 1, email: 'test@example.com' } as User;
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getUserById(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(service.getUserById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUser', () => {
    it('should update user successfully if admin', async () => {
      const mockUser = { id: 1, email: 'test@example.com', role: Role.VIEWER } as User;
      userRepository.findOne.mockResolvedValue(mockUser);
  
      // ✅ Fix: Mock update to return a valid UpdateResult
      userRepository.update.mockResolvedValue({ affected: 1 } as UpdateResult);
  
      const updateUserDto = { firstName: 'Updated' };
      const loggedInUser = { sub: 2, role: 'admin' };
  
      await expect(service.updateUser(1, updateUserDto, loggedInUser)).resolves.not.toThrow();
    });
  
    it('should throw ForbiddenException if non-admin tries to update another user', async () => {
      const mockUser = { id: 1, email: 'test@example.com', role: Role.VIEWER } as User;
      userRepository.findOne.mockResolvedValue(mockUser);
  
      const updateUserDto = { firstName: 'Updated' };
      const loggedInUser = { sub: 2, role: 'editor' };
  
      await expect(service.updateUser(1, updateUserDto, loggedInUser)).rejects.toThrow(ForbiddenException);
    });
  });
});
