import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role, User } from './user.entity';
import { CreateUserDto } from './dtos/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Profile } from '../profile/profile.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @InjectRepository(Profile)  
    private readonly profileRepository:Repository<Profile>
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username,firstName,lastName, email,phone, password, role } = createUserDto;
  
    if (!username || !email || !password) {
      throw new BadRequestException('Required fields are missing');
    }
  
    // Check if the user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Validate role, default to USER
    const validRole: Role = role && Object.values(Role).includes(role) ? role : Role.USER;
  
    // Create new user
    const newUser = this.userRepository.create({
      username,
      firstName,
      lastName,
      phone,
      email,
      password: hashedPassword,
      role: validRole as Role,
    });
  
    // Save user first
    const savedUser = await this.userRepository.save(newUser);
  
    // Automatically create a profile for the user
    // Automatically create a profile for the user
const newProfile = this.profileRepository.create({
  user: savedUser,  
  firstName,   // ✅ Assign firstName
  lastName,    // ✅ Assign lastName
  bio: '',     // ✅ Provide a default value or take from DTO
  profilePicture: '',  // ✅ Default or take from DTO
});

// Save profile
await this.profileRepository.save(newProfile);

  
    return savedUser;  // Return the saved user (profile will be accessible via relations)
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
    console.log("userrr",user)
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

  async findByUserEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
}

