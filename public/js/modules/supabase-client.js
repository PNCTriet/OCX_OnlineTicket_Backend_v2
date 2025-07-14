import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.7/+esm'
import { SUPABASE_CONFIG } from '../config.js'

class SupabaseClient {
    constructor() {
        // Initialize Supabase client
        this.supabase = createClient(
            SUPABASE_CONFIG.url,
            SUPABASE_CONFIG.anonKey
        );
        
        // Log để debug
        console.log('Supabase initialized with URL:', SUPABASE_CONFIG.url);
    }

    // Users CRUD operations
    async getUsers() {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }
            console.log('Users data:', data); // Log để debug
            return data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    async createUser(userData) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .insert([userData])
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async updateUser(userId, userData) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .update(userData)
                .eq('id', userId)
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    async deleteUser(userId) {
        try {
            const { error } = await this.supabase
                .from('users')
                .delete()
                .eq('id', userId);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            const { data: { user }, error } = await this.supabase.auth.getUser();
            if (error) throw error;
            return user;
        } catch (error) {
            console.error('Error getting current user:', error);
            throw error;
        }
    }

    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;
            console.log('User signed out successfully');
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    }
}

// Create and export a single instance
const supabaseClient = new SupabaseClient();
export default supabaseClient; 