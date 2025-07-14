# Database Seed Data - OCX Online Ticket System

## Tổng quan

Dữ liệu mẫu này được tạo để test hệ thống CRM với sự kiện **"Ớt Cay Xè Concert"** làm trung tâm.

## Cấu trúc dữ liệu

### 🏢 Organizations (Tổ chức)
- **Ớt Cay Xè Entertainment** - Tổ chức chính tổ chức concert
- **Saigon Events Co.** - Tổ chức đối tác

### 👥 Users (Người dùng)
- **3 Admin users**: admin@otcayxe.com, superadmin@otcayxe.com, organizer@otcayxe.com
- **10 Customer users**: Các khách hàng mua vé concert

### 🎪 Events (Sự kiện)
- **Ớt Cay Xè Concert**: 25/12/2024 tại SECC, HCMC
- Mô tả: Buổi hòa nhạc đặc biệt với những ca khúc hit nhất

### 🎫 Tickets (Vé)
- **GA Ticket**: 489,000 VND
- Tổng số: 1,000 vé
- Đã bán: 9 vé (từ 10 orders)

### 🛒 Orders & Payments (Đơn hàng & Thanh toán)
- **10 orders** từ khách hàng
- **9 orders completed**, 1 pending
- Các phương thức thanh toán: VNPAY, MOMO, ZALOPAY, Bank Transfer
- Một số orders sử dụng promo codes

### 🎫 Promo Codes (Mã giảm giá)
- **EARLYBIRD**: Giảm 10%
- **VIP2024**: Giảm 15%
- **FLAT50K**: Giảm 50,000 VND

## Cách chạy seed data

### 1. Chuẩn bị
```bash
# Đảm bảo database đã được migrate
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate
```

### 2. Chạy seed
```bash
# Chạy script seed
npm run db:seed
```

### 3. Kiểm tra kết quả
```bash
# Mở Prisma Studio để xem dữ liệu
npm run prisma:studio
```

## Dữ liệu chi tiết

### Admin Users
| Email | Role | Name |
|-------|------|------|
| admin@otcayxe.com | ADMIN | Nguyen Van Admin |
| superadmin@otcayxe.com | SUPERADMIN | Tran Thi SuperAdmin |
| organizer@otcayxe.com | OWNER_ORGANIZER | Le Van Organizer |

### Customer Users
| Email | Name | Phone |
|-------|------|-------|
| nguyenvan.a@email.com | Nguyen Van A | +84 91 111 1111 |
| tranthi.b@email.com | Tran Thi B | +84 91 222 2222 |
| levan.c@email.com | Le Van C | +84 91 333 3333 |
| phamthu.d@email.com | Pham Thu D | +84 91 444 4444 |
| hoangminh.e@email.com | Hoang Minh E | +84 91 555 5555 |
| vuthi.f@email.com | Vu Thi F | +84 91 666 6666 |
| dangquang.g@email.com | Dang Quang G | +84 91 777 7777 |
| buitien.h@email.com | Bui Tien H | +84 91 888 8888 |
| nguyenthanh.i@email.com | Nguyen Thanh I | +84 91 999 9999 |
| lethu.j@email.com | Le Thu J | +84 91 000 0000 |

### Orders Summary
- **Completed**: 9 orders
- **Pending**: 1 order
- **Total Revenue**: 4,401,000 VND (bao gồm discount)
- **Payment Methods**: VNPAY, MOMO, ZALOPAY, Bank Transfer

### Tracking & Analytics
- **Email Logs**: 5 confirmation emails sent
- **Webhook Logs**: 3 webhook events logged
- **Tracking Visits**: 5 tracking records from different sources
- **Checkin Logs**: 5 checkin records for completed orders

## Test Scenarios

### 1. Admin Dashboard
- Login với admin@otcayxe.com
- Xem thống kê: 13 users, 1 event, 1 ticket type, 10 orders
- Kiểm tra revenue: 4,401,000 VND

### 2. User Management
- Xem danh sách 13 users
- Filter theo role: 3 admin, 10 customers
- Kiểm tra verified status

### 3. Event Management
- Xem chi tiết "Ớt Cay Xè Concert"
- Kiểm tra ticket sales: 9/1000 sold
- Xem event settings

### 4. Order Management
- Xem 10 orders với status khác nhau
- Kiểm tra payment status
- Xem order items và promo codes

### 5. Payment Tracking
- Xem 10 payment records
- Kiểm tra payment methods
- Verify transaction codes

## Lưu ý

- Dữ liệu này chỉ dành cho testing
- Có thể xóa và chạy lại seed bất cứ lúc nào
- Để xóa dữ liệu cũ, uncomment các dòng TRUNCATE trong seed.sql
- Tất cả timestamps được set theo thời gian thực khi chạy seed 