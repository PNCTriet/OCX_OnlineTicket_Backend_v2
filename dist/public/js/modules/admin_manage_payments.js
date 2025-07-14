// Admin Manage Payments Module
import { formatCurrency } from '../utils/currency.js';

class PaymentsManagementModule {
    constructor() {
        this.init();
    }

    async init() {
        await this.loadComponents();
        await this.loadPayments();
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
                pageTitle.textContent = i18n.t('payments_management');
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
        // Sync payments button
        const syncPayments = document.getElementById('sync-payments');
        if (syncPayments) {
            syncPayments.addEventListener('click', () => this.syncPayments());
        }
    }

    async loadPayments() {
        try {
            const response = await fetch(`${adminModule.apiBaseUrl}/payments`, {
                headers: {
                    'Authorization': `Bearer ${adminModule.token}`
                }
            });

            if (response.ok) {
                const payments = await response.json();
                this.renderPaymentsTable(payments);
            } else {
                adminModule.showAlert('error', 'Lỗi', 'Không thể tải danh sách thanh toán');
            }
        } catch (error) {
            adminModule.showAlert('error', 'Lỗi kết nối', 'Không thể kết nối đến server');
        }
    }

    renderPaymentsTable(payments) {
        const tbody = document.getElementById('payments-list');
        if (!tbody) return;

        tbody.innerHTML = '';

        payments.forEach(payment => {
            const row = document.createElement('tr');
            row.className = 'table-row border-b border-dark-700';
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <div class="h-10 w-10 rounded-full bg-dark-700 flex items-center justify-center">
                                <i class="ti ti-credit-card text-gray-400"></i>
                            </div>
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-white">${payment.order?.user?.name || 'N/A'}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-300">${payment.gateway || 'N/A'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-300">${formatCurrency(payment.order?.amount)}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="status-badge ${this.getStatusClass(payment.status)}">
                        ${this.getStatusLabel(payment.status)}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-300">${payment.txn_code || 'N/A'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-300">${payment.paid_at ? new Date(payment.paid_at).toLocaleDateString('vi-VN') : 'N/A'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-blue-400 hover:text-blue-300 mr-3" onclick="paymentsModule.editPayment('${payment.id}')">
                        <i class="ti ti-edit"></i>
                    </button>
                    <button class="text-red-400 hover:text-red-300" onclick="paymentsModule.deletePayment('${payment.id}')">
                        <i class="ti ti-trash"></i>
                    </button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    getStatusClass(status) {
        switch (status) {
            case 'SUCCESS':
                return 'status-active';
            case 'PENDING':
                return 'status-pending';
            case 'FAILED':
                return 'status-inactive';
            default:
                return 'status-pending';
        }
    }

    getStatusLabel(status) {
        switch (status) {
            case 'SUCCESS':
                return 'Thành công';
            case 'PENDING':
                return 'Đang xử lý';
            case 'FAILED':
                return 'Thất bại';
            default:
                return 'Không xác định';
        }
    }

    async syncPayments() {
        adminModule.showLoading();
        adminModule.showAlert('info', 'Đang đồng bộ', 'Đang đồng bộ dữ liệu thanh toán...');
        
        // Simulate sync process
        setTimeout(() => {
            adminModule.hideLoading();
            this.loadPayments();
            adminModule.showAlert('success', 'Đồng bộ thành công', 'Dữ liệu thanh toán đã được đồng bộ');
        }, 2000);
    }

    editPayment(paymentId) {
        adminModule.showAlert('info', 'Chức năng đang phát triển', 'Tính năng chỉnh sửa thanh toán sẽ được cập nhật sau');
    }

    deletePayment(paymentId) {
        if (confirm('Bạn có chắc chắn muốn xóa thanh toán này?')) {
            adminModule.showAlert('info', 'Đang xóa', 'Đang xóa thanh toán...');
            // Implement delete logic here
        }
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.classList.add('hidden');
    }
}

// Initialize payments management module when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.paymentsModule = new PaymentsManagementModule();
}); 