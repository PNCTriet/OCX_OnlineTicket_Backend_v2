// Admin Manage Tickets Module
import { formatCurrency } from '../utils/currency.js';

class TicketsManagementModule {
    constructor() {
        this.init();
    }

    async init() {
        await this.loadComponents();
        await this.loadTickets();
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
                pageTitle.textContent = i18n.t('tickets_management');
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
        // Sync tickets button
        const syncTickets = document.getElementById('sync-tickets');
        if (syncTickets) {
            syncTickets.addEventListener('click', () => this.syncTickets());
        }
    }

    async loadTickets() {
        try {
            const response = await fetch(`${adminModule.apiBaseUrl}/tickets`, {
                headers: {
                    'Authorization': `Bearer ${adminModule.token}`
                }
            });

            if (response.ok) {
                const tickets = await response.json();
                this.renderTicketsTable(tickets);
            } else {
                adminModule.showAlert('error', 'Lỗi', 'Không thể tải danh sách vé');
            }
        } catch (error) {
            adminModule.showAlert('error', 'Lỗi kết nối', 'Không thể kết nối đến server');
        }
    }

    renderTicketsTable(tickets) {
        const tbody = document.getElementById('tickets-list');
        if (!tbody) return;

        tbody.innerHTML = '';

        tickets.forEach(ticket => {
            const row = document.createElement('tr');
            row.className = 'table-row border-b border-dark-700';
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <div class="h-10 w-10 rounded-full bg-dark-700 flex items-center justify-center">
                                <i class="ti ti-ticket text-gray-400"></i>
                            </div>
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-white">${ticket.name || 'N/A'}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-300">${ticket.event?.name || 'N/A'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-300">${ticket.type || 'N/A'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-300">${formatCurrency(ticket.price)}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-300">${ticket.sold}/${ticket.total}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="status-badge ${ticket.is_active ? 'status-active' : 'status-inactive'}">
                        ${ticket.is_active ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-blue-400 hover:text-blue-300 mr-3" onclick="ticketsModule.editTicket('${ticket.id}')">
                        <i class="ti ti-edit"></i>
                    </button>
                    <button class="text-red-400 hover:text-red-300" onclick="ticketsModule.deleteTicket('${ticket.id}')">
                        <i class="ti ti-trash"></i>
                    </button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    async syncTickets() {
        adminModule.showLoading();
        adminModule.showAlert('info', 'Đang đồng bộ', 'Đang đồng bộ dữ liệu vé...');
        
        // Simulate sync process
        setTimeout(() => {
            adminModule.hideLoading();
            this.loadTickets();
            adminModule.showAlert('success', 'Đồng bộ thành công', 'Dữ liệu vé đã được đồng bộ');
        }, 2000);
    }

    editTicket(ticketId) {
        adminModule.showAlert('info', 'Chức năng đang phát triển', 'Tính năng chỉnh sửa vé sẽ được cập nhật sau');
    }

    deleteTicket(ticketId) {
        if (confirm('Bạn có chắc chắn muốn xóa vé này?')) {
            adminModule.showAlert('info', 'Đang xóa', 'Đang xóa vé...');
            // Implement delete logic here
        }
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.classList.add('hidden');
    }
}

// Initialize tickets management module when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.ticketsModule = new TicketsManagementModule();
}); 