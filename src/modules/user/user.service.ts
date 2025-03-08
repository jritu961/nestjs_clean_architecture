import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role, User } from './user.entity';
import { CreateUserDto } from './dtos/register.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, firstName, lastName, email, phone, password, role } = createUserDto;

    if (!username || !email || !password) {
      throw new BadRequestException('Required fields are missing');
    }

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const validRole: Role = role && Object.values(Role).includes(role) ? role : Role.VIEWER;

    const newUser = this.userRepository.create({
      username,
      firstName,
      lastName,
      phone,
      email,
      password: hashedPassword,
      role: validRole as Role,
    });

    return this.userRepository.save(newUser);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.findByUserEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const { email, password } = user;

    if (!email || !password) {
      throw new BadRequestException('Email or password is missing');
    }

    const validUser = await this.validateUser(email, password);

    if (!validUser) {
      throw new BadRequestException('Invalid email or password');
    }

    const payload = { email: validUser.email, sub: validUser.id, role: validUser.role };

    return {
      status: true,
      message: 'Login successful',
      user: {
        id: validUser.id,
        username: validUser.username,
        email: validUser.email,
        role: validUser.role,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async logout(user: any) {
    return {
      status: true,
      message: 'Logout successful',
    };
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }
  async updateUser(id: number, updateUserDto: UpdateUserDto, loggedInUser: any): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Admin can update any user, others can only update themselves
    if (loggedInUser.role !== 'admin' && loggedInUser.sub !== user.id) {
      throw new ForbiddenException('You do not have permission to update this user');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOne({ where: { id } });
  }
  async findByUserEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
}
