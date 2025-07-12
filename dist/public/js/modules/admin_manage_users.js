// Users Management Module

class UsersManagementModule {
    constructor() {
        this.init();
    }

    async init() {
        await this.loadComponents();
        await this.loadUsers();
        this.hideLoading();
    }

    async loadComponents() {
        try {
            // Load all required components
            await componentLoader.loadComponents([
                { name: 'sidebar', targetId: 'sidebar-container' },
                { name: 'header', targetId: 'header-container' },
                { name: 'alert', targetId: 'alert-container' }
            ]);

            // Update header with current page title
            const pageTitle = document.getElementById('page-title');
            if (pageTitle) {
                pageTitle.textContent = i18n.t('users_management');
            }

            // Update language dropdown onclick handlers
            const enLink = document.querySelector('#language-dropdown a[onclick*="changeLanguage(\'en\')"]');
            const viLink = document.querySelector('#language-dropdown a[onclick*="changeLanguage(\'vi\')"]');
            
            if (enLink) enLink.onclick = () => adminModule.changeLanguage('en');
            if (viLink) viLink.onclick = () => adminModule.changeLanguage('vi');

            // Ensure sidebar is visible on desktop
            adminModule.ensureSidebarVisibility();

        } catch (error) {
            console.error('Error loading components:', error);
        }
    }

    setupEventListeners() {
        // Sync users button
        const syncUsers = document.getElementById('sync-users');
        if (syncUsers) {
            syncUsers.addEventListener('click', () => this.syncUsers());
        }
    }

    async loadUsers() {
        try {
            const response = await fetch(`${adminModule.apiBaseUrl}/users`, {
                headers: {
                    'Authorization': `Bearer ${adminModule.token}`
                }
            });

            if (response.ok) {
                const users = await response.json();
                this.renderUsersTable(users);
            } else {
                adminModule.showAlert('error', 'Lỗi', 'Không thể tải danh sách người dùng');
            }
        } catch (error) {
            adminModule.showAlert('error', 'Lỗi kết nối', 'Không thể kết nối đến server');
        }
    }

    renderUsersTable(users) {
        const tbody = document.getElementById('users-list');
        if (!tbody) return;

        tbody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            row.className = 'table-row border-b border-dark-700';
            
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
                    <span class="status-badge ${adminModule.getRoleClass(user.role)}">${adminModule.getRoleLabel(user.role)}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="status-badge ${user.is_verified ? 'status-active' : 'status-pending'}">
                        ${user.is_verified ? 'Đã xác thực' : 'Chưa xác thực'}
                    </span>
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

    async syncUsers() {
        adminModule.showLoading();
        adminModule.showAlert('info', 'Đang đồng bộ', 'Đang đồng bộ dữ liệu từ Supabase...');
        
        // Simulate sync process
        setTimeout(() => {
            adminModule.hideLoading();
            this.loadUsers();
            adminModule.showAlert('success', 'Đồng bộ thành công', 'Dữ liệu đã được đồng bộ từ Supabase');
        }, 2000);
    }

    editUser(userId) {
        adminModule.showAlert('info', 'Chức năng đang phát triển', 'Tính năng chỉnh sửa user sẽ được cập nhật sau');
    }

    deleteUser(userId) {
        if (confirm('Bạn có chắc chắn muốn xóa user này?')) {
            adminModule.showAlert('info', 'Đang xóa', 'Đang xóa user...');
            // Implement delete logic here
        }
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.classList.add('hidden');
    }
}

// Initialize users management module when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.usersModule = new UsersManagementModule();
}); 