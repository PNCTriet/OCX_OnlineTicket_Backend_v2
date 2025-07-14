"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const request = require("supertest");
const app_module_1 = require("../src/app.module");
const config_1 = require("@nestjs/config");
describe('AppController (e2e)', () => {
    let app;
    beforeEach(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [
                config_1.ConfigModule.forRoot({
                    envFilePath: 'test/test.env',
                }),
                app_module_1.AppModule,
            ],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('api');
        await app.init();
    });
    afterEach(async () => {
        await app.close();
    });
    it('/api (GET) - API should be running', () => {
        return request(app.getHttpServer())
            .get('/api')
            .expect(404);
    });
    it('should have proper app structure', () => {
        expect(app).toBeDefined();
        expect(app.getHttpServer()).toBeDefined();
    });
    it('should handle 404 for unknown routes', () => {
        return request(app.getHttpServer())
            .get('/api/unknown-route')
            .expect(404);
    });
});
//# sourceMappingURL=app.e2e-spec.js.map