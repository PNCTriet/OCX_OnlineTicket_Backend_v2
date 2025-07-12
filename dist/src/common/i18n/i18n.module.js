"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.I18nConfigModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_i18n_1 = require("nestjs-i18n");
const config_1 = require("@nestjs/config");
const path = require("path");
let I18nConfigModule = class I18nConfigModule {
};
exports.I18nConfigModule = I18nConfigModule;
exports.I18nConfigModule = I18nConfigModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_i18n_1.I18nModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
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
                inject: [config_1.ConfigService],
            }),
        ],
        exports: [nestjs_i18n_1.I18nModule],
    })
], I18nConfigModule);
//# sourceMappingURL=i18n.module.js.map