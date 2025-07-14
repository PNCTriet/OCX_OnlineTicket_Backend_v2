// Events Management Module

class EventsManagementModule {
    constructor() {
        this.init();
    }

    async init() {
        await this.loadComponents();
        await this.loadEvents();
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
                pageTitle.textContent = i18n.t('events_management');
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
        // Sync events button
        const syncEvents = document.getElementById('sync-events');
        if (syncEvents) {
            syncEvents.addEventListener('click', () => this.syncEvents());
        }
    }

    async loadEvents() {
        try {
            const response = await fetch(`${adminModule.apiBaseUrl}/events`, {
                headers: {
                    'Authorization': `Bearer ${adminModule.token}`
                }
            });

            if (response.ok) {
                const events = await response.json();
                this.renderEventsTable(events);
            } else {
                adminModule.showAlert('error', 'Lỗi', 'Không thể tải danh sách sự kiện');
            }
        } catch (error) {
            adminModule.showAlert('error', 'Lỗi kết nối', 'Không thể kết nối đến server');
        }
    }

    renderEventsTable(events) {
        const tbody = document.getElementById('events-list');
        if (!tbody) return;

        tbody.innerHTML = '';

        events.forEach(event => {
            const row = document.createElement('tr');
            row.className = 'table-row border-b border-dark-700';
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <div class="h-10 w-10 rounded-full bg-dark-700 flex items-center justify-center">
                                <i class="ti ti-calendar text-gray-400"></i>
                            </div>
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-white">${event.name || 'N/A'}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-300">${event.description || 'N/A'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-300">${event.location || 'N/A'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-300">${new Date(event.date).toLocaleDateString('vi-VN')}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="status-badge status-active">Hoạt động</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-blue-400 hover:text-blue-300 mr-3" onclick="eventsModule.editEvent('${event.id}')">
                        <i class="ti ti-edit"></i>
                    </button>
                    <button class="text-red-400 hover:text-red-300" onclick="eventsModule.deleteEvent('${event.id}')">
                        <i class="ti ti-trash"></i>
                    </button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    async syncEvents() {
        adminModule.showLoading();
        adminModule.showAlert('info', 'Đang đồng bộ', 'Đang đồng bộ dữ liệu sự kiện...');
        
        // Simulate sync process
        setTimeout(() => {
            adminModule.hideLoading();
            this.loadEvents();
            adminModule.showAlert('success', 'Đồng bộ thành công', 'Dữ liệu sự kiện đã được đồng bộ');
        }, 2000);
    }

    editEvent(eventId) {
        adminModule.showAlert('info', 'Chức năng đang phát triển', 'Tính năng chỉnh sửa sự kiện sẽ được cập nhật sau');
    }

    deleteEvent(eventId) {
        if (confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
            adminModule.showAlert('info', 'Đang xóa', 'Đang xóa sự kiện...');
            // Implement delete logic here
        }
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.classList.add('hidden');
    }
}

// Initialize events management module when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.eventsModule = new EventsManagementModule();
}); 