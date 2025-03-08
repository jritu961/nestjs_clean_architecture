
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { TriggerIngestionDto } from './dto/trigger-ingestion.dto';


@Controller('ingestions')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('trigger')
  async triggerIngestion(@Body() triggerIngestionDto: TriggerIngestionDto) {
    return this.ingestionService.triggerIngestion(triggerIngestionDto.documentId);
  }

  @Get(':id/status')
  async checkIngestionStatus(@Param('id') id: number) {
    return this.ingestionService.checkIngestionStatus(id);
  }
}
