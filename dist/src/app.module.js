"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const database_config_1 = require("./config/database.config");
const supabase_config_1 = require("./config/supabase.config");
const jwt_config_1 = require("./config/jwt.config");
const prisma_module_1 = require("./common/prisma/prisma.module");
const supabase_module_1 = require("./common/supabase/supabase.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const events_module_1 = require("./events/events.module");
const tickets_module_1 = require("./tickets/tickets.module");
const payments_module_1 = require("./payments/payments.module");
const organizations_module_1 = require("./organizations/organizations.module");
const orders_module_1 = require("./orders/orders.module");
const webhooks_module_1 = require("./webhooks/webhooks.module");
const i18n_module_1 = require("./common/i18n/i18n.module");
const app_controller_1 = require("./app.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [database_config_1.default, supabase_config_1.default, jwt_config_1.default],
            }),
            prisma_module_1.PrismaModule,
            supabase_module_1.SupabaseModule,
            i18n_module_1.I18nConfigModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            events_module_1.EventsModule,
            tickets_module_1.TicketsModule,
            payments_module_1.PaymentsModule,
            organizations_module_1.OrganizationsModule,
            orders_module_1.OrdersModule,
            webhooks_module_1.WebhooksModule,
        ],
        controllers: [app_controller_1.AppController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map