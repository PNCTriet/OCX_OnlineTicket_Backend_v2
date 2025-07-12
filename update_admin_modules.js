const fs = require('fs');
const path = require('path');

// Danh sách các module admin cần cập nhật
const adminModules = [
    'admin_manage_organizations.js',
    'admin_manage_events.js',
    'admin_manage_tickets.js',
    'admin_manage_orders.js',
    'admin_manage_payments.js'
];

// Template cho loadComponents method
const loadComponentsTemplate = `    async loadComponents() {
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
                pageTitle.textContent = i18n.t('{{PAGE_TITLE}}');
            }

            // Update language dropdown onclick handlers
            const enLink = document.querySelector('#language-dropdown a[onclick*="changeLanguage(\'en\')"]');
            const viLink = document.querySelector('#language-dropdown a[onclick*="changeLanguage(\'vi\')"]');
            
            if (enLink) enLink.onclick = () => adminModule.changeLanguage('en');
            if (viLink) viLink.onclick = () => adminModule.changeLanguage('vi');

        } catch (error) {
            console.error('Error loading components:', error);
        }
    }`;

// Mapping page titles
const pageTitles = {
    'admin_manage_organizations.js': 'organizations_management',
    'admin_manage_events.js': 'events_management',
    'admin_manage_tickets.js': 'tickets_management',
    'admin_manage_orders.js': 'orders_management',
    'admin_manage_payments.js': 'payments_management'
};

function updateAdminModule(moduleName) {
    const filePath = path.join(__dirname, 'public', 'js', 'modules', moduleName);
    
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${moduleName}`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Thay thế init method
    const oldInitRegex = /init\(\)\s*\{[\s\S]*?this\.setupEventListeners\(\);/;
    const newInit = `async init() {
        await this.loadComponents();
        await this.loadData();
        this.setupEventListeners();`;
    
    content = content.replace(oldInitRegex, newInit);
    
    // Thêm loadComponents method
    const pageTitle = pageTitles[moduleName] || 'page_title';
    const loadComponentsMethod = loadComponentsTemplate.replace('{{PAGE_TITLE}}', pageTitle);
    
    // Tìm vị trí để thêm loadComponents method (sau constructor)
    const constructorRegex = /constructor\(\)\s*\{[\s\S]*?this\.init\(\);/;
    const constructorMatch = content.match(constructorRegex);
    
    if (constructorMatch) {
        const afterConstructor = content.indexOf(constructorMatch[0]) + constructorMatch[0].length;
        content = content.slice(0, afterConstructor) + '\n\n    ' + loadComponentsMethod + '\n\n    ' + content.slice(afterConstructor);
    }
    
    // Ghi file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${moduleName}`);
}

// Cập nhật tất cả các module
adminModules.forEach(updateAdminModule);

console.log('All admin modules updated successfully!'); 