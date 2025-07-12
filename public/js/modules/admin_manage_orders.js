// Orders Management Module

class OrdersManagementModule {
    constructor() {
        this.init();
    }

    async init() {
        await this.loadComponents();
        await this.loadData();
        this.setupEventListeners();
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
                pageTitle.textContent = i18n.t('orders_management');
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

    async loadData() {
        try {
            const response = await fetch('/api/orders', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const orders = await response.json();
            this.renderOrders(orders);
        } catch (error) {
            console.error('Error loading orders:', error);
            this.showAlert('error', i18n.t('error_loading_orders'));
        }
    }

    renderOrders(orders) {
        const tbody = document.getElementById('orders-list');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (orders.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="px-6 py-4 text-center text-gray-400">
                        ${i18n.t('no_orders_found')}
                    </td>
                </tr>
            `;
            return;
        }

        orders.forEach(order => {
            const row = document.createElement('tr');
            row.className = 'bg-dark-900 border-b border-dark-800 hover:bg-dark-800';
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-white">#${order.id}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-300">${order.user?.name || 'Guest'}</div>
                    <div class="text-xs text-gray-500">${order.user?.email || '-'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-300">-</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-green-400">${this.formatCurrency(order.amount)}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-medium rounded-full ${this.getStatusColor(order.status)}">
                        ${order.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-300">${new Date(order.created_at).toLocaleDateString()}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="ordersModule.viewOrder(${order.id})" class="text-blue-400 hover:text-blue-300 mr-3">
                        <i class="ti ti-eye"></i>
                    </button>
                    <button onclick="ordersModule.editOrder(${order.id})" class="text-yellow-400 hover:text-yellow-300 mr-3">
                        <i class="ti ti-edit"></i>
                    </button>
                    <button onclick="ordersModule.deleteOrder(${order.id})" class="text-red-400 hover:text-red-300">
                        <i class="ti ti-trash"></i>
                    </button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }

    getStatusColor(status) {
        const colors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'paid': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800',
            'refunded': 'bg-gray-100 text-gray-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    }

    async viewOrder(id) {
        // TODO: Implement view functionality
        console.log('View order:', id);
    }

    async editOrder(id) {
        // TODO: Implement edit functionality
        console.log('Edit order:', id);
    }

    async deleteOrder(id) {
        if (!confirm(i18n.t('confirm_delete_order'))) {
            return;
        }

        try {
            const response = await fetch(`/api/orders/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.showAlert('success', i18n.t('order_deleted_successfully'));
            await this.loadData(); // Reload data
        } catch (error) {
            console.error('Error deleting order:', error);
            this.showAlert('error', i18n.t('error_deleting_order'));
        }
    }

    setupEventListeners() {
        const exportButton = document.getElementById('export-orders');
        if (exportButton) {
            exportButton.addEventListener('click', () => this.exportOrders());
        }
    }

    async exportOrders() {
        // TODO: Implement export functionality
        console.log('Export orders');
        this.showAlert('info', i18n.t('export_feature_coming_soon'));
    }

    showAlert(type, message) {
        const alertContainer = document.getElementById('alert-container');
        if (alertContainer) {
            const alert = document.createElement('div');
            alert.className = `alert alert-${type} mb-4`;
            alert.innerHTML = `
                <div class="flex items-center p-4 rounded-lg">
                    <i class="ti ti-${type === 'success' ? 'check' : type === 'error' ? 'alert-circle' : 'info'} mr-2"></i>
                    <span>${message}</span>
                </div>
            `;
            alertContainer.appendChild(alert);
            
            setTimeout(() => {
                alert.remove();
            }, 5000);
        }
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.classList.add('hidden');
    }
}

// Initialize orders management module when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.ordersModule = new OrdersManagementModule();
}); 