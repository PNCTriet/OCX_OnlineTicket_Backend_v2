// Internationalization (i18n) for OCX Frontend

class I18n {
    constructor() {
        this.currentLanguage = localStorage.getItem('ocx_language') || 'en';
        this.translations = {
            en: {
                // Common
                'dashboard': 'Dashboard',
                'login': 'Login',
                'logout': 'Logout',
                'register': 'Register',
                'profile': 'Profile',
                'home': 'Home',
                'loading': 'Loading...',
                'error': 'Error',
                'success': 'Success',
                'warning': 'Warning',
                'info': 'Information',
                
                // Navigation
                'users_management': 'Users Management',
                'organizations_management': 'Organizations Management',
                'events_management': 'Events Management',
                'tickets_management': 'Tickets Management',
                'orders_management': 'Orders Management',
                'payments_management': 'Payments Management',
                'system_logs': 'System Logs',
                'api_documentation': 'API Documentation',
                'business_guide': 'Business Guide',
                'sync_data': 'Sync Data',
                
                // Dashboard
                'total_users': 'Total Users',
                'total_events': 'Total Events',
                'total_tickets': 'Total Tickets',
                'total_revenue': 'Total Revenue',
                'revenue_by_month': 'Revenue by Month',
                'upcoming_events': 'Upcoming Events',
                'recent_activity': 'Recent Activity',
                'chart_placeholder': 'Chart will be displayed here',
                'no_events': 'No events available',
                'will_display_when_data': 'Will display when data is available',
                'system_ready': 'System Ready',
                'welcome_message': 'Welcome to OCX Ticket System',
                'just_now': 'Just now',
                
                // Auth
                'email': 'Email',
                'password': 'Password',
                'name': 'Name',
                'phone': 'Phone',
                'login_title': 'Login',
                'login_subtitle': 'Access ticket management system',
                'register_title': 'Register',
                'register_subtitle': 'Create new account',
                'login_success': 'Login successful',
                'register_success': 'Registration successful',
                'logout_success': 'Logout successful',
                'access_denied': 'Access denied',
                'need_admin_access': 'You need admin access',
                'limited_permissions': 'Limited permissions',
                'no_admin_access': 'You do not have access to admin dashboard',
                'connection_error': 'Connection error',
                'cannot_connect_server': 'Cannot connect to server',
                'please_enter_info': 'Please enter all required information',
                'email_password_incorrect': 'Email or password is incorrect',
                'registration_failed': 'Registration failed',
                'error_occurred': 'An error occurred',
                
                // User Management
                'sync_users': 'Sync Users',
                'sync_data_supabase': 'Sync data from Supabase',
                'sync_in_progress': 'Syncing...',
                'sync_success': 'Sync successful',
                'data_synced_supabase': 'Data has been synced from Supabase',
                'edit_user': 'Edit User',
                'delete_user': 'Delete User',
                'confirm_delete_user': 'Are you sure you want to delete this user?',
                'deleting_user': 'Deleting user...',
                'feature_development': 'Feature in development',
                'edit_user_feature': 'Edit user feature will be updated later',
                'cannot_load_users': 'Cannot load user list',
                
                // Status
                'verified': 'Verified',
                'unverified': 'Unverified',
                'active': 'Active',
                'inactive': 'Inactive',
                'pending': 'Pending',
                
                // Roles
                'super_admin': 'Super Admin',
                'admin': 'Admin',
                'owner_organizer': 'Owner Organizer',
                'admin_organizer': 'Admin Organizer',
                'user': 'User',
                
                // Actions
                'sync': 'Sync',
                'edit': 'Edit',
                'delete': 'Delete',
                'save': 'Save',
                'cancel': 'Cancel',
                'close': 'Close',
                'refresh': 'Refresh',
                
                // Messages
                'dashboard_loaded': 'Dashboard loaded',
                'statistics_updated': 'Statistics have been updated',
                'user_profile': 'User Profile',
                'profile_feature': 'Profile feature will be developed later'
            },
            vi: {
                // Common
                'dashboard': 'Dashboard',
                'login': 'Đăng nhập',
                'logout': 'Đăng xuất',
                'register': 'Đăng ký',
                'profile': 'Hồ sơ',
                'home': 'Trang chủ',
                'loading': 'Đang tải...',
                'error': 'Lỗi',
                'success': 'Thành công',
                'warning': 'Cảnh báo',
                'info': 'Thông tin',
                
                // Navigation
                'users_management': 'Quản lý Users',
                'organizations_management': 'Quản lý Organizations',
                'events_management': 'Quản lý Events',
                'tickets_management': 'Quản lý Tickets',
                'orders_management': 'Quản lý Orders',
                'payments_management': 'Quản lý Payments',
                'system_logs': 'System Logs',
                'api_documentation': 'API Documentation',
                'business_guide': 'Business Guide',
                'sync_data': 'Đồng bộ dữ liệu',
                
                // Dashboard
                'total_users': 'Tổng Users',
                'total_events': 'Sự kiện',
                'total_tickets': 'Vé đã bán',
                'total_revenue': 'Doanh thu',
                'revenue_by_month': 'Doanh thu theo tháng',
                'upcoming_events': 'Sự kiện sắp tới',
                'recent_activity': 'Hoạt động gần đây',
                'chart_placeholder': 'Biểu đồ sẽ được hiển thị ở đây',
                'no_events': 'Chưa có sự kiện nào',
                'will_display_when_data': 'Sẽ hiển thị khi có dữ liệu',
                'system_ready': 'Hệ thống đã sẵn sàng',
                'welcome_message': 'Chào mừng bạn đến với OCX Ticket System',
                'just_now': 'Vừa xong',
                
                // Auth
                'email': 'Email',
                'password': 'Mật khẩu',
                'name': 'Họ tên',
                'phone': 'Số điện thoại',
                'login_title': 'Đăng nhập',
                'login_subtitle': 'Vào hệ thống quản lý vé',
                'register_title': 'Đăng ký',
                'register_subtitle': 'Tạo tài khoản mới',
                'login_success': 'Đăng nhập thành công',
                'register_success': 'Đăng ký thành công',
                'logout_success': 'Đăng xuất thành công',
                'access_denied': 'Không có quyền truy cập',
                'need_admin_access': 'Bạn cần đăng nhập với quyền admin',
                'limited_permissions': 'Quyền hạn hạn chế',
                'no_admin_access': 'Bạn không có quyền truy cập vào admin dashboard',
                'connection_error': 'Lỗi kết nối',
                'cannot_connect_server': 'Không thể kết nối đến server',
                'please_enter_info': 'Vui lòng nhập đầy đủ thông tin',
                'email_password_incorrect': 'Email hoặc mật khẩu không đúng',
                'registration_failed': 'Đăng ký thất bại',
                'error_occurred': 'Có lỗi xảy ra',
                
                // User Management
                'sync_users': 'Đồng bộ',
                'sync_data_supabase': 'Đồng bộ dữ liệu từ Supabase',
                'sync_in_progress': 'Đang đồng bộ...',
                'sync_success': 'Đồng bộ thành công',
                'data_synced_supabase': 'Dữ liệu đã được đồng bộ từ Supabase',
                'edit_user': 'Chỉnh sửa User',
                'delete_user': 'Xóa User',
                'confirm_delete_user': 'Bạn có chắc chắn muốn xóa user này?',
                'deleting_user': 'Đang xóa user...',
                'feature_development': 'Chức năng đang phát triển',
                'edit_user_feature': 'Tính năng chỉnh sửa user sẽ được cập nhật sau',
                'cannot_load_users': 'Không thể tải danh sách người dùng',
                
                // Status
                'verified': 'Đã xác thực',
                'unverified': 'Chưa xác thực',
                'active': 'Hoạt động',
                'inactive': 'Không hoạt động',
                'pending': 'Chờ xử lý',
                
                // Roles
                'super_admin': 'Super Admin',
                'admin': 'Admin',
                'owner_organizer': 'Owner Organizer',
                'admin_organizer': 'Admin Organizer',
                'user': 'User',
                
                // Actions
                'sync': 'Đồng bộ',
                'edit': 'Chỉnh sửa',
                'delete': 'Xóa',
                'save': 'Lưu',
                'cancel': 'Hủy',
                'close': 'Đóng',
                'refresh': 'Làm mới',
                
                // Messages
                'dashboard_loaded': 'Dashboard đã tải',
                'statistics_updated': 'Dữ liệu thống kê đã được cập nhật',
                'user_profile': 'Hồ sơ người dùng',
                'profile_feature': 'Tính năng hồ sơ sẽ được phát triển sau'
            }
        };
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    init() {
        this.updateLanguageDisplay();
        this.setupEventListeners();
        // Dispatch event that i18n is ready
        document.dispatchEvent(new Event('i18nReady'));
    }
    
    setupEventListeners() {
        const languageBtn = document.getElementById('language-btn');
        const languageDropdown = document.getElementById('language-dropdown');
        
        if (languageBtn && languageDropdown) {
            languageBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                languageDropdown.classList.toggle('hidden');
            });
            
            document.addEventListener('click', () => {
                languageDropdown.classList.add('hidden');
            });
        }
    }
    
    changeLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('ocx_language', lang);
        this.updateLanguageDisplay();
        
        // Trigger language change event
        const event = new CustomEvent('languageChanged', { detail: { language: lang } });
        document.dispatchEvent(event);
    }
    
    updateLanguageDisplay() {
        const currentLang = document.getElementById('current-lang');
        const enCheck = document.getElementById('en-check');
        const viCheck = document.getElementById('vi-check');
        
        if (currentLang) {
            currentLang.textContent = this.currentLanguage.toUpperCase();
        }
        
        if (enCheck && viCheck) {
            enCheck.classList.toggle('hidden', this.currentLanguage !== 'en');
            viCheck.classList.toggle('hidden', this.currentLanguage !== 'vi');
        }
    }
    
    t(key) {
        return this.translations[this.currentLanguage]?.[key] || key;
    }
}

// Create and export a single instance
const i18n = new I18n();
export default i18n; 