import 'dotenv/config'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('User Management API')
    .setDescription('API documentation for user management system')
    .setVersion('1.0')
    .addBearerAuth() // Adds JWT Authentication
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 4004);
}
bootstrap();
