"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const request = require("supertest");
const app_module_1 = require("../src/app.module");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
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
        app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
        await app.init();
    });
    afterAll(async () => {
        await app.close();
    });
    it('/api/docs (GET) - Swagger documentation', () => {
        return request(app.getHttpServer())
            .get('/docs')
            .expect(200);
    });
    it('/api/auth/register (POST)', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/auth/register')
            .send({
            email: 'test@example.com',
            name: 'Test User',
            password: 'password123',
            phone: '1234567890',
        });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.email).toBe('test@example.com');
    }, 15000);
    it('/api/auth/login (POST)', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/auth/login')
            .send({
            email: 'test@example.com',
            password: 'password123',
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('user');
    }, 15000);
    it('/api/auth/login (POST) - invalid credentials', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/auth/login')
            .send({
            email: 'wrong@example.com',
            password: 'wrongpassword',
        });
        expect(response.status).toBe(401);
    }, 15000);
});
//# sourceMappingURL=app.e2e-spec.js.map