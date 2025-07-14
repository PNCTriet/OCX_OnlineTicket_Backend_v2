// Organizations Management Module

class OrganizationsManagementModule {
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
                pageTitle.textContent = i18n.t('organizations_management');
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
            const response = await fetch('/api/organizations', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const organizations = await response.json();
            this.renderOrganizations(organizations);
        } catch (error) {
            console.error('Error loading organizations:', error);
            this.showAlert('error', i18n.t('error_loading_organizations'));
        }
    }

    renderOrganizations(organizations) {
        const tbody = document.getElementById('organizations-list');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (organizations.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-4 text-center text-gray-400">
                        ${i18n.t('no_organizations_found')}
                    </td>
                </tr>
            `;
            return;
        }

        organizations.forEach(org => {
            const row = document.createElement('tr');
            row.className = 'bg-dark-900 border-b border-dark-800 hover:bg-dark-800';
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-white">${org.name}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-300">${org.contact_email || '-'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-300">${org.phone || '-'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-300">${new Date(org.created_at).toLocaleDateString()}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="organizationsModule.editOrganization(${org.id})" class="text-blue-400 hover:text-blue-300 mr-3">
                        <i class="ti ti-edit"></i>
                    </button>
                    <button onclick="organizationsModule.deleteOrganization(${org.id})" class="text-red-400 hover:text-red-300">
                        <i class="ti ti-trash"></i>
                    </button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    async editOrganization(id) {
        // TODO: Implement edit functionality
        console.log('Edit organization:', id);
    }

    async deleteOrganization(id) {
        if (!confirm(i18n.t('confirm_delete_organization'))) {
            return;
        }

        try {
            const response = await fetch(`/api/organizations/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.showAlert('success', i18n.t('organization_deleted_successfully'));
            await this.loadData(); // Reload data
        } catch (error) {
            console.error('Error deleting organization:', error);
            this.showAlert('error', i18n.t('error_deleting_organization'));
        }
    }

    setupEventListeners() {
        const addButton = document.getElementById('add-organization');
        if (addButton) {
            addButton.addEventListener('click', () => this.addOrganization());
        }
    }

    async addOrganization() {
        // TODO: Implement add functionality
        console.log('Add organization');
    }

    showAlert(type, message) {
        const alertContainer = document.getElementById('alert-container');
        if (alertContainer) {
            const alert = document.createElement('div');
            alert.className = `alert alert-${type} mb-4`;
            alert.innerHTML = `
                <div class="flex items-center p-4 rounded-lg">
                    <i class="ti ti-${type === 'success' ? 'check' : 'alert-circle'} mr-2"></i>
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

// Initialize organizations management module when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.organizationsModule = new OrganizationsManagementModule();
}); 