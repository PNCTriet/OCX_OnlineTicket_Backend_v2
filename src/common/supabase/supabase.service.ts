import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get('supabase.url');
    const supabaseKey = this.configService.get('supabase.serviceRoleKey');
    
    // Kiểm tra environment variables
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase configuration not found. Using mock client for testing.');
      this.supabase = null;
      return;
    }

    this.supabase = createClient(
      supabaseUrl,
      supabaseKey,
    );
  }

  getClient(): SupabaseClient {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized. Please check your environment variables.');
    }
    return this.supabase;
  }

  async getUserById(userId: string) {
    if (!this.supabase) {
      throw new Error('Supabase client not available');
    }
    const { data, error } = await this.supabase.auth.admin.getUserById(userId);
    if (error) throw error;
    return data.user;
  }

  async verifyToken(token: string) {
    if (!this.supabase) {
      throw new Error('Supabase client not available');
    }
    const { data, error } = await this.supabase.auth.getUser(token);
    if (error) throw error;
    return data.user;
  }
} 