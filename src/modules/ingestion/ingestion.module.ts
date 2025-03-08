import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; // ✅ Import HttpModule
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { Ingestion } from './ingestion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ingestion]),
    HttpModule.register({  // ✅ Register Axios properly
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [IngestionController],
  providers: [IngestionService],
  exports: [IngestionService],
})
export class IngestionModule {}
