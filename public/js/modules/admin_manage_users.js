// Users Management Module
import componentLoader from './component-loader.js';
import i18n from '../i18n.js';
import supabaseClient from './supabase-client.js';

class UsersManagementModule {
    constructor() {
        this.isInitialized = false;
        this.currentPage = 1;
        this.pageSize = 10;
        this.totalUsers = 0;
        this.users = [];
        this.filters = {
            search: '',
            role: '',
            status: ''
        };

        // Wait for both DOM and i18n to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.waitForDependencies());
        } else {
            this.waitForDependencies();
        }
    }

    waitForDependencies() {
        console.log('[UsersManagement] Waiting for dependencies');
        // Add timeout to prevent infinite loading
        const timeout = setTimeout(() => {
            console.error('[UsersManagement] Initialization timeout - forcing page reload');
            window.location.reload();
        }, 10000);

        // Check if i18n is ready
        if (i18n.isInitialized) {
            console.log('[UsersManagement] i18n ready, proceeding to init');
            clearTimeout(timeout);
            this.init();
        } else {
            console.log('[UsersManagement] Waiting for i18n');
            document.addEventListener('i18nReady', () => {
                console.log('[UsersManagement] i18n ready event received');
                clearTimeout(timeout);
                if (!this.isInitialized) {
                    this.init();
                }
            }, { once: true });
        }
    }

    async init() {
        console.log('[UsersManagement] Initializing');
        if (this.isInitialized) return;
        this.isInitialized = true;

        try {
            // Check auth first
            const user = await supabaseClient.getCurrentUser();
            if (!user) {
                window.location.href = '/pages/login.html';
                return;
            }

            await this.loadComponents();
            this.setupEventListeners();
            await this.loadUsers();
            
        } catch (error) {
            console.error('[UsersManagement] Initialization error:', error);
            this.showAlert('error', i18n.t('error'), i18n.t('error_occurred'));
        } finally {
            this.hideLoading();
        }
    }

    async loadComponents() {
        try {
            console.log('[UsersManagement] Loading components');
            await componentLoader.loadComponent('sidebar', 'sidebar-container');
            await componentLoader.loadComponent('header', 'header-container');
            await componentLoader.loadComponent('alert', 'alert-container');
            console.log('[UsersManagement] Components loaded');
        } catch (error) {
            console.error('[UsersManagement] Error loading components:', error);
            throw error;
        }
    }

    setupEventListeners() {
        // Refresh button
        document.getElementById('refresh-users')?.addEventListener('click', () => this.loadUsers());

        // Add user button
        document.getElementById('add-user')?.addEventListener('click', () => this.showUserModal());

        // Search input
        document.getElementById('search-users')?.addEventListener('input', (e) => {
            this.filters.search = e.target.value;
            this.currentPage = 1;
            this.loadUsers();
        });

        // Role filter
        document.getElementById('filter-role')?.addEventListener('change', (e) => {
            this.filters.role = e.target.value;
            this.currentPage = 1;
            this.loadUsers();
        });

        // Status filter
        document.getElementById('filter-status')?.addEventListener('change', (e) => {
            this.filters.status = e.target.value;
            this.currentPage = 1;
            this.loadUsers();
        });

        // Pagination
        document.getElementById('prev-page')?.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.loadUsers();
            }
        });

        document.getElementById('next-page')?.addEventListener('click', () => {
            if (this.currentPage * this.pageSize < this.totalUsers) {
                this.currentPage++;
                this.loadUsers();
            }
        });

        // Modal form
        document.getElementById('user-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleUserSubmit();
        });

        document.getElementById('close-modal')?.addEventListener('click', () => {
            this.hideUserModal();
        });

        // Language change handler
        document.addEventListener('languageChanged', () => this.updateTranslations());
    }

    async loadUsers() {
        try {
            this.showLoading();
            
            // Get users from Supabase
            let users = await supabaseClient.getUsers();
            
            // Apply filters
            if (this.filters.search) {
                const searchLower = this.filters.search.toLowerCase();
                users = users.filter(user => 
                    user.name?.toLowerCase().includes(searchLower) ||
                    user.email?.toLowerCase().includes(searchLower)
                );
            }
            
            if (this.filters.role) {
                users = users.filter(user => user.role === this.filters.role);
            }
            
            if (this.filters.status) {
                users = users.filter(user => user.status === this.filters.status);
            }

            // Update total count
            this.totalUsers = users.length;
            document.getElementById('total-users-count').textContent = this.totalUsers;

            // Apply pagination
            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            this.users = users.slice(start, end);

            // Update pagination UI
            document.getElementById('current-page').textContent = this.currentPage;
            document.getElementById('prev-page').disabled = this.currentPage === 1;
            document.getElementById('next-page').disabled = end >= this.totalUsers;

            // Render users
            this.renderUsers();

        } catch (error) {
            console.error('Error loading users:', error);
            this.showAlert('error', 'Error', 'Failed to load users');
        } finally {
            this.hideLoading();
        }
    }

    renderUsers() {
        const tbody = document.getElementById('users-list');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.users.forEach(user => {
            const row = document.createElement('tr');
            row.className = 'border-b border-dark-700 hover:bg-dark-800';
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <div class="h-10 w-10 rounded-full bg-dark-700 flex items-center justify-center">
                                <i class="ti ti-user text-gray-400"></i>
                            </div>
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-white">${user.name || 'N/A'}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-300">${user.email}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-medium rounded-full ${this.getRoleClass(user.role)}">
                        ${user.role}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-medium rounded-full ${this.getStatusClass(user.status)}">
                        ${user.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    ${new Date(user.created_at).toLocaleDateString()}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-blue-400 hover:text-blue-300 mr-3" onclick="usersModule.editUser('${user.id}')">
                        <i class="ti ti-edit"></i>
                    </button>
                    <button class="text-red-400 hover:text-red-300" onclick="usersModule.deleteUser('${user.id}')">
                        <i class="ti ti-trash"></i>
                    </button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    getRoleClass(role) {
        const classes = {
            'ADMIN': 'bg-purple-500 bg-opacity-20 text-purple-500',
            'USER': 'bg-blue-500 bg-opacity-20 text-blue-500',
            'ORGANIZER': 'bg-green-500 bg-opacity-20 text-green-500'
        };
        return classes[role] || 'bg-gray-500 bg-opacity-20 text-gray-500';
    }

    getStatusClass(status) {
        const classes = {
            'ACTIVE': 'bg-green-500 bg-opacity-20 text-green-500',
            'INACTIVE': 'bg-red-500 bg-opacity-20 text-red-500',
            'PENDING': 'bg-yellow-500 bg-opacity-20 text-yellow-500'
        };
        return classes[status] || 'bg-gray-500 bg-opacity-20 text-gray-500';
    }

    showUserModal(userId = null) {
        const modal = document.getElementById('user-modal');
        const title = document.getElementById('modal-title');
        const form = document.getElementById('user-form');

        if (userId) {
            const user = this.users.find(u => u.id === userId);
            if (user) {
                title.textContent = 'Edit User';
                form.elements.name.value = user.name;
                form.elements.email.value = user.email;
                form.elements.role.value = user.role;
                form.elements.status.value = user.status;
                form.dataset.userId = userId;
            }
        } else {
            title.textContent = 'Add User';
            form.reset();
            delete form.dataset.userId;
        }

        modal.classList.remove('hidden');
    }

    hideUserModal() {
        const modal = document.getElementById('user-modal');
        modal.classList.add('hidden');
    }

    async handleUserSubmit() {
        const form = document.getElementById('user-form');
        const userId = form.dataset.userId;
        
        const userData = {
            name: form.elements.name.value,
            email: form.elements.email.value,
            role: form.elements.role.value,
            status: form.elements.status.value
        };

        try {
            if (userId) {
                // Update existing user
                const { data, error } = await supabaseClient.supabase
                    .from('users')
                    .update(userData)
                    .eq('id', userId);

                if (error) throw error;
                this.showAlert('success', 'Success', 'User updated successfully');
            } else {
                // Create new user
                const { data, error } = await supabaseClient.supabase
                    .from('users')
                    .insert([userData]);

                if (error) throw error;
                this.showAlert('success', 'Success', 'User created successfully');
            }

            this.hideUserModal();
            this.loadUsers();

        } catch (error) {
            console.error('Error saving user:', error);
            this.showAlert('error', 'Error', 'Failed to save user');
        }
    }

    async deleteUser(userId) {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const { error } = await supabaseClient.supabase
                .from('users')
                .delete()
                .eq('id', userId);

            if (error) throw error;

            this.showAlert('success', 'Success', 'User deleted successfully');
            this.loadUsers();

        } catch (error) {
            console.error('Error deleting user:', error);
            this.showAlert('error', 'Error', 'Failed to delete user');
        }
    }

    showAlert(type, title, message) {
        const alertEvent = new CustomEvent('showAlert', {
            detail: { type, title, message }
        });
        document.dispatchEvent(alertEvent);
    }

    showLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.classList.remove('hidden');
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.classList.add('hidden');
    }

    updateTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (key) element.textContent = i18n.t(key);
        });
    }
}

// Initialize the module
const usersModule = new UsersManagementModule();
export default usersModule; 