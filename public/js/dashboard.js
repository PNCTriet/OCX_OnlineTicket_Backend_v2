// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle for mobile
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('-translate-x-full');
        });
    }
    
    if (sidebarClose) {
        sidebarClose.addEventListener('click', function() {
            sidebar.classList.add('-translate-x-full');
        });
    }
    
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
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
    }
    
    // Update user info
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userName = document.getElementById('user-name');
    const userRole = document.getElementById('user-role');
    
    if (userName && user.name) {
        userName.textContent = user.name;
    }
    
    if (userRole && user.role) {
        userRole.textContent = user.role;
    }
    
    // Auto-refresh stats every 30 seconds
    setInterval(updateStats, 30000);
    
    // Initial stats update
    updateStats();
});

// Update dashboard stats
async function updateStats() {
    try {
        // Simulate API call for stats
        const stats = await fetchStats();
        updateStatsDisplay(stats);
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

async function fetchStats() {
    // Mock data for Phase 1
    return {
        events: 12,
        ticketsSold: 1234,
        revenue: 45678,
        users: 567,
        activeEvents: 3,
        remainingTickets: 156,
        todayCheckins: 89,
        monthlyRevenue: 12345
    };
}

function updateStatsDisplay(stats) {
    // Update stats cards
    const statElements = document.querySelectorAll('[data-stat]');
    statElements.forEach(element => {
        const statType = element.getAttribute('data-stat');
        if (stats[statType]) {
            element.textContent = formatNumber(stats[statType]);
        }
    });
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
}

// Navigation handling
document.addEventListener('click', function(e) {
    if (e.target.closest('nav a')) {
        e.preventDefault();
        const link = e.target.closest('nav a');
        const text = link.textContent.trim();
        
        // Update active state
        document.querySelectorAll('nav a').forEach(a => {
            a.classList.remove('bg-blue-600', 'text-white');
            a.classList.add('text-gray-300', 'hover:bg-dark-700');
        });
        
        link.classList.remove('text-gray-300', 'hover:bg-dark-700');
        link.classList.add('bg-blue-600', 'text-white');
        
        // Handle navigation
        handleNavigation(text);
    }
});

function handleNavigation(page) {
    const mainContent = document.querySelector('main');
    
    switch(page) {
        case 'Dashboard':
            // Already on dashboard
            break;
        case 'Sự kiện':
            showNotification('Tính năng sự kiện sẽ có trong Phase 2', 'info');
            break;
        case 'Vé':
            showNotification('Tính năng vé sẽ có trong Phase 3', 'info');
            break;
        case 'Người dùng':
            showNotification('Tính năng quản lý người dùng sẽ có trong Phase 2', 'info');
            break;
        case 'Thống kê':
            showNotification('Tính năng thống kê sẽ có trong Phase 7', 'info');
            break;
        case 'Cài đặt':
            showNotification('Tính năng cài đặt sẽ có trong Phase 8', 'info');
            break;
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const colors = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        info: 'bg-blue-600',
        warning: 'bg-yellow-600'
    };
    
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full`;
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <span class="ti ti-${getNotificationIcon(type)}"></span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check';
        case 'error': return 'alert-circle';
        case 'warning': return 'alert-triangle';
        default: return 'info-circle';
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to toggle sidebar
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('-translate-x-full');
    }
    
    // Ctrl/Cmd + T to toggle theme
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        document.getElementById('theme-toggle').click();
    }
});

// Logout functionality
function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/index.html';
}

// Add logout to user menu if needed
const userMenu = document.querySelector('.flex.items-center.space-x-3');
if (userMenu) {
    userMenu.addEventListener('click', function() {
        // Show logout option
        showNotification('Click để đăng xuất', 'info');
    });
} 