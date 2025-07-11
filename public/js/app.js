// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Utility functions
function showNotification(message, type = 'info') {
    const colors = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        info: 'bg-blue-600'
    };
    
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function updateApiResponse(data, status) {
    const responseDiv = document.getElementById('api-response');
    const timestamp = new Date().toLocaleTimeString();
    
    responseDiv.innerHTML = `
        <div class="text-green-400 mb-2">✓ ${status} - ${timestamp}</div>
        <pre class="text-sm overflow-x-auto">${JSON.stringify(data, null, 2)}</pre>
    `;
}

function showError(message) {
    const responseDiv = document.getElementById('api-response');
    const timestamp = new Date().toLocaleTimeString();
    
    responseDiv.innerHTML = `
        <div class="text-red-400 mb-2">✗ Error - ${timestamp}</div>
        <div class="text-red-300">${message}</div>
    `;
}

// API Functions
async function registerUser(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            updateApiResponse(data, response.status);
            showNotification('Đăng ký thành công!', 'success');
            return data;
        } else {
            showError(data.message || 'Đăng ký thất bại');
            showNotification('Đăng ký thất bại!', 'error');
        }
    } catch (error) {
        showError('Lỗi kết nối: ' + error.message);
        showNotification('Lỗi kết nối!', 'error');
    }
}

async function loginUser(credentials) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            updateApiResponse(data, response.status);
            showNotification('Đăng nhập thành công!', 'success');
            
            // Store token
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Update UI
            updateAuthUI(true);
            return data;
        } else {
            showError(data.message || 'Đăng nhập thất bại');
            showNotification('Đăng nhập thất bại!', 'error');
        }
    } catch (error) {
        showError('Lỗi kết nối: ' + error.message);
        showNotification('Lỗi kết nối!', 'error');
    }
}

async function getUserProfile() {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            updateApiResponse(data, response.status);
            return data;
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}

// UI Functions
function updateAuthUI(isLoggedIn) {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    
    if (isLoggedIn) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        loginBtn.innerHTML = `
            <span class="ti ti-user mr-2"></span>${user.name || 'User'}
        `;
        loginBtn.className = 'px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors';
        loginBtn.onclick = logout;
        
        registerBtn.style.display = 'none';
    } else {
        loginBtn.innerHTML = `
            <span class="ti ti-login mr-2"></span>Đăng nhập
        `;
        loginBtn.className = 'px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors';
        loginBtn.onclick = showLoginModal;
        
        registerBtn.style.display = 'block';
    }
}

function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    updateAuthUI(false);
    showNotification('Đã đăng xuất!', 'info');
}

function showLoginModal() {
    // Scroll to login form
    document.getElementById('login-form').scrollIntoView({ behavior: 'smooth' });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const token = localStorage.getItem('accessToken');
    if (token) {
        updateAuthUI(true);
    }
    
    // Register form
    document.getElementById('register-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            email: document.getElementById('register-email').value,
            name: document.getElementById('register-name').value,
            password: document.getElementById('register-password').value,
            phone: document.getElementById('register-phone').value
        };
        
        await registerUser(formData);
    });
    
    // Login form
    document.getElementById('login-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            email: document.getElementById('login-email').value,
            password: document.getElementById('login-password').value
        };
        
        await loginUser(formData);
    });
    
    // Demo button
    document.getElementById('demo-btn').addEventListener('click', function() {
        // Fill demo data
        document.getElementById('register-email').value = 'demo@example.com';
        document.getElementById('register-name').value = 'Demo User';
        document.getElementById('register-password').value = 'password123';
        document.getElementById('register-phone').value = '0123456789';
        
        document.getElementById('login-email').value = 'demo@example.com';
        document.getElementById('login-password').value = 'password123';
        
        showNotification('Đã điền dữ liệu demo!', 'info');
    });
    
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', function() {
        const html = document.documentElement;
        const isDark = html.classList.contains('dark');
        
        if (isDark) {
            html.classList.remove('dark');
            this.innerHTML = '<span class="ti ti-sun text-gray-300"></span>';
        } else {
            html.classList.add('dark');
            this.innerHTML = '<span class="ti ti-moon text-gray-300"></span>';
        }
    });
    
    // Test API connection
    testApiConnection();
});

async function testApiConnection() {
    try {
        const response = await fetch(`${API_BASE_URL}/docs`);
        if (response.ok) {
            console.log('✅ API connection successful');
        } else {
            console.log('⚠️ API connection failed');
        }
    } catch (error) {
        console.log('❌ API connection error:', error.message);
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit forms
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.closest('form')) {
            activeElement.closest('form').dispatchEvent(new Event('submit'));
        }
    }
}); 