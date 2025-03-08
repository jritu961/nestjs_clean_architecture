import { Controller, Get, Post, Delete, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document.service';

@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new Error('No file uploaded');
    return this.documentService.uploadDocument(file);
  }
  

  @Get()
  getAllDocuments() {
    return this.documentService.getDocuments();
  }

  @Delete(':id')
  deleteDocument(@Param('id') id: number) {
    return this.documentService.deleteDocument(id);
  }
}
