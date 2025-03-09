import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Ingestions') // Group this controller in Swagger
@Controller('ingestions')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('trigger')
  @ApiOperation({ summary: 'Trigger document ingestion' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        documentId: { type: 'number', example: 1 },
      },
    },
  })
  async triggerIngestion(@Body() body: { documentId: number }) {
    return this.ingestionService.triggerIngestion(body.documentId);
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Check ingestion status by ID' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  async checkIngestionStatus(@Param('id') id: number) {
    return this.ingestionService.checkIngestionStatus(id);
  }

  @Get(':id/embeddings')
  @ApiOperation({ summary: 'Retrieve embeddings for a document by ID' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  async getEmbeddings(@Param('id') id: number) {
    return this.ingestionService.getMockEmbeddings(id);
  }
}
