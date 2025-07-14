# 🎨 OCX Frontend UI/UX Guideline

> **Giao diện dành cho Cursor:** Dark Mode ✅  | Icon: Tabler ✅

---

## 🎯 Tổng quan

Frontend của hệ thống OCX Online Ticket được thiết kế với tiêu chí:
- **100% Dark Mode** - Giao diện tối như cursor.com
- **Responsive** - Hoạt động tốt trên desktop/mobile
- **Modern UI** - Sử dụng TailwindCSS + Tabler Icons
- **User-friendly** - Thông báo lỗi rõ ràng, UX tốt

---

## 🎨 Design System

### 1. **Màu sắc (Color Palette)**

```css
/* Dark Theme Colors */
--dark-50: #f8fafc
--dark-100: #f1f5f9
--dark-200: #e2e8f0
--dark-300: #cbd5e1
--dark-400: #94a3b8
--dark-500: #64748b
--dark-600: #475569
--dark-700: #334155
--dark-800: #1e293b
--dark-900: #0f172a
--dark-950: #020617

/* Brand Colors */
--primary: #3b82f6 (blue-500)
--success: #10b981 (green-500)
--warning: #f59e0b (yellow-500)
--error: #ef4444 (red-500)
--info: #3b82f6 (blue-500)
```

### 2. **Typography**

```css
/* Headings */
h1: text-3xl font-bold
h2: text-2xl font-bold
h3: text-lg font-semibold
h4: text-base font-medium

/* Body Text */
p: text-sm text-gray-300
label: text-sm font-medium text-gray-300
```

### 3. **Spacing System**

```css
/* Padding/Margin */
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 3rem (48px)
```

---

## 🧩 Component Library

### 1. **Button Components**

```html
<!-- Primary Button -->
<button class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center">
    <i class="ti ti-login mr-2"></i>Đăng nhập
</button>

<!-- Secondary Button -->
<button class="bg-dark-800 hover:bg-dark-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
    Hủy
</button>

<!-- Danger Button -->
<button class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
    <i class="ti ti-trash mr-2"></i>Xóa
</button>
```

### 2. **Input Components**

```html
<!-- Text Input -->
<input type="email" 
       class="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400">

<!-- Password Input -->
<input type="password" 
       class="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400">
```

### 3. **Alert Components**

```html
<!-- Success Alert -->
<div class="bg-dark-900 border border-green-500 rounded-lg shadow-xl p-4">
    <div class="flex items-start">
        <i class="ti ti-check text-green-500 text-xl"></i>
        <div class="ml-3">
            <h3 class="text-sm font-medium text-white">Thành công</h3>
            <p class="text-sm text-gray-400 mt-1">Thao tác đã hoàn thành</p>
        </div>
    </div>
</div>

<!-- Error Alert -->
<div class="bg-dark-900 border border-red-500 rounded-lg shadow-xl p-4">
    <div class="flex items-start">
        <i class="ti ti-alert-circle text-red-500 text-xl"></i>
        <div class="ml-3">
            <h3 class="text-sm font-medium text-white">Lỗi</h3>
            <p class="text-sm text-gray-400 mt-1">Có lỗi xảy ra</p>
        </div>
    </div>
</div>
```

### 4. **Card Components**

```html
<!-- Content Card -->
<div class="bg-dark-900 rounded-lg shadow-xl p-8">
    <div class="text-center mb-8">
        <i class="ti ti-login text-4xl text-blue-500 mb-4"></i>
        <h2 class="text-2xl font-bold">Đăng nhập</h2>
        <p class="text-gray-400 mt-2">Vào hệ thống quản lý vé</p>
    </div>
    <!-- Content here -->
</div>
```

### 5. **Table Components**

```html
<!-- Data Table -->
<table class="w-full text-sm text-left">
    <thead class="text-xs uppercase bg-dark-800">
        <tr>
            <th class="px-6 py-3">Tên</th>
            <th class="px-6 py-3">Email</th>
            <th class="px-6 py-3">Vai trò</th>
        </tr>
    </thead>
    <tbody>
        <tr class="table-row border-b border-dark-700">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-white">User Name</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-300">user@example.com</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="status-badge status-active">Admin</span>
            </td>
        </tr>
    </tbody>
</table>
```

---

## 🎯 Icon System

### 1. **Tabler Icons Usage**

```html
<!-- Always include Tabler Icons CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons@latest/iconfont/tabler-icons.min.css">

<!-- Icon Classes -->
<i class="ti ti-login"></i>      <!-- Login icon -->
<i class="ti ti-user-plus"></i>  <!-- Register icon -->
<i class="ti ti-users"></i>      <!-- Users icon -->
<i class="ti ti-book"></i>       <!-- Documentation icon -->
<i class="ti ti-check"></i>      <!-- Success icon -->
<i class="ti ti-alert-circle"></i> <!-- Error icon -->
<i class="ti ti-info-circle"></i> <!-- Info icon -->
<i class="ti ti-edit"></i>       <!-- Edit icon -->
<i class="ti ti-trash"></i>      <!-- Delete icon -->
<i class="ti ti-refresh"></i>    <!-- Refresh/Sync icon -->
```

