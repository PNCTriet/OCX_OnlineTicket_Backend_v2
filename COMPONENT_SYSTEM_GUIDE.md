# 🧩 Component System Guide

> **Modular Frontend Architecture** - Tách biệt và tái sử dụng components

---

## 🎯 Tổng quan

Hệ thống Component được thiết kế để:
- **Tách biệt** các phần UI thành modules riêng biệt
- **Tái sử dụng** components trên nhiều trang
- **Dễ maintain** - chỉ cần sửa 1 file để update tất cả
- **Lazy loading** - chỉ load khi cần thiết

---

## 📁 Cấu trúc thư mục

```
public/
├── components/           # Component files
│   ├── header.html      # Header component
│   ├── sidebar.html     # Sidebar component
│   ├── alert.html       # Alert component
│   └── layout.html      # Layout template
├── js/
│   └── modules/
│       └── component-loader.js  # Component loader
└── pages/               # Page files
    ├── dashboard.html
    ├── login.html
    └── admin_manage_*.html
```

---

## 🧩 Components có sẵn

### 1. **Header Component** (`header.html`)
```html
<!-- Sử dụng -->
<div id="header-container"></div>

<!-- Chức năng -->
- Mobile hamburger menu
- Language selector (EN/VI)
- User dropdown menu
- Page title
```

### 2. **Sidebar Component** (`sidebar.html`)
```html
<!-- Sử dụng -->
<div id="sidebar-container"></div>

<!-- Chức năng -->
- Navigation menu
- Dashboard, Users, Events, etc.
- Mobile responsive
- Smooth transitions
```

### 3. **Alert Component** (`alert.html`)
```html
<!-- Sử dụng -->
<div id="alert-container"></div>

<!-- Chức năng -->
- Success/Error/Warning/Info alerts
- Auto-hide timer
- Close button
- Smooth animations
```

### 4. **Layout Template** (`layout.html`)
```html
<!-- Template cho pages -->
<div id="layout-container">
    <div id="sidebar-container"></div>
    <div id="main-content">
        <div id="header-container"></div>
        <main id="main-content-container"></main>
    </div>
</div>
<div id="alert-container"></div>
```

---

## 🔧 Cách sử dụng

### 1. **Load Component đơn lẻ**
```javascript
// Load một component
await componentLoader.loadComponent('header', 'header-container');

// Load với options
await componentLoader.loadComponent('sidebar', 'sidebar-container', {
    showOnMobile: true
});
```

### 2. **Load nhiều Components**
```javascript
// Load tất cả components cần thiết
await componentLoader.loadComponents([
    { name: 'sidebar', targetId: 'sidebar-container' },
    { name: 'header', targetId: 'header-container' },
    { name: 'alert', targetId: 'alert-container' }
]);
```

### 3. **Load với Placeholders**
```javascript
// Component với dynamic content
await componentLoader.loadComponentWithPlaceholders(
    'header',
    'header-container',
    {
        pageTitle: 'Dashboard',
        userName: 'Admin User'
    }
);
```

### 4. **Trong Page Module**
```javascript
class DashboardModule {
    async init() {
        await this.checkAuth();
        await this.loadComponents();  // Load components
        await this.loadDashboard();
        this.setupEventListeners();
        this.hideLoading();
    }

    async loadComponents() {
        try {
            await componentLoader.loadComponents([
                { name: 'sidebar', targetId: 'sidebar-container' },
                { name: 'header', targetId: 'header-container' },
                { name: 'alert', targetId: 'alert-container' }
            ]);
        } catch (error) {
            console.error('Error loading components:', error);
        }
    }
}
```

---

## 📝 Tạo Component mới

### 1. **Tạo file component**
```html
<!-- components/new-component.html -->
<div class="bg-dark-900 rounded-lg p-4">
    <h3 class="text-lg font-semibold mb-4" data-i18n="component_title">Component Title</h3>
    <div class="space-y-4">
        <!-- Component content -->
        <div class="flex items-center p-3 bg-dark-800 rounded-lg">
            <i class="ti ti-star text-yellow-500 mr-3"></i>
            <span data-i18n="component_text">Component text</span>
        </div>
    </div>
</div>
```

### 2. **Sử dụng trong page**
```html
<!-- Trong page HTML -->
<div id="new-component-container"></div>

<!-- Trong JavaScript -->
await componentLoader.loadComponent('new-component', 'new-component-container');
```

### 3. **Component với Placeholders**
```html
<!-- components/user-card.html -->
<div class="bg-dark-900 rounded-lg p-4">
    <div class="flex items-center">
        <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <i class="ti ti-user text-white"></i>
        </div>
        <div class="ml-4">
            <h4 class="font-semibold">{{userName}}</h4>
            <p class="text-gray-400">{{userEmail}}</p>
        </div>
    </div>
</div>
```

