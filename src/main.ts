import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as swaggerUi from 'swagger-ui-express';

export default async function handler(req: any, res: any) {
  const app = await NestFactory.create(AppModule, { bodyParser: true });

  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      max: 50,
      message: 'Terlalu banyak request, coba lagi nanti',
    }),
  );

  app.enableCors({ origin: true, credentials: true });

  const config = new DocumentBuilder()
    .setTitle('API END POINT')
    .setDescription('Dokumentasi API Lokal Database Geofisika')
    .setVersion('1.0')
    .addTag('Autentikasi')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // **gunakan swagger-ui-express langsung**
  app
    .getHttpAdapter()
    .getInstance()
    .use(
      '/api',
      swaggerUi.serve,
      swaggerUi.setup(document, {
        customSiteTitle: '⚡ Dokumentasi API Geofisika',
        customCss: `
        .swagger-ui .topbar { display: none; }
      `,
      }),
    );

  await app.init();
  app.getHttpAdapter().getInstance()(req, res);
}
