import { Module } from '@nestjs/common';
import { I18nModule } from 'nestjs-i18n';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';

@Module({
  imports: [
    I18nModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: path.join(__dirname, '/../i18n/'),
          watch: true,
        },
        typesOutputPath: path.join(__dirname, '../i18n/generated/i18n.generated.ts'),
        resolvers: [
          { use: 'Accept-Language', options: ['en', 'vi'] },
          { use: 'Header', options: ['Accept-Language'] },
        ],
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [I18nModule],
})
export class I18nConfigModule {} 