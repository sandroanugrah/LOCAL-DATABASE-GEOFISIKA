"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = require("helmet");
const express_rate_limit_1 = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
async function handler(req, res) {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bodyParser: true });
    app.use((0, helmet_1.default)());
    app.use((0, express_rate_limit_1.default)({
        windowMs: 60 * 1000,
        max: 50,
        message: 'Terlalu banyak request, coba lagi nanti',
    }));
    app.enableCors({ origin: true, credentials: true });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('API END POINT')
        .setDescription('Dokumentasi API Lokal Database Geofisika')
        .setVersion('1.0')
        .addTag('Autentikasi')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    const expressInstance = app.getHttpAdapter().getInstance();
    expressInstance.use('/api', swaggerUi.serve, swaggerUi.setup(document, {
        customSiteTitle: '⚡ Dokumentasi API Geofisika',
        customCss: `.swagger-ui .topbar { display: none; }`,
    }));
    expressInstance.get('/api-json', (req, res) => {
        res.json(document);
    });
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
    await app.init();
    expressInstance(req, res);
}
//# sourceMappingURL=main.js.map