import { Injectable } from '@nestjs/common';

export interface IngestionStatus { // ✅ Make sure this interface is exported
  status: 'Processing' | 'Completed' | 'Failed';
  embeddings?: number[];
  id?:number
}

@Injectable()
export class IngestionService {
  private ingestionStore: Record<number, IngestionStatus> = {};

  async triggerIngestion(documentId: number): Promise<IngestionStatus> { // ✅ Explicit return type
    this.ingestionStore[documentId] = { status: 'Processing' };

    setTimeout(() => {
      const isSuccess = Math.random() > 0.2;
      this.ingestionStore[documentId] = {
        status: isSuccess ? 'Completed' : 'Failed',
        embeddings: isSuccess ? this.generateMockEmbeddings() : undefined,
      };
    }, 5000);

    return { status: 'Processing', id:documentId };
  }

  async checkIngestionStatus(documentId: number): Promise<IngestionStatus | { status: 'Not Found' }> { // ✅ Explicit return type
    return this.ingestionStore[documentId] || { status: 'Not Found' };
  }

  async getMockEmbeddings(documentId: number): Promise<number[] | { message: string }> { // ✅ Explicit return type
    return this.ingestionStore[documentId]?.embeddings || { message: 'Embeddings not available' };
  }

  private generateMockEmbeddings(): number[] {
    return Array.from({ length: 10 }, () => Math.random());
  }
}
