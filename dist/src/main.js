"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    const publicPath = process.env.NODE_ENV === 'production'
        ? (0, path_1.join)(__dirname, '..', 'public')
        : (0, path_1.join)(__dirname, '..', '..', 'public');
    app.useStaticAssets(publicPath, {
        prefix: '/',
    });
    app.setGlobalPrefix('api', {
        exclude: ['/'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('🧾 OCX Online Ticket API')
        .setDescription('Hệ thống bán vé online - Swagger UI (Dark mode, Tabler icon)')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document, {
        customCss: `body { background: #18181b !important; color: #fff !important; } .swagger-ui .topbar { background: #18181b !important; } .swagger-ui .topbar-wrapper img { content: url('https://tabler.io/static/logo.svg'); width: 40px; }`,
        customSiteTitle: '🧾 OCX Online Ticket API',
    });
    await app.listen(process.env.PORT || 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map