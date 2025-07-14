# Webhook Setup Guide

## 🔗 Cách hoạt động của Webhook System

### 1. Flow thanh toán hoàn chỉnh:

```
User A mua vé → Tạo Order (PENDING) → Chuyển đến Payment Gateway → 
Payment Gateway xử lý → Gửi Webhook về → Backend xác nhận → 
Cập nhật Order (COMPLETED) → Gửi vé cho User A
```

### 2. Webhook Endpoints:

| Gateway | Endpoint | Mô tả |
|---------|----------|-------|
| VNPAY | `POST /webhooks/payment/vnpay` | Xử lý webhook từ VNPAY |
| MOMO | `POST /webhooks/payment/momo` | Xử lý webhook từ MOMO |
| ZaloPay | `POST /webhooks/payment/zalopay` | Xử lý webhook từ ZaloPay |
| Generic | `POST /webhooks/payment/generic` | Xử lý webhook từ gateway khác |

### 3. Environment Variables cần thiết:

```env
# Webhook secrets cho từng gateway
VNPAY_WEBHOOK_SECRET=your_vnpay_webhook_secret
MOMO_WEBHOOK_SECRET=your_momo_webhook_secret
ZALOPAY_WEBHOOK_SECRET=your_zalopay_webhook_secret
```

### 4. Cách setup webhook với Payment Gateway:

#### VNPAY:
1. Đăng nhập vào VNPAY Merchant Portal
2. Vào Settings → Webhook Configuration
3. Thêm URL: `https://your-domain.com/webhooks/payment/vnpay`
4. Chọn events: `payment.success`, `payment.failed`
5. Copy webhook secret và thêm vào `.env`

#### MOMO:
1. Đăng nhập vào MOMO Business Portal
2. Vào API Management → Webhook Settings
3. Thêm URL: `https://your-domain.com/webhooks/payment/momo`
4. Chọn events: `payment.success`, `payment.failed`
5. Copy webhook secret và thêm vào `.env`

#### ZaloPay:
1. Đăng nhập vào ZaloPay Business Portal
2. Vào API Settings → Webhook Configuration
3. Thêm URL: `https://your-domain.com/webhooks/payment/zalopay`
4. Chọn events: `payment.success`, `payment.failed`
5. Copy webhook secret và thêm vào `.env`

### 5. Webhook Payload Examples:

#### VNPAY Webhook:
```json
{
  "vnp_TxnRef": "12345",
  "vnp_TransactionNo": "VNPAY123456789",
  "vnp_Amount": "1000000",
  "vnp_ResponseCode": "00",
  "vnp_OrderInfo": "Thanh toan ve su kien",
  "vnp_BankCode": "NCB"
}
```

#### MOMO Webhook:
```json
{
  "orderId": "12345",
  "transId": "MOMO123456789",
  "amount": 1000000,
  "resultCode": 0,
  "message": "Success"
}
```

#### ZaloPay Webhook:
```json
{
  "orderId": "12345",
  "transactionId": "ZALOPAY123456789",
  "amount": 1000000,
  "status": "SUCCESS",
  "message": "Payment successful"
}
```

### 6. Security Features:

✅ **Signature Verification** - Xác thực webhook signature
✅ **Amount Validation** - Kiểm tra số tiền thanh toán
✅ **Order Validation** - Kiểm tra đơn hàng tồn tại
✅ **Duplicate Prevention** - Tránh xử lý webhook trùng lặp
✅ **Error Logging** - Log tất cả webhook errors

### 7. Testing Webhooks:

#### Sử dụng ngrok để test locally:
```bash
# Install ngrok
npm install -g ngrok

# Start ngrok tunnel
ngrok http 3000

# Copy ngrok URL và thêm vào payment gateway webhook settings
# Example: https://abc123.ngrok.io/webhooks/payment/vnpay
```

#### Test với curl:
```bash
# Test VNPAY webhook
curl -X POST http://localhost:3000/webhooks/payment/vnpay \
  -H "Content-Type: application/json" \
  -H "x-signature: your_signature_here" \
  -d '{
    "vnp_TxnRef": "12345",
    "vnp_TransactionNo": "VNPAY123456789",
    "vnp_Amount": "1000000",
    "vnp_ResponseCode": "00"
  }'
```

### 8. Monitoring Webhooks:

#### Kiểm tra webhook logs:
```sql
-- Xem tất cả webhook logs
SELECT * FROM "WebhookLog" ORDER BY created_at DESC;

-- Xem webhook errors
SELECT * FROM "WebhookLog" WHERE status_code != 200;
```

#### API để check webhook status:
```bash
GET /api/webhooks/logs
GET /api/webhooks/logs/errors
```

### 9. Troubleshooting:

#### Webhook không được gọi:
1. Kiểm tra URL endpoint có đúng không
2. Kiểm tra firewall/security groups
3. Kiểm tra SSL certificate (HTTPS required)
4. Kiểm tra webhook secret có đúng không

#### Webhook bị reject:
1. Kiểm tra signature verification
2. Kiểm tra payload format
3. Kiểm tra amount validation
4. Xem logs để debug

#### Order không được update:
1. Kiểm tra order ID có đúng không
2. Kiểm tra payment record có tồn tại không
3. Kiểm tra database transaction
4. Xem error logs

### 10. Production Checklist:

- [ ] Setup SSL certificate
- [ ] Configure webhook secrets
- [ ] Test webhook endpoints
- [ ] Setup monitoring/alerting
- [ ] Configure retry mechanism
- [ ] Setup backup webhook URLs
- [ ] Document webhook formats
- [ ] Train support team 