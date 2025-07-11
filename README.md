# 🧾 Hệ thống Backend Bán Vé Online – Technical Spec & Build Plan

> **Giao diện dành cho Cursor:** Dark Mode ✅  | Icon: Tabler ✅

---

## 🌐 Tech Stack Tổng Thể

| Thành phần            | Công nghệ sử dụng                 | Vai trò chính                                             |
| --------------------- | --------------------------------- | --------------------------------------------------------- |
| **Framework Backend** | `NestJS`                          | Modular backend framework, Dependency Injection, scalable |
| **Database**          | `Supabase` (PostgreSQL)           | Cơ sở dữ liệu chính, hỗ trợ realtime, RLS, policy         |
| **ORM**               | `Prisma`                          | Query database, định nghĩa schema rõ ràng                 |
| **Auth**              | `Supabase Auth + Local Mapping`   | Xác thực người dùng, role lưu tại DB local                |
| **Queue & Jobs**      | `BullMQ` (Redis)                  | Xử lý tác vụ bất đồng bộ như gửi email, webhook           |
| **Gửi email**         | `Resend` / `SendGrid`             | Gửi vé điện tử, mã QR                                     |
| **Sinh QR code**      | `node-qrcode`                     | Tạo mã QR đính kèm vé                                     |
| **Realtime**          | `Supabase Realtime` / `Socket.IO` | Checkin realtime                                          |
| **File Storage**      | `Supabase Storage`                | Lưu QR code, banner sự kiện                               |
| **Monitoring**        | `Sentry`, `PostHog` (optional)    | Ghi nhận lỗi, hành vi người dùng                          |
| **BI / Dashboard**    | `Metabase` hoặc custom API        | Phân tích dữ liệu, thống kê                               |

---

## ⚙️ Schema Prisma đã có (Tóm tắt)

- `User`: Có `supabase_id`, mapping role qua enum + bảng `UserOrganization`
- `Organization`: Multi-tenant, tổ chức sự kiện
- `Event`: Sự kiện có vé, email log, tracking
- `Ticket`: Tồn kho, sold, loại vé, thời gian bán
- `Order` / `OrderItem`: Giao dịch mua hàng
- `Payment`: Kết quả thanh toán
- `CheckinLog`: Ghi nhận khi checkin
- `UserOrganization`: Bảng phân quyền cấp tổ chức
- `WebhookLog`, `EmailLog`: Theo dõi tác vụ gửi

---

## 🚀 Phase Triển Khai Hệ Thống

### 📦 Phase 1 – Khởi tạo hệ thống + Auth

- Scaffold project NestJS + Prisma
- Kết nối Supabase PostgreSQL
- Tạo module: `auth`, `users`
- Tích hợp Supabase Auth (magic link / email/pass)
- Mapping user và role từ local DB (`users`, `user_organizations`)
- Middleware decode JWT → lấy `supabase_id`, map roles

### 🎭 Phase 2 – Phân quyền & Multi-Tenant

- Enum Role: `USER`, `ADMIN_ORGANIZER`, `OWNER_ORGANIZER`, `SUPERADMIN`
- Module `roles`: Xây Guard kiểm tra quyền truy cập
- Module `organizations`: CRUD + mapping user
- Tất cả API đọc/ghi event/ticket phải dựa trên `organization_id`

### 🎫 Phase 3 – Event & Ticket

- Module `events`: CRUD sự kiện, public / private
- Module `tickets`: CRUD loại vé, check tồn kho
- Gắn vé theo từng sự kiện (1-n)

### 🧾 Phase 4 – Order & Thanh toán

- Module `orders`: tạo đơn hàng + item
- Kiểm tra vé đủ tồn kho trước khi mua
- Ghi lại thông tin snapshot giá
- Module `payments`: hỗ trợ Stripe / Momo (tùy config)
- Tạo QR code sau khi thanh toán thành công

### 📧 Phase 5 – Gửi vé điện tử (email + QR)

- Queue (BullMQ) worker gửi mail
- Template email dùng `Resend` hoặc `SendGrid`
- Upload QR lên Supabase Storage
- Cập nhật `email_logs`

### ✅ Phase 6 – Check-in bằng QR

- API `/checkin` nhận mã QR
- Verify: vé tồn tại, chưa dùng, đúng sự kiện
- Ghi log vào `checkin_logs`
- Trả kết quả check-in realtime (socket/supabase realtime)

### 📊 Phase 7 – Dashboard & Thống kê

- Tầng nền tảng:
  - Tổng số vé bán, doanh thu toàn hệ thống
- Tầng tổ chức:
  - Vé bán theo sự kiện, conversion, heatmap thời gian
- Dùng PostgreSQL aggregate + Supabase View hoặc Metabase

### 🌍 Phase 8 – API mở rộng cho Web/App

- Full REST API:
  - `/auth/me`, `/events`, `/tickets`, `/orders`, `/checkin`
- Middleware bảo vệ route
- Swagger module cho doc

### 🔔 Phase 9 – Webhook & Tracking

- Ghi webhook khi có order, payment, checkin
- Quản lý webhook theo `organization`
- Gửi retry khi thất bại

---

## 🗂️ Folder structure gợi ý

```ts
src/
├── auth/               // Supabase auth + JWT middleware
├── users/              // Quản lý người dùng, roles
├── organizations/      // CRUD tổ chức
├── events/             // CRUD sự kiện
├── tickets/            // Loại vé
├── orders/             // Tạo đơn hàng
├── payments/           // Cổng thanh toán
├── checkin/            // Check-in bằng QR
├── dashboard/          // Thống kê
├── queue/              // BullMQ workers
├── common/             // DTO, guard, interceptors
└── main.ts
```

---

## 🧠 Gợi ý Cursor Prompt Template

> Generate a NestJS module called `events`, with controller, service, and DTO files.
>
> Use Prisma ORM. The `Event` model is defined in schema.prisma.
>
> Endpoints:
>
> - GET /events
> - POST /events
> - GET /events/\:id
> - PUT /events/\:id
> - DELETE /events/\:id
>
> Each event belongs to an organization. Only users with role `ADMIN_ORGANIZER` or `OWNER_ORGANIZER` should be allowed to manage events under their organization.
>
> Add organization-based access guard.

---

## ✅ Next Step

- Cài đặt NestJS project scaffold
- Kết nối Prisma với Supabase
- Triển khai `auth`, `users`, `roles`, `organizations`
- Làm lần lượt từng phase, ưu tiên từ `auth → ticket → order → QR → check-in → dashboard`

> Ping tôi để generate file cụ thể nếu bạn cần: module NestJS mẫu, Guard, DTO hoặc Worker

---

**Chế độ dark mode + icon Tabler: đang áp dụng cho toàn bộ UI render trong Cursor IDE.**

