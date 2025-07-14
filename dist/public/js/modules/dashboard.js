// Dashboard Module for Dashboard page
import { formatCurrency } from '../utils/currency.js';
import componentLoader from './component-loader.js';
import i18n from '../i18n.js';

class DashboardModule {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3000/api';
        this.token = localStorage.getItem('ocx_token');
        this.currentUser = JSON.parse(localStorage.getItem('ocx_user'));
        this.revenueChart = null;
        this.currentPeriod = 'month';
        
        // Wait for both DOM and i18n to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.waitForDependencies());
        } else {
            this.waitForDependencies();
        }
    }

    waitForDependencies() {
        // Check if i18n is ready
        document.addEventListener('i18nReady', () => {
            this.init();
        });
    }

    async init() {
        try {
            await this.checkAuth();
            // Load components first and wait for them
            await this.loadComponents();
            // Setup event listeners after components are loaded
            document.addEventListener('componentLoaded', (event) => {
                if (event.detail.componentName === 'sidebar') {
                    this.setupEventListeners();
                }
            });
            this.initRevenueChart(); // Initialize chart before loading data
            await this.loadDashboard(); // This will also load revenue data
            this.startAutoRefresh();
        } catch (error) {
            console.error('Initialization error:', error);
            this.showAlert('error', i18n.t('error'), i18n.t('error_occurred'));
        } finally {
            this.hideLoading();
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

        // Refresh revenue button
        const refreshRevenueBtn = document.getElementById('refresh-revenue');
        if (refreshRevenueBtn) {
            refreshRevenueBtn.addEventListener('click', () => {
                this.refreshRevenueOnly();
            });
        }

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
                        <a href="#" class="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-dark-700" onclick="dashboardModule.showUserProfile()">
                            <i class="ti ti-user mr-2"></i>Hồ sơ
                        </a>
                        <a href="#" class="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-dark-700" onclick="dashboardModule.navigateTo('/pages/dashboard.html')">
                            <i class="ti ti-home mr-2"></i>Trang chủ
                        </a>
                        <div class="border-t border-dark-700 my-1"></div>
                        <a href="#" class="block px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-dark-700" onclick="dashboardModule.logout()">
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
            // Load components in sequence to ensure proper initialization
            await componentLoader.loadComponent('sidebar', 'sidebar-container');
            await componentLoader.loadComponent('header', 'header-container');
            await componentLoader.loadComponent('alert', 'alert-container');
        } catch (error) {
            console.error('Error loading components:', error);
            throw error;
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

    async loadDashboard() {
        try {
            const [usersCount, eventsCount, ticketsCount, revenue] = await Promise.all([
                this.fetchData('/users/count'),
                this.fetchData('/events/count'),
                this.fetchData('/tickets/count'),
                this.fetchData('/payments/revenue')
            ]);

            document.getElementById('total-users').textContent = usersCount || 0;
            document.getElementById('total-events').textContent = eventsCount || 0;
            document.getElementById('total-tickets').textContent = ticketsCount || 0;
            document.getElementById('total-revenue').textContent = formatCurrency(revenue || 0);

            // Load revenue data for chart
            await this.loadRevenueData();

        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showAlert('error', i18n.t('error'), i18n.t('error_occurred'));
            throw error; // Propagate error to init() for proper handling
        }
    }

    initRevenueChart() {
        const ctx = document.getElementById('revenueChart').getContext('2d');
        
        // Set up chart
        this.revenueChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: i18n.t('revenue'),
                    data: [],
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => formatCurrency(value)
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => formatCurrency(context.raw)
                        }
                    }
                }
            }
        });

        // Set up period change handler
        const periodSelect = document.getElementById('revenue-period');
        if (periodSelect) {
            periodSelect.addEventListener('change', async (e) => {
                try {
                    this.currentPeriod = e.target.value;
                    await this.loadRevenueData();
                } catch (error) {
                    console.error('Error updating revenue period:', error);
                    this.showAlert('error', i18n.t('error'), i18n.t('error_occurred'));
                }
            });
        }

        // Set up refresh button handler
        const refreshChartBtn = document.getElementById('refresh-chart');
        if (refreshChartBtn) {
            refreshChartBtn.addEventListener('click', async () => {
                try {
                    await this.loadRevenueData();
                } catch (error) {
                    console.error('Error refreshing revenue chart:', error);
                    this.showAlert('error', i18n.t('error'), i18n.t('error_occurred'));
                }
            });
        }
    }

    async loadRevenueData() {
        try {
            const response = await this.fetchData(`/payments/revenue/${this.currentPeriod}`);
            if (!response || !response.data) {
                throw new Error('Invalid revenue data');
            }

            // Update chart data
            this.revenueChart.data.labels = response.data.map(item => item.label);
            this.revenueChart.data.datasets[0].data = response.data.map(item => item.value);
            this.revenueChart.update();

        } catch (error) {
            console.error('Error loading revenue data:', error);
            this.showAlert('error', i18n.t('error'), i18n.t('error_occurred'));
            throw error; // Propagate error for proper handling
        }
    }

    async fetchData(endpoint) {
        try {
            const response = await fetch(this.apiBaseUrl + endpoint, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }

    // Show subtle refresh indicator
    showRefreshIndicator() {
        const revenueEl = document.getElementById('total-revenue');
        if (revenueEl) {
            // Add a subtle flash effect
            revenueEl.style.transition = 'background-color 0.3s ease';
            revenueEl.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
            setTimeout(() => {
                revenueEl.style.backgroundColor = 'transparent';
            }, 300);
        }
    }

    // Refresh only revenue data
    async refreshRevenueOnly() {
        try {
            const refreshBtn = document.getElementById('refresh-revenue');
            if (refreshBtn) {
                // Add loading animation
                const icon = refreshBtn.querySelector('i');
                icon.className = 'ti ti-loader text-lg animate-spin';
            }

            const response = await fetch(`${this.apiBaseUrl}/payments/revenue`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });

            const totalRevenue = response.ok ? await response.json() : 0;
            const totalRevenueEl = document.getElementById('total-revenue');

            if (totalRevenueEl) {
                totalRevenueEl.textContent = formatCurrency(totalRevenue);
                this.showRefreshIndicator();
            }

            // Reset button icon
            if (refreshBtn) {
                const icon = refreshBtn.querySelector('i');
                icon.className = 'ti ti-refresh text-lg';
            }

            this.showAlert('success', i18n.t('revenue_updated'), i18n.t('revenue_data_refreshed'));
        } catch (error) {
            console.error('Error refreshing revenue:', error);
            this.showAlert('error', i18n.t('refresh_failed'), i18n.t('failed_to_refresh_revenue_data'));
            
            // Reset button icon on error
            const refreshBtn = document.getElementById('refresh-revenue');
            if (refreshBtn) {
                const icon = refreshBtn.querySelector('i');
                icon.className = 'ti ti-refresh text-lg';
            }
        }
    }

    // Auto-refresh dashboard data every 30 seconds
    startAutoRefresh() {
        this.stopAutoRefresh(); // Clear any existing interval
        this.autoRefreshInterval = setInterval(async () => {
            try {
                await this.loadDashboard();
            } catch (error) {
                console.error('Auto-refresh error:', error);
                // Stop auto-refresh on error to prevent continuous error messages
                this.stopAutoRefresh();
                this.showAlert('error', i18n.t('auto_refresh_error'), i18n.t('automatic_updates_stopped_due_to_error'));
            }
        }, 30000); // 30 seconds
    }

    stopAutoRefresh() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
            this.autoRefreshInterval = null;
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
}

// Initialize dashboard module when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardModule = new DashboardModule();
}); 