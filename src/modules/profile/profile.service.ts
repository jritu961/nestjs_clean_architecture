import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { User } from '../user/user.entity';
import { UpdateProfileDto } from './dtos/profile.dto';


@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getProfile(userId: number): Promise<Profile> {
    const profile = await this.profileRepository.findOne({ where: { user: { id: userId } } });
    if (!profile) {
      throw new NotFoundException(`Profile not found for user ID ${userId}`);
    }
    return profile;
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<Profile> {
    let profile = await this.profileRepository.findOne({ where: { user: { id: userId } } });

    if (!profile) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User not found`);
      }
      profile = this.profileRepository.create({ ...updateProfileDto, user });
    } else {
      this.profileRepository.merge(profile, updateProfileDto);
    }

    return this.profileRepository.save(profile);
  }
}
