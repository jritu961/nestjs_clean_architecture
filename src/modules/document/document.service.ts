import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @Inject('Cloudinary') private cloudinary, // Inject Cloudinary

  ) {}

  async uploadDocument(file: Express.Multer.File) {
    if (!this.cloudinary) {
        throw new Error("Cloudinary instance is not defined!");
    }

    try {
        const result: any = await new Promise((resolve, reject) => {
            const uploadStream = this.cloudinary.uploader.upload_stream(
                {
                    resource_type: file.mimetype === 'application/pdf' ? 'image' : 'auto',
                    folder: 'documents',
                    use_filename: true,
                    unique_filename: false,
                    overwrite: true,
                    format: file.mimetype === 'application/pdf' ? 'jpg' : undefined, // Convert PDF to JPG for preview
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary upload error:", error);
                        return reject(new Error(`Cloudinary upload failed: ${error.message}`));
                    }
                    resolve(result);
                }
            );

            uploadStream.end(file.buffer);
        });

        console.log("Cloudinary Upload Result:", result);

        const document = this.documentRepository.create({
            filename: file.originalname,
            url: result.secure_url,
            mimetype: file.mimetype,
        });

        await this.documentRepository.save(document);
        return document;
    } catch (error) {
        console.error("Upload error:", error);
        throw new Error("Failed to upload document.");
    }
}



  async getDocuments() {
    return this.documentRepository.find();
  }

  async deleteDocument(id: number) {
    const doc = await this.documentRepository.findOne({ where: { id } });

    if (!doc) {
        throw new BadRequestException(`Document with ID ${id} not found`);
    }

    console.log("Document Found:", doc);

    // Extract the Cloudinary public ID from the URL
    const publicId = doc.url.split('/').pop()?.split('.')[0];  

    try {
        // Delete from Cloudinary
        const cloudinaryResponse = await this.cloudinary.uploader.destroy(`documents/${publicId}`);
        console.log("Cloudinary Delete Response:", cloudinaryResponse);

        // If Cloudinary deletion was successful, delete from the database
        if (cloudinaryResponse.result === "ok") {
            await this.documentRepository.delete(id);
            return { message: `Document with ID ${id} deleted successfully` };
        } else {
            throw new Error("Failed to delete file from Cloudinary");
        }
    } catch (error) {
        console.error("Error deleting document:", error);
        throw new Error("Error deleting document");
    }
}

}
 