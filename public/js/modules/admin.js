// Common Admin Module - Shared functionality for all admin pages
import componentLoader from './component-loader.js';
import i18n from '../i18n.js';

export class AdminModule {
    constructor() {
        console.log('[Admin] Constructor called');
        this.apiBaseUrl = 'http://localhost:3000/api';
        this.token = localStorage.getItem('ocx_token');
        this.currentUser = JSON.parse(localStorage.getItem('ocx_user'));
        this.isInitialized = false;
        
        // Wait for both DOM and i18n to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.waitForDependencies());
        } else {
            this.waitForDependencies();
        }
    }

    waitForDependencies() {
        console.log('[Admin] Waiting for dependencies');
        // Add timeout to prevent infinite loading
        const timeout = setTimeout(() => {
            console.error('[Admin] Initialization timeout - forcing page reload');
            window.location.reload();
        }, 10000);

        // Check if i18n is ready
        if (i18n.isInitialized) {
            console.log('[Admin] i18n ready, proceeding to init');
            clearTimeout(timeout);
            this.init();
        } else {
            console.log('[Admin] Waiting for i18n');
            document.addEventListener('i18nReady', () => {
                console.log('[Admin] i18n ready event received');
                clearTimeout(timeout);
                if (!this.isInitialized) {
                    this.init();
                }
            }, { once: true });
        }
    }

    async init() {
        console.log('[Admin] Initializing');
        if (this.isInitialized) return;
        this.isInitialized = true;

        try {
            await this.checkAuth();
            await this.loadComponents();
            this.setupEventListeners();
            this.updateTranslations();
            this.hideLoading();
        } catch (error) {
            console.error('[Admin] Initialization error:', error);
            this.showAlert('error', i18n.t('error'), i18n.t('error_occurred'));
        }
    }

    setupEventListeners() {
        // Sidebar Navigation
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

        if (navAuth) navAuth.addEventListener('click', () => this.navigateTo('/pages/login.html'));
        if (navDashboard) navDashboard.addEventListener('click', () => this.navigateTo('/pages/dashboard.html'));
        if (navUsers) navUsers.addEventListener('click', () => this.navigateTo('/pages/admin_manage_users.html'));
        if (navOrganizations) navOrganizations.addEventListener('click', () => this.navigateTo('/pages/admin_manage_organizations.html'));
        if (navEvents) navEvents.addEventListener('click', () => this.navigateTo('/pages/admin_manage_events.html'));
        if (navTickets) navTickets.addEventListener('click', () => this.navigateTo('/pages/admin_manage_tickets.html'));
        if (navOrders) navOrders.addEventListener('click', () => this.navigateTo('/pages/admin_manage_orders.html'));
        if (navPayments) navPayments.addEventListener('click', () => this.navigateTo('/pages/admin_manage_payments.html'));
        if (navSync) navSync.addEventListener('click', () => this.showAlert('info', 'Sync Data', 'Sync feature will be implemented later'));
        if (navLogs) navLogs.addEventListener('click', () => this.showAlert('info', 'System Logs', 'System logs will be implemented later'));
        if (navApiDocs) navApiDocs.addEventListener('click', () => this.showAlert('info', 'API Documentation', 'API docs will be implemented later'));
        if (navBusinessDocs) navBusinessDocs.addEventListener('click', () => this.showAlert('info', 'Business Guide', 'Business guide will be implemented later'));

        // Mobile sidebar
        this.setupMobileSidebar();

        // User dropdown
        this.setupUserDropdown();

        // Alert close
        const alertClose = document.getElementById('alert-close');
        if (alertClose) alertClose.addEventListener('click', () => this.hideAlert());

        // Language change event
        document.addEventListener('languageChanged', () => this.updateTranslations());
    }

    setupMobileSidebar() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        
        if (mobileMenuBtn && sidebar && sidebarOverlay) {
            // Toggle sidebar on hamburger click
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-open');
                sidebarOverlay.classList.toggle('active');
                
                // Prevent body scroll when sidebar is open
                if (sidebar.classList.contains('mobile-open')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });
            
            // Close sidebar when clicking overlay
            sidebarOverlay.addEventListener('click', () => {
                sidebar.classList.remove('mobile-open');
                sidebarOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
            
            // Close sidebar when clicking navigation items
            const navItems = sidebar.querySelectorAll('button[id^="nav-"]');
            navItems.forEach(item => {
                item.addEventListener('click', () => {
                    // Close sidebar after a short delay to allow navigation
                    setTimeout(() => {
                        sidebar.classList.remove('mobile-open');
                        sidebarOverlay.classList.remove('active');
                        document.body.style.overflow = '';
                    }, 100);
                });
            });
            
            // Close sidebar on window resize (if switching to desktop)
            window.addEventListener('resize', () => {
                if (window.innerWidth >= 768) {
                    sidebar.classList.remove('mobile-open');
                    sidebarOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
                // Ensure proper sidebar visibility on resize
                this.ensureSidebarVisibility();
            });
        }
    }

    setupUserDropdown() {
        const userBtn = document.getElementById('nav-user');
        if (userBtn && this.currentUser) {
            userBtn.innerHTML = `
                <div class="relative">
                    <button id="user-dropdown-btn" class="flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                        <i class="ti ti-user mr-2"></i>${this.currentUser.name}
                        <i class="ti ti-chevron-down ml-2"></i>
                    </button>
                    <div id="user-dropdown" class="absolute right-0 mt-2 w-48 bg-dark-800 rounded-md shadow-lg py-1 z-50 hidden">
                        <a href="#" class="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-dark-700" onclick="adminModule.showUserProfile()">
                            <i class="ti ti-user mr-2"></i>Hồ sơ
                        </a>
                        <a href="#" class="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-dark-700" onclick="adminModule.navigateTo('/pages/dashboard.html')">
                            <i class="ti ti-home mr-2"></i>Trang chủ
                        </a>
                        <div class="border-t border-dark-700 my-1"></div>
                        <a href="#" class="block px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-dark-700" onclick="adminModule.logout()">
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
        }
    }

    navigateTo(url) {
        window.location.href = url;
    }

    // Loading management
    showLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.classList.remove('hidden');
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.classList.add('hidden');
    }

    checkAuth() {
        if (!this.token || !this.currentUser) {
            window.location.href = '/pages/login.html';
            return;
        }

        if (!this.checkAdminAccess()) {
            this.showAlert('error', 'Không có quyền truy cập', 'Bạn cần đăng nhập với quyền admin');
            setTimeout(() => {
                window.location.href = '/pages/login.html';
            }, 2000);
        }
    }

    checkAdminAccess() {
        return this.currentUser && (this.currentUser.role === 'ADMIN' || this.currentUser.role === 'SUPERADMIN');
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
                pageTitle.textContent = i18n.t('admin_panel');
            }

            // Update language dropdown onclick handlers
            const enLink = document.querySelector('#language-dropdown a[onclick*="changeLanguage(\'en\')"]');
            const viLink = document.querySelector('#language-dropdown a[onclick*="changeLanguage(\'vi\')"]');
            
            if (enLink) enLink.onclick = () => this.changeLanguage('en');
            if (viLink) viLink.onclick = () => this.changeLanguage('vi');

            // Ensure sidebar is visible on desktop
            this.ensureSidebarVisibility();

            // Set up event listeners after components are loaded
            setTimeout(() => {
                this.setupEventListeners();
            }, 500);

        } catch (error) {
            console.error('Error loading components:', error);
        }
    }

    ensureSidebarVisibility() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');
        
        if (sidebar && mainContent) {
            // On desktop, sidebar should always be visible
            if (window.innerWidth >= 769) {
                sidebar.style.transform = 'translateX(0)';
                mainContent.style.marginLeft = '280px';
            } else {
                // On mobile, sidebar should be hidden by default
                sidebar.style.transform = 'translateX(-100%)';
                mainContent.style.marginLeft = '0';
            }
        }
    }

    showUserProfile() {
        this.showAlert('info', i18n.t('user_profile'), i18n.t('profile_feature'));
    }

    logout() {
        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('ocx_token');
        localStorage.removeItem('ocx_user');
        
        this.showAlert('success', i18n.t('logout_success'), 'Bạn đã đăng xuất khỏi hệ thống');
        setTimeout(() => {
            window.location.href = '/pages/login.html';
        }, 1000);
    }

    changeLanguage(lang) {
        i18n.setLanguage(lang);
        this.updateTranslations();
        
        // Dispatch language change event
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    }

    updateTranslations() {
        // Update all text content with current language
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = i18n.t(key);
        });
    }

    // Alert system
    showAlert(type, title, message) {
        const alert = document.getElementById('alert');
        const icon = document.getElementById('alert-icon');
        const alertTitle = document.getElementById('alert-title');
        const alertMessage = document.getElementById('alert-message');

        if (!alert || !icon || !alertTitle || !alertMessage) return;

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
        if (alert) {
            alert.classList.add('alert-hide');
            setTimeout(() => {
                alert.classList.add('hidden');
                alert.classList.remove('alert-hide');
            }, 300);
        }
    }

    // Utility methods for role management
    getRoleClass(role) {
        switch(role) {
            case 'ADMIN': return 'status-active';
            case 'SUPERADMIN': return 'status-success';
            case 'USER': return 'status-pending';
            default: return 'status-pending';
        }
    }

    getRoleLabel(role) {
        switch(role) {
            case 'ADMIN': return 'Admin';
            case 'SUPERADMIN': return 'Super Admin';
            case 'USER': return 'User';
            default: return 'User';
        }
    }
}

// Initialize and export the module
const adminModule = new AdminModule();
export default adminModule; 