### 2. **Icon Sizing**

```css
/* Icon sizes */
text-xs: 12px
text-sm: 14px
text-base: 16px
text-lg: 18px
text-xl: 20px
text-2xl: 24px
text-3xl: 30px
text-4xl: 36px
```

---

## 📱 Responsive Design

### 1. **Breakpoints**

```css
/* Mobile First Approach */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### 2. **Mobile Utilities**

```css
/* Hide on mobile */
.mobile-hidden { display: none; }

/* Full width on mobile */
.mobile-full { width: 100%; }

/* Responsive text */
.text-sm md:text-base lg:text-lg
```

---

## ⚡ Animation & Transitions

### 1. **CSS Animations**

```css
/* Fade In */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Slide In */
@keyframes slideIn {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
}

/* Pulse */
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}
```

### 2. **Transition Classes**

```css
/* Button hover effects */
.btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Form focus effects */
.form-input:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

---

## 🚨 Error Handling

### 1. **Alert System**

```javascript
// Alert types
showAlert('success', 'Thành công', 'Thao tác hoàn thành');
showAlert('error', 'Lỗi', 'Có lỗi xảy ra');
showAlert('warning', 'Cảnh báo', 'Vui lòng kiểm tra lại');
showAlert('info', 'Thông tin', 'Đang xử lý...');
```

### 2. **Form Validation**

```javascript
// Client-side validation
if (!email || !password) {
    showAlert('error', 'Lỗi', 'Vui lòng nhập đầy đủ thông tin');
    return;
}
```

---

## 🔧 JavaScript Patterns

### 1. **Modular Architecture**

```javascript
// Main App (for index.html)
class OCXApp {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3000/api';
        this.currentUser = null;
        this.token = localStorage.getItem('ocx_token');
    }
    
    // Methods...
}

// Modular Approach (for specific pages)
class AuthModule {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3000/api';
        this.token = localStorage.getItem('ocx_token');
    }
    
    // Auth-specific methods...
}

class DashboardModule {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3000/api';
        this.token = localStorage.getItem('ocx_token');
    }
    
    // Dashboard-specific methods...
}
```

### 2. **API Calls**

```javascript
// Standard API call pattern
async function apiCall(endpoint, options = {}) {
    const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        },
        ...options
    });
    
    return response.json();
}
```

---

## 📋 File Structure

```
public/
├── index.html          # Home page (simple welcome)
├── pages/              # Separate page files
│   ├── login.html      # Login page
│   ├── register.html   # Register page
│   ├── dashboard.html  # Admin dashboard
│   └── admin_manage_*.html # Admin management pages
├── styles/
│   └── main.css       # Custom CSS
├── js/
│   ├── app.js         # Main app (for index.html)
│   ├── i18n.js        # Internationalization
│   └── modules/       # Modular JavaScript
│       ├── auth.js    # Login/Register module
│       ├── dashboard.js # Dashboard module
│       ├── admin.js   # Common admin functions
│       └── admin_manage_*.js # Specific admin modules
└── favicon.svg        # Favicon
```

---

## 🎯 Best Practices

### 1. **Accessibility**

- Sử dụng semantic HTML
- Thêm `alt` cho images
- Focus styles cho keyboard navigation
- ARIA labels cho screen readers

### 2. **Performance**

- Lazy loading cho images
- Minify CSS/JS trong production
- CDN cho external libraries
- Optimize images

### 3. **Security**

- Sanitize user input
- CSRF protection
- XSS prevention
- Secure headers

### 4. **Code Organization**

- Modular JavaScript
- Reusable components
- Consistent naming conventions
- Clear documentation

---

## 🔄 State Management

### 1. **Local Storage**

```javascript
// Save user data
localStorage.setItem('ocx_token', token);
localStorage.setItem('ocx_user', JSON.stringify(user));

// Retrieve user data
const token = localStorage.getItem('ocx_token');
const user = JSON.parse(localStorage.getItem('ocx_user'));
```

### 2. **Session Management**

```javascript
// Check authentication
checkAuth() {
    if (this.token) {
        this.currentUser = JSON.parse(localStorage.getItem('ocx_user'));
        this.updateNavigation();
    }
}
```

---

## 🚀 Deployment Checklist

- [ ] Minify CSS and JavaScript
- [ ] Optimize images
- [ ] Set up proper CORS headers
- [ ] Configure environment variables
- [ ] Test on different browsers
- [ ] Mobile responsiveness check
- [ ] Performance audit
- [ ] Security review

---

## 📚 Resources

- **TailwindCSS**: https://tailwindcss.com/
- **Tabler Icons**: https://tabler-icons.io/
- **Dark Mode Guide**: https://tailwindcss.com/docs/dark-mode
- **Responsive Design**: https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design

---

**Lưu ý**: Guideline này sẽ được cập nhật khi có thêm components hoặc thay đổi design system. 