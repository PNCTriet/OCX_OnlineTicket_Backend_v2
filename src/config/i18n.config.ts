import { registerAs } from '@nestjs/config';

export default registerAs('i18n', () => ({
  fallbackLanguage: 'en',
  loaderOptions: {
    path: 'src/i18n/',
    watch: true,
  },
})); 