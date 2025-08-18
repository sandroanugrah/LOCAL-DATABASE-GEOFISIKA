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
    app
        .getHttpAdapter()
        .getInstance()
        .use('/api', swaggerUi.serve, swaggerUi.setup(document, {
        customSiteTitle: '⚡ Dokumentasi API Geofisika',
        customCss: `
        .swagger-ui .topbar { display: none; }
      `,
    }));
    await app.init();
    app.getHttpAdapter().getInstance()(req, res);
}
//# sourceMappingURL=main.js.map