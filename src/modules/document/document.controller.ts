import { Controller, Get, Post, Delete, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document.service';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Documents') // Group this controller in Swagger
@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a document' })
  @ApiConsumes('multipart/form-data') // Tell Swagger this endpoint accepts form-data
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary', // Required for file uploads in Swagger
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new Error('No file uploaded');
    return this.documentService.uploadDocument(file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all documents' })
  getAllDocuments() {
    return this.documentService.getDocuments();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a document' })
  deleteDocument(@Param('id') id: number) {
    return this.documentService.deleteDocument(id);
  }
}