```javascript
// Sử dụng với placeholders
await componentLoader.loadComponentWithPlaceholders(
    'user-card',
    'user-card-container',
    {
        userName: 'John Doe',
        userEmail: 'john@example.com'
    }
);
```

---

## 🎨 Best Practices

### 1. **Naming Convention**
```javascript
// Component files: kebab-case
header.html
user-card.html
data-table.html

// Target IDs: camelCase
headerContainer
userCardContainer
dataTableContainer
```

### 2. **Component Structure**
```html
<!-- Luôn có wrapper div -->
<div class="component-wrapper">
    <!-- Component content -->
    <div class="component-content">
        <!-- Use data-i18n for translations -->
        <h3 data-i18n="title">Title</h3>
        <p data-i18n="description">Description</p>
    </div>
</div>
```

### 3. **Error Handling**
```javascript
async loadComponents() {
    try {
        await componentLoader.loadComponents([
            { name: 'sidebar', targetId: 'sidebar-container' },
            { name: 'header', targetId: 'header-container' }
        ]);
    } catch (error) {
        console.error('Error loading components:', error);
        // Fallback content
        this.showFallbackContent();
    }
}
```

### 4. **Performance Optimization**
```javascript
// Check if component already loaded
if (!componentLoader.isComponentLoaded('sidebar')) {
    await componentLoader.loadComponent('sidebar', 'sidebar-container');
}

// Load components in parallel
await Promise.all([
    componentLoader.loadComponent('header', 'header-container'),
    componentLoader.loadComponent('sidebar', 'sidebar-container')
]);
```

---

## 🔄 Events & Lifecycle

### 1. **Component Loaded Event**
```javascript
// Listen for component loaded
document.addEventListener('componentLoaded', (event) => {
    const { componentName, target, options } = event.detail;
    
    if (componentName === 'sidebar') {
        // Setup sidebar functionality
        this.setupSidebar();
    }
    
    if (componentName === 'header') {
        // Setup header functionality
        this.setupHeader();
    }
});
```

### 2. **Component Lifecycle**
```javascript
// 1. Component file loaded
// 2. HTML inserted into target
// 3. componentLoaded event fired
// 4. Setup event listeners
// 5. Component ready for use
```

---

## 🐛 Troubleshooting

### 1. **Component không load**
```javascript
// Check file path
console.log('Loading component from:', `/components/${componentName}.html`);

// Check target element
const target = document.getElementById(targetId);
if (!target) {
    console.error(`Target element not found: ${targetId}`);
}
```

### 2. **Event listeners không hoạt động**
```javascript
// Wait for component to load
document.addEventListener('componentLoaded', (event) => {
    if (event.detail.componentName === 'sidebar') {
        // Setup event listeners after component loaded
        this.setupSidebarEvents();
    }
});
```

### 3. **Translation không hoạt động**
```html
<!-- Đảm bảo sử dụng data-i18n -->
<span data-i18n="key">Default text</span>

<!-- Không sử dụng -->
<span>Hardcoded text</span>
```

---

## 📚 Examples

### 1. **Dashboard Page**
```html
<!DOCTYPE html>
<html>
<head>
    <!-- Head content -->
</head>
<body>
    <div id="app">
        <!-- Layout with component placeholders -->
        <div id="layout-container">
            <div id="sidebar-container"></div>
            <div id="main-content">
                <div id="header-container"></div>
                <main id="main-content-container">
                    <!-- Dashboard content -->
                </main>
            </div>
        </div>
        <div id="alert-container"></div>
    </div>
    
    <!-- Scripts -->
    <script src="/js/modules/component-loader.js"></script>
    <script src="/js/modules/dashboard.js"></script>
</body>
</html>
```

### 2. **Login Page**
```html
<!DOCTYPE html>
<html>
<body>
    <div id="app">
        <!-- Simple layout for login -->
        <div id="alert-container"></div>
        <main id="main-content-container">
            <!-- Login form -->
        </main>
    </div>
    
    <script src="/js/modules/component-loader.js"></script>
    <script src="/js/modules/auth.js"></script>
</body>
</html>
```

---

## 🚀 Migration Guide

### 1. **Từ Inline HTML sang Components**
```html
<!-- Trước -->
<div id="sidebar" class="fixed top-0 left-0...">
    <!-- Sidebar content -->
</div>

<!-- Sau -->
<div id="sidebar-container"></div>
```

### 2. **Update JavaScript**
```javascript
// Trước
init() {
    this.setupEventListeners();
    this.loadDashboard();
}

// Sau
async init() {
    await this.loadComponents();
    this.setupEventListeners();
    await this.loadDashboard();
}
```

---

**Lưu ý**: Component system giúp code dễ maintain hơn và tái sử dụng tốt hơn. Hãy sử dụng components cho tất cả UI elements được dùng nhiều lần. 