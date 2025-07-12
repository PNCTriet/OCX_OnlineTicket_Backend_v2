import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ConfigModule } from '@nestjs/config';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: 'test/test.env',
        }),
        AppModule,
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
      .expect(404); // This is expected as we don't have a root endpoint
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