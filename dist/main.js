"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const app_module_1 = require("./app.module");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = require("helmet");
const express_rate_limit_1 = require("express-rate-limit");
async function handler(req, res) {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bodyParser: true,
    });
    app.set('trust proxy', 1);
    app.use((0, helmet_1.default)());
    app.use((0, express_rate_limit_1.default)({
        windowMs: 1 * 60 * 1000,
        max: 50,
        message: 'Terlalu banyak request, coba lagi nanti',
    }));
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('API END POINT')
        .setDescription('Dokumentasi API Lokal Database Geofisika')
        .setVersion('1.0')
        .addTag('Autentikasi')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document, {
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
//# sourceMappingURL=main.js.map