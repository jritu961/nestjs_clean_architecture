// user.module.ts
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/jwt.strategy';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }), // Register Passport with JWT strategy
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_secret_key', // Secret key for signing tokens
      signOptions: { expiresIn: '1h' }, // Token expiry
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy ],
  exports: [UserService, JwtStrategy,JwtModule, TypeOrmModule],
})
export class UserModule {}
