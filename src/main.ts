import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { connectMongo } from './db/mongo';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  await connectMongo();

  const app = await NestFactory.create(AppModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle('Vayu Assignment API')
    .setDescription('Users, Groups & User-Groups endpoints')
    .setVersion('1.0.0')
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, doc);

  await app.listen(process.env.PORT || 3000);
  console.log(`HTTP on http://localhost:${process.env.PORT || 3000}`);
}
bootstrap();
