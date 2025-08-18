import { AppModule } from '@/app.module';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

export default async function handler(req: any, res: any) {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
  });

  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000,
      max: 50,
      message: 'Terlalu banyak request, coba lagi nanti',
    }),
  );

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('API END POINT')
    .setDescription('Dokumentasi API Lokal Database Geofisika')
    .setVersion('1.0')
    .addTag('Autentikasi')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    customSiteTitle: '⚡ Dokumentasi API Geofisika',
    customCss: `
        .swagger-ui .topbar {
            display: none;
        }
        ::-webkit-scrollbar {
            width: 10px;
        }
        ::-webkit-scrollbar-track {
            background:rgb(255, 255, 255);
            border-radius: 8px;
        }
        ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #1abc9c, #00bcd4);
            border-radius: 8px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #16a085, #0097a7);
        }
        `,
    customfavIcon: 'https://img.icons8.com/fluency/48/api.png',
  });

  await app.init();
  app.getHttpAdapter().getInstance()(req, res);
}
