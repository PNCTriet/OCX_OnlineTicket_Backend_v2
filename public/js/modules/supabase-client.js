import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.7/+esm'

class SupabaseClient {
    constructor() {
        // Initialize Supabase client
        this.supabase = createClient(
            'YOUR_SUPABASE_URL',
            'YOUR_SUPABASE_ANON_KEY'
        );
    }

    // Users
    async getUsers() {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    // Organizations
    async getOrganizations() {
        try {
            const { data, error } = await this.supabase
                .from('organizations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching organizations:', error);
            throw error;
        }
    }

    // Events
    async getEvents() {
        try {
            const { data, error } = await this.supabase
                .from('events')
                .select(`
                    *,
                    organization:organizations(name)
                `)
                .order('start_date', { ascending: true });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching events:', error);
            throw error;
        }
    }

    // Tickets
    async getTickets() {
        try {
            const { data, error } = await this.supabase
                .from('tickets')
                .select(`
                    *,
                    event:events(name),
                    organization:organizations(name)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching tickets:', error);
            throw error;
        }
    }

    // Orders
    async getOrders() {
        try {
            const { data, error } = await this.supabase
                .from('orders')
                .select(`
                    *,
                    user:users(name, email),
                    ticket:tickets(name, price),
                    event:events(name)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    }

    // Payments
    async getPayments() {
        try {
            const { data, error } = await this.supabase
                .from('payments')
                .select(`
                    *,
                    order:orders(total_amount, status),
                    user:users(name, email)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching payments:', error);
            throw error;
        }
    }

    // Auth methods
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

    async signIn(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password
            });
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error signing in:', error);
            throw error;
        }
    }

    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    }
}

// Create and export a single instance
const supabaseClient = new SupabaseClient();
export default supabaseClient; 