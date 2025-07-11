# 🧾 OCX Online Ticket Frontend - Phase 1

## 📁 Cấu trúc thư mục

```
public/
├── index.html          # Trang chủ với API testing
├── dashboard.html      # Dashboard admin
├── js/
│   ├── app.js         # Logic cho trang chủ
│   └── dashboard.js   # Logic cho dashboard
└── README.md          # File này
```

## 🎨 Tính năng giao diện

### ✅ Đã hoàn thành:

1. **Dark Mode 100%**
   - Giao diện tối hoàn toàn
   - Toggle theme (Ctrl/Cmd + T)
   - Màu sắc tối ưu cho mắt

2. **Responsive Design**
   - Desktop: Full layout với sidebar
   - Mobile: Collapsible sidebar
   - Tablet: Adaptive grid layout

3. **Tabler Icons**
   - Sử dụng Tabler Icons CDN
   - Icons phù hợp với từng chức năng
   - Consistent icon style

4. **Tailwind CSS**
   - Utility-first CSS framework
   - Custom dark color palette
   - Smooth transitions và animations

## 🚀 Cách sử dụng

### 1. Trang chủ (`index.html`)
- **API Testing**: Test các endpoint auth
- **Register Form**: Đăng ký user mới
- **Login Form**: Đăng nhập
- **Demo Button**: Điền dữ liệu mẫu

### 2. Dashboard (`dashboard.html`)
- **Stats Cards**: Thống kê tổng quan
- **Recent Activity**: Hoạt động gần đây
- **API Status**: Trạng thái các module
- **Navigation**: Menu điều hướng

## ⌨️ Keyboard Shortcuts

| Phím tắt | Chức năng |
|----------|-----------|
| `Ctrl/Cmd + T` | Toggle theme |
| `Ctrl/Cmd + K` | Toggle sidebar (mobile) |
| `Ctrl/Cmd + Enter` | Submit form |

## 🔧 API Integration

### Endpoints được test:
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/docs` - Swagger docs

### Local Storage:
- `accessToken`: JWT token
- `user`: Thông tin user

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎯 Phase 1 Features

### ✅ Hoàn thành:
- [x] Authentication UI
- [x] API Testing Interface
- [x] Dashboard Layout
- [x] Dark Mode
- [x] Responsive Design
- [x] Tabler Icons
- [x] Tailwind CSS

### 🔄 Sẽ có trong Phase tiếp theo:
- [ ] Event Management UI
- [ ] Ticket Management UI
- [ ] User Management UI
- [ ] Statistics Charts
- [ ] Real-time Updates
- [ ] QR Code Scanner

## 🚀 Chạy ứng dụng

1. **Khởi động backend:**
```bash
npm run start:dev
```

2. **Truy cập frontend:**
- Trang chủ: `http://localhost:3000`
- Dashboard: `http://localhost:3000/dashboard.html`
- API Docs: `http://localhost:3000/docs`

## 🎨 Customization

### Thay đổi màu sắc:
```javascript
// Trong tailwind.config
colors: {
  dark: {
    900: '#0f172a', // Background chính
    800: '#1e293b', // Cards
    700: '#334155', // Hover states
  }
}
```

### Thêm icons:
```html
<span class="ti ti-icon-name"></span>
```

## 📝 Notes

- Frontend được thiết kế để hoạt động với backend NestJS
- CORS đã được cấu hình cho localhost
- Static files được serve từ thư mục `public/`
- Tất cả API calls đều có error handling 