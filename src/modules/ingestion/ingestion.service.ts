import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

export interface IngestionStatus {
  status: 'Processing' | 'Completed' | 'Failed';
  embeddings?: number[];
  id?: number;
}

@Injectable()
export class IngestionService {
  private ingestionStore: Record<number, IngestionStatus> = {};

  constructor(private readonly httpService: HttpService) {}

  /**
   * Trigger ingestion for a document via mock service
   * @param documentId - The ID of the document to ingest
   * @returns {IngestionStatus} - Initial status of the ingestion
   */
  async triggerIngestion(documentId: number): Promise<IngestionStatus> {
    try {
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:3001/api/ingest', { documentId }),
      );

      if (response.data.success) {
        this.ingestionStore[documentId] = { status: 'Processing', id: documentId };
      } else {
        this.ingestionStore[documentId] = { status: 'Failed', id: documentId };
      }

      return this.ingestionStore[documentId];
    } catch (error) {
      console.error('Ingestion failed:', error.message);
      return { status: 'Failed', id: documentId };
    }
  }

  /**
   * Check the status of an ingestion
   * @param documentId - The ID of the document to check
   * @returns {IngestionStatus | { status: 'Not Found' }} - Status or 'Not Found'
   */
  async checkIngestionStatus(documentId: number): Promise<IngestionStatus | { status: 'Not Found' }> {
    return this.ingestionStore[documentId] || { status: 'Not Found' };
  }

}
