import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingestion } from './ingestion.entity';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class IngestionService {
  constructor(
    @InjectRepository(Ingestion)  // ✅ Inject TypeORM Repository correctly
    private readonly ingestionRepository: Repository<Ingestion>,
    private readonly httpService: HttpService, // ✅ Ensure HttpService is injected properly
  ) {}

  async triggerIngestion(documentId: number) {
    const ingestion = this.ingestionRepository.create({ documentId, status: 'pending' });
    await this.ingestionRepository.save(ingestion);

    try {
      const response = await this.httpService
        .post('http://localhost:3001/api/ingest', { documentId }) // Call mock service
        .toPromise();

      ingestion.status = 'in_progress';
      await this.ingestionRepository.save(ingestion);

      return { message: 'Ingestion started successfully', ingestionId: ingestion.id };
    } catch (error) {
      ingestion.status = 'failed';
      ingestion.errorMessage = error.message;
      await this.ingestionRepository.save(ingestion);
      throw new Error('Failed to trigger ingestion');
    }
  }

  async checkIngestionStatus(ingestionId: number) {
    const ingestion = await this.ingestionRepository.findOne({ where: { id: ingestionId } }); // ✅ Fix findOne usage
    if (!ingestion) {
      throw new Error('Ingestion not found');
    }
    return ingestion;
  }
}
