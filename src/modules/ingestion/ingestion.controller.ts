import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { IngestionService } from './ingestion.service';

@Controller('ingestions')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('trigger')
  async triggerIngestion(@Body() body: { documentId: number }) {
    return this.ingestionService.triggerIngestion(body.documentId);
  }

  @Get(':id/status')
  async checkIngestionStatus(@Param('id') id: number) {
    return this.ingestionService.checkIngestionStatus(id);
  }

  @Get(':id/embeddings')
  async getEmbeddings(@Param('id') id: number) {
    return this.ingestionService.getMockEmbeddings(id);
  }
}
