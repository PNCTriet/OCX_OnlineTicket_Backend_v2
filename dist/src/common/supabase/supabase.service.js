"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
let SupabaseService = class SupabaseService {
    constructor(configService) {
        this.configService = configService;
        const supabaseUrl = this.configService.get('supabase.url');
        const supabaseKey = this.configService.get('supabase.serviceRoleKey');
        if (!supabaseUrl || !supabaseKey) {
            console.warn('Supabase configuration not found. Using mock client for testing.');
            this.supabase = null;
            return;
        }
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
    }
    getClient() {
        if (!this.supabase) {
            throw new Error('Supabase client not initialized. Please check your environment variables.');
        }
        return this.supabase;
    }
    async getUserById(userId) {
        if (!this.supabase) {
            throw new Error('Supabase client not available');
        }
        const { data, error } = await this.supabase.auth.admin.getUserById(userId);
        if (error)
            throw error;
        return data.user;
    }
    async verifyToken(token) {
        if (!this.supabase) {
            throw new Error('Supabase client not available');
        }
        const { data, error } = await this.supabase.auth.getUser(token);
        if (error)
            throw error;
        return data.user;
    }
};
exports.SupabaseService = SupabaseService;
exports.SupabaseService = SupabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SupabaseService);
//# sourceMappingURL=supabase.service.js.map