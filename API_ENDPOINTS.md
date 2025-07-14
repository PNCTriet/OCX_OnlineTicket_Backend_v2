# API Endpoints Documentation

## 🔐 Authentication
- `POST /auth/login` - Đăng nhập
- `POST /auth/register` - Đăng ký
- `GET /auth/profile` - Lấy thông tin user (cần JWT)

## 🎭 Events (Sự kiện)

### Public Endpoints (không cần auth)
- `GET /events/public` - Lấy danh sách sự kiện công khai
- `GET /events/public/:id` - Lấy thông tin sự kiện công khai theo ID

### Admin Endpoints (cần JWT)
- `GET /events` - Lấy danh sách tất cả sự kiện
- `GET /events/count` - Đếm tổng số sự kiện
- `GET /events/:id` - Lấy thông tin sự kiện theo ID
- `POST /events` - Tạo sự kiện mới
- `PUT /events/:id` - Cập nhật sự kiện
- `DELETE /events/:id` - Xóa sự kiện

## 🎫 Tickets (Vé)

### Public Endpoints (không cần auth)
- `GET /tickets/public/event/:eventId` - Lấy danh sách vé có sẵn cho sự kiện
- `POST /tickets/public/check-availability` - Kiểm tra số lượng vé còn lại

### Admin Endpoints (cần JWT)
- `GET /tickets` - Lấy danh sách tất cả vé
- `GET /tickets/count` - Đếm tổng số vé
- `GET /tickets/:id` - Lấy thông tin vé theo ID
- `POST /tickets` - Tạo vé mới
- `PUT /tickets/:id` - Cập nhật vé
- `DELETE /tickets/:id` - Xóa vé

## 🛒 Orders (Đơn hàng)

### User Endpoints (cần JWT)
- `POST /orders/purchase` - Mua vé
- `GET /orders/my-orders` - Lấy danh sách đơn hàng của user
- `GET /orders/my-orders/:id` - Lấy chi tiết đơn hàng của user
- `GET /orders/my-orders/:id/payment-status` - Kiểm tra trạng thái thanh toán

### Admin Endpoints (cần JWT)
- `GET /orders` - Lấy danh sách tất cả đơn hàng
- `GET /orders/count` - Đếm tổng số đơn hàng
- `GET /orders/:id` - Lấy thông tin đơn hàng theo ID
- `POST /orders` - Tạo đơn hàng mới
- `PUT /orders/:id` - Cập nhật đơn hàng
- `DELETE /orders/:id` - Xóa đơn hàng

## 👥 Users (Người dùng)

### Admin Endpoints (cần JWT)
- `GET /users` - Lấy danh sách tất cả users
- `GET /users/count` - Đếm tổng số users
- `GET /users/:id` - Lấy thông tin user theo ID
- `POST /users` - Tạo user mới
- `PUT /users/:id` - Cập nhật user
- `DELETE /users/:id` - Xóa user

## 💰 Payments (Thanh toán)

### Admin Endpoints (cần JWT)
- `GET /payments` - Lấy danh sách tất cả payments
- `GET /payments/count` - Đếm tổng số payments
- `GET /payments/:id` - Lấy thông tin payment theo ID
- `POST /payments` - Tạo payment mới
- `PUT /payments/:id` - Cập nhật payment
- `DELETE /payments/:id` - Xóa payment

## 📊 Dashboard

### Admin Endpoints (cần JWT)
- `GET /api/dashboard/stats` - Lấy thống kê tổng quan cho dashboard

## 🔗 Webhooks

### Payment Gateway Webhooks
- `POST /webhooks/payment/vnpay` - Webhook xác nhận thanh toán VNPAY
- `POST /webhooks/payment/momo` - Webhook xác nhận thanh toán MOMO
- `POST /webhooks/payment/zalopay` - Webhook xác nhận thanh toán ZaloPay
- `POST /webhooks/payment/generic` - Webhook xác nhận thanh toán generic

## 🏥 Health Check
- `GET /api/health` - Health check endpoint

## 📝 Request/Response Examples

### Mua vé
```json
POST /orders/purchase
Authorization: Bearer <JWT_TOKEN>

{
  "items": [
    {
      "ticketId": 1,
      "quantity": 2
    }
  ],
  "paymentMethod": "VNPAY",
  "promoCode": "SAVE10"
}
```

### Kiểm tra số lượng vé
```json
POST /tickets/public/check-availability

{
  "ticketId": 1,
  "quantity": 2
}
```

### Response
```json
{
  "available": true,
  "remaining": 50,
  "requested": 2
}
```

## 🔑 Authentication

Tất cả API endpoints cần authentication sẽ yêu cầu JWT token trong header:
```
Authorization: Bearer <JWT_TOKEN>
```

## 📋 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error 