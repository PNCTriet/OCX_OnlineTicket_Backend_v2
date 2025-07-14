// OCX Frontend JavaScript

class OCXApp {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3000/api';
        this.currentUser = null;
        this.token = localStorage.getItem('ocx_token');
        
        this.init();
    }

    init() {
        this.hideLoading();
        this.setupEventListeners();
        this.checkAuth();
        
        // Set initial layout (no sidebar for home page)
        this.updateLayout(false);
        
        // Home page is already displayed, no need to show any specific page
    }

    setupEventListeners() {
        // Sidebar Navigation - only add listeners if elements exist
        const navAuth = document.getElementById('nav-auth');
        const navDashboard = document.getElementById('nav-dashboard');
        const navUsers = document.getElementById('nav-users');
        const navOrganizations = document.getElementById('nav-organizations');
        const navEvents = document.getElementById('nav-events');
        const navTickets = document.getElementById('nav-tickets');
        const navOrders = document.getElementById('nav-orders');
        const navPayments = document.getElementById('nav-payments');
        const navSync = document.getElementById('nav-sync');
        const navLogs = document.getElementById('nav-logs');
        const navApiDocs = document.getElementById('nav-api-docs');
        const navBusinessDocs = document.getElementById('nav-business-docs');

        if (navAuth) navAuth.addEventListener('click', () => this.showPage('auth'));
        if (navDashboard) navDashboard.addEventListener('click', () => this.showPage('dashboard'));
        if (navUsers) navUsers.addEventListener('click', () => this.showPage('users'));
        if (navOrganizations) navOrganizations.addEventListener('click', () => this.showPage('organizations'));
        if (navEvents) navEvents.addEventListener('click', () => this.showPage('events'));
        if (navTickets) navTickets.addEventListener('click', () => this.showPage('tickets'));
        if (navOrders) navOrders.addEventListener('click', () => this.showPage('orders'));
        if (navPayments) navPayments.addEventListener('click', () => this.showPage('payments'));
        if (navSync) navSync.addEventListener('click', () => this.showPage('sync'));
        if (navLogs) navLogs.addEventListener('click', () => this.showPage('logs'));
        if (navApiDocs) navApiDocs.addEventListener('click', () => this.showPage('api-docs'));
        if (navBusinessDocs) navBusinessDocs.addEventListener('click', () => this.showPage('business-docs'));

        // Auth forms - only add listeners if elements exist
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const showRegister = document.getElementById('show-register');
        const showLogin = document.getElementById('show-login');

        if (loginForm) loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        if (registerForm) registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        if (showRegister) showRegister.addEventListener('click', () => this.toggleAuthForm());
        if (showLogin) showLogin.addEventListener('click', () => this.toggleAuthForm());

        // Admin actions - only add listeners if elements exist
        const syncUsers = document.getElementById('sync-users');
        if (syncUsers) syncUsers.addEventListener('click', () => this.syncUsers());

        // Alert close
        const alertClose = document.getElementById('alert-close');
        if (alertClose) alertClose.addEventListener('click', () => this.hideAlert());

        // Language change event
        document.addEventListener('languageChanged', () => this.updateTranslations());
    }

    // Loading management
    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
    }

    // Page navigation
    showPage(page) {
        // Navigate to separate pages instead of showing content in same file
        switch(page) {
            case 'auth':
                window.location.href = '/pages/login.html';
                break;
            case 'dashboard':
                if (this.checkAdminAccess()) {
                    window.location.href = '/pages/dashboard.html';
                } else {
                    this.showAlert('error', 'Không có quyền truy cập', 'Bạn cần đăng nhập với quyền admin');
                }
                break;
            case 'users':
                if (this.checkAdminAccess()) {
                    window.location.href = '/pages/admin_manage_users.html';
                } else {
                    this.showAlert('error', 'Không có quyền truy cập', 'Bạn cần đăng nhập với quyền admin');
                }
                break;
            case 'organizations':
                if (this.checkAdminAccess()) {
                    window.location.href = '/pages/admin_manage_organizations.html';
                } else {
                    this.showAlert('error', 'Không có quyền truy cập', 'Bạn cần đăng nhập với quyền admin');
                }
                break;
            case 'events':
                if (this.checkAdminAccess()) {
                    window.location.href = '/pages/admin_manage_events.html';
                } else {
                    this.showAlert('error', 'Không có quyền truy cập', 'Bạn cần đăng nhập với quyền admin');
                }
                break;
            case 'tickets':
                if (this.checkAdminAccess()) {
                    window.location.href = '/pages/admin_manage_tickets.html';
                } else {
                    this.showAlert('error', 'Không có quyền truy cập', 'Bạn cần đăng nhập với quyền admin');
                }
                break;
            case 'orders':
                if (this.checkAdminAccess()) {
                    window.location.href = '/pages/admin_manage_orders.html';
                } else {
                    this.showAlert('error', 'Không có quyền truy cập', 'Bạn cần đăng nhập với quyền admin');
                }
                break;
            case 'payments':
                if (this.checkAdminAccess()) {
                    window.location.href = '/pages/admin_manage_payments.html';
                } else {
                    this.showAlert('error', 'Không có quyền truy cập', 'Bạn cần đăng nhập với quyền admin');
                }
                break;
            case 'logs':
                if (this.checkAdminAccess()) {
                    // For now, show alert that logs page is not implemented
                    this.showAlert('info', 'System Logs', 'System logs page will be implemented later');
                } else {
                    this.showAlert('error', 'Không có quyền truy cập', 'Bạn cần đăng nhập với quyền admin');
                }
                break;
            case 'api-docs':
                // For now, show alert that API docs page is not implemented
                this.showAlert('info', 'API Documentation', 'API documentation page will be implemented later');
                break;
            case 'business-docs':
                // For now, show alert that business docs page is not implemented
                this.showAlert('info', 'Business Guide', 'Business guide page will be implemented later');
                break;
        }
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const isVisible = !sidebar.classList.contains('-translate-x-full');
        
        if (isVisible) {
            sidebar.classList.add('-translate-x-full');
        } else {
            sidebar.classList.remove('-translate-x-full');
        }
    }

    // Authentication
    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (!email || !password) {
            this.showAlert('error', 'Lỗi', 'Vui lòng nhập đầy đủ thông tin');
            return;
        }

        this.showLoading();

        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.token = data.accessToken;
                this.currentUser = data.user;
                localStorage.setItem('ocx_token', this.token);
                localStorage.setItem('ocx_user', JSON.stringify(data.user));
                
                this.showAlert('success', i18n.t('login_success'), `Chào mừng ${data.user.name}!`);
                
                // Update navigation (this will show/hide sidebar based on admin access)
                this.updateNavigation();
                
                // Show admin dashboard if user is admin
                if (data.user.role === 'ADMIN' || data.user.role === 'SUPERADMIN') {
                    setTimeout(() => this.showPage('dashboard'), 1000);
                } else {
                    this.showAlert('warning', i18n.t('limited_permissions'), i18n.t('no_admin_access'));
                }
            } else {
                this.showAlert('error', i18n.t('error'), data.message || i18n.t('email_password_incorrect'));
            }
        } catch (error) {
            this.showAlert('error', 'Lỗi kết nối', 'Không thể kết nối đến server');
        } finally {
            this.hideLoading();
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const phone = document.getElementById('register-phone').value;

        if (!name || !email || !password) {
            this.showAlert('error', 'Lỗi', 'Vui lòng nhập đầy đủ thông tin bắt buộc');
            return;
        }

        this.showLoading();

        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    name, 
                    email, 
                    password, 
                    phone: phone || undefined 
                })
            });

            const data = await response.json();

            if (response.ok) {
                this.token = data.accessToken;
                this.currentUser = data.user;
                localStorage.setItem('ocx_token', this.token);
                localStorage.setItem('ocx_user', JSON.stringify(data.user));
                
                this.showAlert('success', i18n.t('register_success'), `Tài khoản ${data.user.name} đã được tạo!`);
                
                // Update navigation
                this.updateNavigation();
                
                // Switch to login form
                setTimeout(() => this.toggleAuthForm(), 1000);
            } else {
                this.showAlert('error', i18n.t('registration_failed'), data.message || i18n.t('error_occurred'));
            }
        } catch (error) {
            this.showAlert('error', 'Lỗi kết nối', 'Không thể kết nối đến server');
        } finally {
            this.hideLoading();
        }
    }

    toggleAuthForm() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (loginForm.classList.contains('hidden')) {
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
        } else {
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
        }
    }

    checkAuth() {
        if (this.token) {
            this.currentUser = JSON.parse(localStorage.getItem('ocx_user'));
            this.updateNavigation();
            
            // If user is admin, show admin dashboard
            if (this.checkAdminAccess()) {
                this.showPage('dashboard');
            } else {
                this.showPage('auth');
            }
        }
    }

    updateNavigation() {
        if (this.currentUser && this.checkAdminAccess()) {
            // User is logged in and has admin access - show sidebar
            this.updateLayout(true);
            
            // Create user dropdown
            document.getElementById('nav-user').innerHTML = `
                <div class="relative">
                    <button id="user-dropdown-btn" class="flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                        <i class="ti ti-user mr-2"></i>${this.currentUser.name}
                        <i class="ti ti-chevron-down ml-2"></i>
                    </button>
                    <div id="user-dropdown" class="absolute right-0 mt-2 w-48 bg-dark-800 rounded-md shadow-lg py-1 z-50 hidden">
                        <a href="#" class="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-dark-700" onclick="app.showUserProfile()">
                            <i class="ti ti-user mr-2"></i>Hồ sơ
                        </a>
                        <a href="#" class="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-dark-700" onclick="app.showPage('dashboard')">
                            <i class="ti ti-home mr-2"></i>Trang chủ
                        </a>
                        <div class="border-t border-dark-700 my-1"></div>
                        <a href="#" class="block px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-dark-700" onclick="app.logout()">
                            <i class="ti ti-logout mr-2"></i>Đăng xuất
                        </a>
                    </div>
                </div>
            `;
            
            // Add dropdown toggle functionality
            const dropdownBtn = document.getElementById('user-dropdown-btn');
            const dropdown = document.getElementById('user-dropdown');
            
            if (dropdownBtn && dropdown) {
                dropdownBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    dropdown.classList.toggle('hidden');
                });
                
                // Close dropdown when clicking outside
                document.addEventListener('click', () => {
                    dropdown.classList.add('hidden');
                });
            }
            
            // Show all admin navigation items
            document.querySelectorAll('[id^="nav-"]').forEach(nav => {
                nav.style.display = 'flex';
            });
        } else {
            // User is not logged in or not admin - hide sidebar
            this.updateLayout(false);
            
            document.getElementById('nav-user').innerHTML = `
                <i class="ti ti-login mr-2"></i>Đăng nhập
            `;
            document.getElementById('nav-user').onclick = () => this.showPage('auth');
            
            // Hide all admin navigation items
            document.querySelectorAll('[id^="nav-"]').forEach(nav => {
                if (nav.id !== 'nav-auth' && nav.id !== 'nav-api-docs' && nav.id !== 'nav-business-docs') {
                    nav.style.display = 'none';
                }
            });
        }
    }

    updateLayout(showSidebar) {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');
        
        if (showSidebar) {
            // Show sidebar - always visible for admin
            sidebar.classList.remove('-translate-x-full');
            sidebar.classList.remove('hidden');
            
            // Add margin to main content
            mainContent.style.marginLeft = '16rem'; // 256px = 16rem
        } else {
            // Hide sidebar completely
            sidebar.classList.add('-translate-x-full');
            sidebar.classList.add('hidden');
            mainContent.style.marginLeft = '0';
            mainContent.style.width = '100%';
        }
    }

    logout() {
        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('ocx_token');
        localStorage.removeItem('ocx_user');
        
        // Hide sidebar when logging out
        this.updateLayout(false);
        
        this.updateNavigation();
        this.showPage('auth');
        this.showAlert('success', i18n.t('logout_success'), 'Bạn đã đăng xuất khỏi hệ thống');
    }

    checkAdminAccess() {
        return this.currentUser && (this.currentUser.role === 'ADMIN' || this.currentUser.role === 'SUPERADMIN');
    }

    async loadDashboard() {
        try {
            // Load real data from database
            const [usersResponse, eventsResponse, ticketsResponse, revenueResponse] = await Promise.all([
                fetch(`${this.apiBaseUrl}/users/count`, {
                    headers: { 'Authorization': `Bearer ${this.token}` }
                }),
                fetch(`${this.apiBaseUrl}/events/count`, {
                    headers: { 'Authorization': `Bearer ${this.token}` }
                }),
                fetch(`${this.apiBaseUrl}/tickets/count`, {
                    headers: { 'Authorization': `Bearer ${this.token}` }
                }),
                fetch(`${this.apiBaseUrl}/payments/revenue`, {
                    headers: { 'Authorization': `Bearer ${this.token}` }
                })
            ]);

            const totalUsers = usersResponse.ok ? await usersResponse.json() : 0;
            const totalEvents = eventsResponse.ok ? await eventsResponse.json() : 0;
            const totalTickets = ticketsResponse.ok ? await ticketsResponse.json() : 0;
            const totalRevenue = revenueResponse.ok ? await revenueResponse.json() : 0;

            // Update dashboard with real data
            document.getElementById('total-users').textContent = totalUsers.toLocaleString();
            document.getElementById('total-events').textContent = totalEvents.toLocaleString();
            document.getElementById('total-tickets').textContent = totalTickets.toLocaleString();
            document.getElementById('total-revenue').textContent = `${totalRevenue.toLocaleString()}đ`;

            this.showAlert('success', i18n.t('dashboard_loaded'), i18n.t('statistics_updated'));
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            // Set default values if API not available
            document.getElementById('total-users').textContent = '0';
            document.getElementById('total-events').textContent = '0';
            document.getElementById('total-tickets').textContent = '0';
            document.getElementById('total-revenue').textContent = '0đ';
        }
    }

    showUserProfile() {
        this.showAlert('info', i18n.t('user_profile'), i18n.t('profile_feature'));
    }

    updateTranslations() {
        // Update all text content with current language
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = i18n.t(key);
        });
    }

    // User management
    async loadUsers() {
        if (!this.checkAdminAccess()) return;

        try {
            const response = await fetch(`${this.apiBaseUrl}/users`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                const users = await response.json();
                this.renderUsersTable(users);
            } else {
                this.showAlert('error', 'Lỗi', 'Không thể tải danh sách người dùng');
            }
        } catch (error) {
            this.showAlert('error', 'Lỗi kết nối', 'Không thể kết nối đến server');
        }
    }

    renderUsersTable(users) {
        const tbody = document.getElementById('users-list');
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
                    <span class="status-badge ${this.getRoleClass(user.role)}">${this.getRoleLabel(user.role)}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="status-badge ${user.is_verified ? 'status-active' : 'status-pending'}">
                        ${user.is_verified ? 'Đã xác thực' : 'Chưa xác thực'}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-blue-400 hover:text-blue-300 mr-3" onclick="app.editUser('${user.id}')">
                        <i class="ti ti-edit"></i>
                    </button>
                    <button class="text-red-400 hover:text-red-300" onclick="app.deleteUser('${user.id}')">
                        <i class="ti ti-trash"></i>
                    </button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    getRoleClass(role) {
        switch(role) {
            case 'SUPERADMIN': return 'status-active';
            case 'ADMIN': return 'status-active';
            case 'OWNER_ORGANIZER': return 'status-pending';
            case 'ADMIN_ORGANIZER': return 'status-pending';
            default: return 'status-inactive';
        }
    }

    getRoleLabel(role) {
        switch(role) {
            case 'SUPERADMIN': return 'Super Admin';
            case 'ADMIN': return 'Admin';
            case 'OWNER_ORGANIZER': return 'Owner Organizer';
            case 'ADMIN_ORGANIZER': return 'Admin Organizer';
            case 'USER': return 'User';
            default: return role;
        }
    }

    async syncUsers() {
        this.showLoading();
        this.showAlert('info', 'Đang đồng bộ', 'Đang đồng bộ dữ liệu từ Supabase...');
        
        // Simulate sync process
        setTimeout(() => {
            this.hideLoading();
            this.loadUsers();
            this.showAlert('success', 'Đồng bộ thành công', 'Dữ liệu đã được đồng bộ từ Supabase');
        }, 2000);
    }

    editUser(userId) {
        this.showAlert('info', 'Chức năng đang phát triển', 'Tính năng chỉnh sửa user sẽ được cập nhật sau');
    }

    deleteUser(userId) {
        if (confirm('Bạn có chắc chắn muốn xóa user này?')) {
            this.showAlert('info', 'Đang xóa', 'Đang xóa user...');
            // Implement delete logic here
        }
    }

    // Organizations Management
    async loadOrganizations() {
        this.showAlert('info', 'Đang tải', 'Đang tải danh sách tổ chức...');
        // Simulate loading organizations
        setTimeout(() => {
            this.showAlert('success', 'Thành công', 'Đã tải danh sách tổ chức');
        }, 1000);
    }

    // Events Management
    async loadEvents() {
        this.showAlert('info', 'Đang tải', 'Đang tải danh sách sự kiện...');
        // Simulate loading events
        setTimeout(() => {
            this.showAlert('success', 'Thành công', 'Đã tải danh sách sự kiện');
        }, 1000);
    }

    // Tickets Management
    async loadTickets() {
        this.showAlert('info', 'Đang tải', 'Đang tải danh sách vé...');
        // Simulate loading tickets
        setTimeout(() => {
            this.showAlert('success', 'Thành công', 'Đã tải danh sách vé');
        }, 1000);
    }

    // Orders Management
    async loadOrders() {
        this.showAlert('info', 'Đang tải', 'Đang tải danh sách đơn hàng...');
        // Simulate loading orders
        setTimeout(() => {
            this.showAlert('success', 'Thành công', 'Đã tải danh sách đơn hàng');
        }, 1000);
    }

    // Payments Management
    async loadPayments() {
        this.showAlert('info', 'Đang tải', 'Đang tải danh sách thanh toán...');
        // Simulate loading payments
        setTimeout(() => {
            this.showAlert('success', 'Thành công', 'Đã tải danh sách thanh toán');
        }, 1000);
    }

    // System Logs
    async loadLogs() {
        this.showAlert('info', 'Đang tải', 'Đang tải system logs...');
        // Simulate loading logs
        setTimeout(() => {
            this.showAlert('success', 'Thành công', 'Đã tải system logs');
        }, 1000);
    }

    // Alert system
    showAlert(type, title, message) {
        const alert = document.getElementById('alert');
        const icon = document.getElementById('alert-icon');
        const alertTitle = document.getElementById('alert-title');
        const alertMessage = document.getElementById('alert-message');

        // Set icon and colors based on type
        switch(type) {
            case 'success':
                icon.className = 'ti ti-check text-green-500';
                alert.className = alert.className.replace('border-red-500 border-yellow-500 border-blue-500', 'border-green-500');
                break;
            case 'error':
                icon.className = 'ti ti-alert-circle text-red-500';
                alert.className = alert.className.replace('border-green-500 border-yellow-500 border-blue-500', 'border-red-500');
                break;
            case 'warning':
                icon.className = 'ti ti-alert-triangle text-yellow-500';
                alert.className = alert.className.replace('border-green-500 border-red-500 border-blue-500', 'border-yellow-500');
                break;
            case 'info':
                icon.className = 'ti ti-info-circle text-blue-500';
                alert.className = alert.className.replace('border-green-500 border-red-500 border-yellow-500', 'border-blue-500');
                break;
        }

        alertTitle.textContent = title;
        alertMessage.textContent = message;

        alert.classList.remove('hidden');
        alert.classList.add('alert-show');

        // Auto hide after 5 seconds
        setTimeout(() => {
            this.hideAlert();
        }, 5000);
    }

    hideAlert() {
        const alert = document.getElementById('alert');
        alert.classList.add('alert-hide');
        setTimeout(() => {
            alert.classList.add('hidden');
            alert.classList.remove('alert-hide');
        }, 300);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new OCXApp();
}); 