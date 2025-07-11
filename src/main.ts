import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('🧾 OCX Online Ticket API')
    .setDescription('Hệ thống bán vé online - Swagger UI (Dark mode, Tabler icon)')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customCss: `body { background: #18181b !important; color: #fff !important; } .swagger-ui .topbar { background: #18181b !important; } .swagger-ui .topbar-wrapper img { content: url('https://tabler.io/static/logo.svg'); width: 40px; }`,
    customSiteTitle: '🧾 OCX Online Ticket API',
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap(); 