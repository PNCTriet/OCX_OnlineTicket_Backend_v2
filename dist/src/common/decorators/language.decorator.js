"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Language = void 0;
const common_1 = require("@nestjs/common");
exports.Language = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['accept-language'] || 'en';
});
//# sourceMappingURL=language.decorator.js.map