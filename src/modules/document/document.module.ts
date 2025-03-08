import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './document.entity';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { User } from '../user/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/jwt.strategy';
import { MulterModule } from '@nestjs/platform-express';
import { CloudinaryProvider } from '../utils/cloudinary.config';

@Module({
  imports: [TypeOrmModule.forFeature([Document,User]),
  // MulterModule.register(multerOptions),
  PassportModule.register({ defaultStrategy: 'jwt' }), // Register Passport with JWT strategy
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_secret_key', // Secret key for signing tokens
      signOptions: { expiresIn: '1h' }, // Token expiry
    }),], // Import both Document and User entities
  controllers: [DocumentController], 
  providers: [DocumentService,CloudinaryProvider], 
  exports: [DocumentService ], // Exporting service for use in other modules if needed
})
export class DocumentModule {}
