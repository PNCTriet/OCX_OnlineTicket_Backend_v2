"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('i18n', () => ({
    fallbackLanguage: 'en',
    loaderOptions: {
        path: 'src/i18n/',
        watch: true,
    },
}));
//# sourceMappingURL=i18n.config.js.map