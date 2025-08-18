// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as swaggerUi from 'swagger-ui-express';

export default async function handler(req: any, res: any) {
  // 1. Inisialisasi Nest
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

  // 2. Setup Swagger document
  const config = new DocumentBuilder()
    .setTitle('API END POINT')
    .setDescription('Dokumentasi API Lokal Database Geofisika')
    .setVersion('1.0')
    .addTag('Autentikasi')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // 3. Setup Swagger UI pakai swagger-ui-express
  const expressInstance = app.getHttpAdapter().getInstance();
  expressInstance.use(
    '/api',
    swaggerUi.serve,
    swaggerUi.setup(document, {
      customSiteTitle: '⚡ Dokumentasi API Geofisika',
      customCss: `.swagger-ui .topbar { display: none; }`,
    }),
  );

  // 4. Setup Swagger JSON
  expressInstance.get('/api-json', (req, res) => {
    res.json(document);
  });

  // 5. Setup halaman utama "/" pakai HTML custom
  expressInstance.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.end(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>API Lokal Database Geofisika</title>
        <link rel="icon" href="https://img.icons8.com/fluency/48/api.png" />
        <style>
          body { font-family:sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; margin:0; background:linear-gradient(to right,#0f2027,#203a43,#2c5364); color:white; text-align:center; }
          h1 { font-size:3rem; margin-bottom:0.5rem; }
          p { font-size:1.2rem; max-width:600px; }
          a { margin-top:1.5rem; padding:10px 20px; background-color:#00b894; color:white; border-radius:8px; text-decoration:none; font-weight:bold; transition:0.3s; }
          a:hover { background-color:#019875; }
        </style>
      </head>
      <body>
        <h1>🌍 API Lokal Database Geofisika</h1>
        <p>Selamat datang di API lokal untuk sistem informasi geofisika. Akses endpoint, autentikasi, dan fitur log tersedia di sini.</p>
        <a href="/api">📄 Lihat Dokumentasi</a>
      </body>
      </html>
    `);
  });

  // 6. Jangan pakai app.listen di Vercel, cukup init
  await app.init();

  // 7. Panggil handler Express untuk setiap request
  expressInstance(req, res);
}
