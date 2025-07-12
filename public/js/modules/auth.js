// Auth Module for Login/Register pages

class AuthModule {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3000/api';
        this.token = localStorage.getItem('ocx_token');
        this.currentUser = JSON.parse(localStorage.getItem('ocx_user'));
        
        this.init();
    }

    init() {
        this.hideLoading();
        this.setupEventListeners();
        this.checkAuth();
        this.updateTranslations();
    }

    setupEventListeners() {
        // Auth forms
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const showRegister = document.getElementById('show-register');
        const showLogin = document.getElementById('show-login');

        if (loginForm) loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        if (registerForm) registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        if (showRegister) showRegister.addEventListener('click', () => this.toggleAuthForm());
        if (showLogin) showLogin.addEventListener('click', () => this.toggleAuthForm());

        // Alert close
        const alertClose = document.getElementById('alert-close');
        if (alertClose) alertClose.addEventListener('click', () => this.hideAlert());

        // Language change event
        document.addEventListener('languageChanged', () => this.updateTranslations());
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
                
                // Redirect to dashboard if admin, or show limited access message
                if (data.user.role === 'ADMIN' || data.user.role === 'SUPERADMIN') {
                    setTimeout(() => {
                        window.location.href = '/pages/dashboard.html';
                    }, 1000);
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
        
        if (loginForm && registerForm) {
            if (loginForm.classList.contains('hidden')) {
                loginForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
            } else {
                loginForm.classList.add('hidden');
                registerForm.classList.remove('hidden');
            }
        }
    }

    checkAuth() {
        if (this.token && this.currentUser) {
            // User is already logged in, redirect to dashboard
            if (this.currentUser.role === 'ADMIN' || this.currentUser.role === 'SUPERADMIN') {
                window.location.href = '/pages/dashboard.html';
            } else {
                this.showAlert('warning', i18n.t('limited_permissions'), i18n.t('no_admin_access'));
            }
        }
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

// Initialize auth module when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authModule = new AuthModule();
}); 