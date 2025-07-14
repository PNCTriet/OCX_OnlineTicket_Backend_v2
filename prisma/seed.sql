-- Seed data for OCX Online Ticket System CRM
-- Based on "Ớt Cay Xè Concert" event

-- Clear existing data (optional - uncomment if needed)
TRUNCATE TABLE "users" CASCADE;
TRUNCATE TABLE "Organization" CASCADE;
TRUNCATE TABLE "Event" CASCADE;
TRUNCATE TABLE "Ticket" CASCADE;
TRUNCATE TABLE "Order" CASCADE;
TRUNCATE TABLE "OrderItem" CASCADE;
TRUNCATE TABLE "Payment" CASCADE;

-- Insert Organizations
INSERT INTO "Organization" (id, name, contact_email, phone, address, created_at, updated_at) VALUES
(1, 'Ớt Cay Xè Entertainment', 'info@otcayxe.com', '+84 90 123 4567', '123 Nguyen Hue, District 1, Ho Chi Minh City', NOW(), NOW()),
(2, 'Saigon Events Co.', 'contact@saigonevents.com', '+84 91 234 5678', '456 Le Loi, District 1, Ho Chi Minh City', NOW(), NOW());

-- Insert Users (Admin and Customers) - Note: using "users" table name as per schema
INSERT INTO "users" (id, email, name, role, is_verified, phone, avatar_url, created_at, updated_at) VALUES
-- Admin Users
('admin_001', 'admin@otcayxe.com', 'Nguyen Van Admin', 'ADMIN', true, '+84 90 111 1111', 'https://example.com/avatar1.jpg', NOW(), NOW()),
('superadmin_001', 'superadmin@otcayxe.com', 'Tran Thi SuperAdmin', 'SUPERADMIN', true, '+84 90 222 2222', 'https://example.com/avatar2.jpg', NOW(), NOW()),
('organizer_001', 'organizer@otcayxe.com', 'Le Van Organizer', 'OWNER_ORGANIZER', true, '+84 90 333 3333', 'https://example.com/avatar3.jpg', NOW(), NOW()),

-- Customer Users
('user_001', 'nguyenvan.a@email.com', 'Nguyen Van A', 'USER', true, '+84 91 111 1111', 'https://example.com/avatar4.jpg', NOW(), NOW()),
('user_002', 'tranthi.b@email.com', 'Tran Thi B', 'USER', true, '+84 91 222 2222', 'https://example.com/avatar5.jpg', NOW(), NOW()),
('user_003', 'levan.c@email.com', 'Le Van C', 'USER', true, '+84 91 333 3333', 'https://example.com/avatar6.jpg', NOW(), NOW()),
('user_004', 'phamthu.d@email.com', 'Pham Thu D', 'USER', true, '+84 91 444 4444', 'https://example.com/avatar7.jpg', NOW(), NOW()),
('user_005', 'hoangminh.e@email.com', 'Hoang Minh E', 'USER', true, '+84 91 555 5555', 'https://example.com/avatar8.jpg', NOW(), NOW()),
('user_006', 'vuthi.f@email.com', 'Vu Thi F', 'USER', true, '+84 91 666 6666', 'https://example.com/avatar9.jpg', NOW(), NOW()),
('user_007', 'dangquang.g@email.com', 'Dang Quang G', 'USER', true, '+84 91 777 7777', 'https://example.com/avatar10.jpg', NOW(), NOW()),
('user_008', 'buitien.h@email.com', 'Bui Tien H', 'USER', true, '+84 91 888 8888', 'https://example.com/avatar11.jpg', NOW(), NOW()),
('user_009', 'nguyenthanh.i@email.com', 'Nguyen Thanh I', 'USER', true, '+84 91 999 9999', 'https://example.com/avatar12.jpg', NOW(), NOW()),
('user_010', 'lethu.j@email.com', 'Le Thu J', 'USER', true, '+84 91 000 0000', 'https://example.com/avatar13.jpg', NOW(), NOW());

-- Insert User Organizations (Admin relationships)
INSERT INTO "UserOrganization" (id, user_id, organization_id, role, created_at, updated_at) VALUES
(1, 'admin_001', 1, 'ADMIN', NOW(), NOW()),
(2, 'superadmin_001', 1, 'SUPERADMIN', NOW(), NOW()),
(3, 'organizer_001', 1, 'OWNER', NOW(), NOW());

-- Insert Events
INSERT INTO "Event" (id, organization_id, name, description, date, location, created_at, updated_at) VALUES
(1, 1, 'Ớt Cay Xè Concert', 'Buổi hòa nhạc đặc biệt với những ca khúc hit nhất của Ớt Cay Xè. Một đêm âm nhạc đầy cảm xúc và sôi động.', '2024-12-25 19:00:00', 'Saigon Exhibition & Convention Center (SECC), 799 Nguyen Van Linh, District 7, Ho Chi Minh City', NOW(), NOW());

-- Insert Tickets
INSERT INTO "Ticket" (id, event_id, name, price, type, total, sold, start_sale_date, end_sale_date, is_active, created_at, updated_at) VALUES
(1, 1, 'GA Ticket - Ớt Cay Xè Concert', 489000, 'GA', 1000, 0, '2024-11-01 00:00:00', '2024-12-24 23:59:59', true, NOW(), NOW());

-- Insert Promo Codes
INSERT INTO "PromoCode" (id, code, description, discount_type, discount_value, max_uses, uses, valid_from, valid_until, is_active, created_at, updated_at) VALUES
(1, 'EARLYBIRD', 'Early bird discount 10%', 'PERCENTAGE', 10.00, 100, 0, '2024-11-01 00:00:00', '2024-11-30 23:59:59', true, NOW(), NOW()),
(2, 'VIP2024', 'VIP discount 15%', 'PERCENTAGE', 15.00, 50, 0, '2024-11-01 00:00:00', '2024-12-20 23:59:59', true, NOW(), NOW()),
(3, 'FLAT50K', 'Flat discount 50,000 VND', 'FIXED', 50000.00, 200, 0, '2024-11-01 00:00:00', '2024-12-20 23:59:59', true, NOW(), NOW());

-- Insert Orders (Sample orders from customers)
INSERT INTO "Order" (id, user_id, status, payment_method, amount, created_at, updated_at) VALUES
(1, 'user_001', 'COMPLETED', 'CREDIT_CARD', 489000, '2024-11-15 10:30:00', '2024-11-15 10:35:00'),
(2, 'user_002', 'COMPLETED', 'BANK_TRANSFER', 489000, '2024-11-16 14:20:00', '2024-11-16 14:25:00'),
(3, 'user_003', 'COMPLETED', 'MOMO', 489000, '2024-11-17 09:15:00', '2024-11-17 09:20:00'),
(4, 'user_004', 'COMPLETED', 'ZALOPAY', 489000, '2024-11-18 16:45:00', '2024-11-18 16:50:00'),
(5, 'user_005', 'COMPLETED', 'CREDIT_CARD', 489000, '2024-11-19 11:30:00', '2024-11-19 11:35:00'),
(6, 'user_006', 'PENDING', 'BANK_TRANSFER', 489000, '2024-11-20 13:20:00', '2024-11-20 13:20:00'),
(7, 'user_007', 'COMPLETED', 'MOMO', 489000, '2024-11-21 08:45:00', '2024-11-21 08:50:00'),
(8, 'user_008', 'COMPLETED', 'ZALOPAY', 489000, '2024-11-22 15:10:00', '2024-11-22 15:15:00'),
(9, 'user_009', 'COMPLETED', 'CREDIT_CARD', 489000, '2024-11-23 12:30:00', '2024-11-23 12:35:00'),
(10, 'user_010', 'COMPLETED', 'BANK_TRANSFER', 489000, '2024-11-24 17:20:00', '2024-11-24 17:25:00');

-- Insert Order Items
INSERT INTO "OrderItem" (id, order_id, ticket_id, quantity, price_snapshot, created_at, updated_at) VALUES
(1, 1, 1, 1, 489000, '2024-11-15 10:30:00', '2024-11-15 10:30:00'),
(2, 2, 1, 1, 489000, '2024-11-16 14:20:00', '2024-11-16 14:20:00'),
(3, 3, 1, 1, 489000, '2024-11-17 09:15:00', '2024-11-17 09:15:00'),
(4, 4, 1, 1, 489000, '2024-11-18 16:45:00', '2024-11-18 16:45:00'),
(5, 5, 1, 1, 489000, '2024-11-19 11:30:00', '2024-11-19 11:30:00'),
(6, 6, 1, 1, 489000, '2024-11-20 13:20:00', '2024-11-20 13:20:00'),
(7, 7, 1, 1, 489000, '2024-11-21 08:45:00', '2024-11-21 08:45:00'),
(8, 8, 1, 1, 489000, '2024-11-22 15:10:00', '2024-11-22 15:10:00'),
(9, 9, 1, 1, 489000, '2024-11-23 12:30:00', '2024-11-23 12:30:00'),
(10, 10, 1, 1, 489000, '2024-11-24 17:20:00', '2024-11-24 17:20:00');

-- Insert Payments (Note: Payment table doesn't have amount column)
INSERT INTO "Payment" (id, order_id, gateway, status, txn_code, paid_at, created_at, updated_at) VALUES
(1, 1, 'VNPAY', 'SUCCESS', 'TXN001', '2024-11-15 10:35:00', '2024-11-15 10:30:00', '2024-11-15 10:35:00'),
(2, 2, 'BANK_TRANSFER', 'SUCCESS', 'TXN002', '2024-11-16 14:25:00', '2024-11-16 14:20:00', '2024-11-16 14:25:00'),
(3, 3, 'MOMO', 'SUCCESS', 'TXN003', '2024-11-17 09:20:00', '2024-11-17 09:15:00', '2024-11-17 09:20:00'),
(4, 4, 'ZALOPAY', 'SUCCESS', 'TXN004', '2024-11-18 16:50:00', '2024-11-18 16:45:00', '2024-11-18 16:50:00'),
(5, 5, 'VNPAY', 'SUCCESS', 'TXN005', '2024-11-19 11:35:00', '2024-11-19 11:30:00', '2024-11-19 11:35:00'),
(6, 6, 'BANK_TRANSFER', 'PENDING', NULL, NULL, '2024-11-20 13:20:00', '2024-11-20 13:20:00'),
(7, 7, 'MOMO', 'SUCCESS', 'TXN007', '2024-11-21 08:50:00', '2024-11-21 08:45:00', '2024-11-21 08:50:00'),
(8, 8, 'ZALOPAY', 'SUCCESS', 'TXN008', '2024-11-22 15:15:00', '2024-11-22 15:10:00', '2024-11-22 15:15:00'),
(9, 9, 'VNPAY', 'SUCCESS', 'TXN009', '2024-11-23 12:35:00', '2024-11-23 12:30:00', '2024-11-23 12:35:00'),
(10, 10, 'BANK_TRANSFER', 'SUCCESS', 'TXN010', '2024-11-24 17:25:00', '2024-11-24 17:20:00', '2024-11-24 17:25:00');

-- Insert Referral Codes
INSERT INTO "ReferralCode" (id, user_id, code, created_at, updated_at) VALUES
(1, 'user_001', 'REF001', NOW(), NOW()),
(2, 'user_002', 'REF002', NOW(), NOW()),
(3, 'user_003', 'REF003', NOW(), NOW()),
(4, 'user_004', 'REF004', NOW(), NOW()),
(5, 'user_005', 'REF005', NOW(), NOW());

-- Insert Email Logs
INSERT INTO "EmailLog" (id, user_id, event_id, email_type, subject, status, sent_at, error_message, created_at, updated_at) VALUES
(1, 'user_001', 1, 'TICKET_CONFIRMATION', 'Xác nhận vé Ớt Cay Xè Concert', 'SENT', '2024-11-15 10:36:00', NULL, '2024-11-15 10:36:00', '2024-11-15 10:36:00'),
(2, 'user_002', 1, 'TICKET_CONFIRMATION', 'Xác nhận vé Ớt Cay Xè Concert', 'SENT', '2024-11-16 14:26:00', NULL, '2024-11-16 14:26:00', '2024-11-16 14:26:00'),
(3, 'user_003', 1, 'TICKET_CONFIRMATION', 'Xác nhận vé Ớt Cay Xè Concert', 'SENT', '2024-11-17 09:21:00', NULL, '2024-11-17 09:21:00', '2024-11-17 09:21:00'),
(4, 'user_004', 1, 'TICKET_CONFIRMATION', 'Xác nhận vé Ớt Cay Xè Concert', 'SENT', '2024-11-18 16:51:00', NULL, '2024-11-18 16:51:00', '2024-11-18 16:51:00'),
(5, 'user_005', 1, 'TICKET_CONFIRMATION', 'Xác nhận vé Ớt Cay Xè Concert', 'SENT', '2024-11-19 11:36:00', NULL, '2024-11-19 11:36:00', '2024-11-19 11:36:00');

-- Insert Webhook Subscriptions
INSERT INTO "WebhookSubscription" (id, organization_id, target_url, event_type, is_active, created_at, updated_at) VALUES
(1, 1, 'https://otcayxe.com/webhooks/order-created', 'ORDER_CREATED', true, NOW(), NOW()),
(2, 1, 'https://otcayxe.com/webhooks/payment-success', 'PAYMENT_SUCCESS', true, NOW(), NOW()),
(3, 1, 'https://otcayxe.com/webhooks/ticket-sold', 'TICKET_SOLD', true, NOW(), NOW());

-- Insert Webhook Logs
INSERT INTO "WebhookLog" (id, target_url, event_type, order_id, event_id, user_id, payload, status_code, response_text, triggered_at, created_at, updated_at) VALUES
(1, 'https://otcayxe.com/webhooks/order-created', 'ORDER_CREATED', 1, 1, 'user_001', '{"order_id": 1, "user_id": "user_001", "amount": 489000}', 200, 'OK', '2024-11-15 10:31:00', '2024-11-15 10:31:00', '2024-11-15 10:31:00'),
(2, 'https://otcayxe.com/webhooks/payment-success', 'PAYMENT_SUCCESS', 1, 1, 'user_001', '{"order_id": 1, "payment_id": 1, "amount": 489000}', 200, 'OK', '2024-11-15 10:36:00', '2024-11-15 10:36:00', '2024-11-15 10:36:00'),
(3, 'https://otcayxe.com/webhooks/ticket-sold', 'TICKET_SOLD', 1, 1, 'user_001', '{"ticket_id": 1, "quantity": 1, "order_id": 1}', 200, 'OK', '2024-11-15 10:36:00', '2024-11-15 10:36:00', '2024-11-15 10:36:00');

-- Insert Tracking Visits
INSERT INTO "TrackingVisit" (id, user_id, event_id, utm_source, utm_medium, utm_campaign, utm_content, referrer_url, landing_page, created_at, updated_at) VALUES
(1, 'user_001', 1, 'facebook', 'social', 'otcayxe_concert', 'banner_1', 'https://facebook.com', '/events/otcayxe-concert', '2024-11-10 15:30:00', '2024-11-10 15:30:00'),
(2, 'user_002', 1, 'google', 'search', 'otcayxe_concert', 'organic', 'https://google.com', '/events/otcayxe-concert', '2024-11-11 10:20:00', '2024-11-11 10:20:00'),
(3, 'user_003', 1, 'instagram', 'social', 'otcayxe_concert', 'story_1', 'https://instagram.com', '/events/otcayxe-concert', '2024-11-12 14:15:00', '2024-11-12 14:15:00'),
(4, 'user_004', 1, 'facebook', 'social', 'otcayxe_concert', 'banner_2', 'https://facebook.com', '/events/otcayxe-concert', '2024-11-13 09:45:00', '2024-11-13 09:45:00'),
(5, 'user_005', 1, 'google', 'search', 'otcayxe_concert', 'organic', 'https://google.com', '/events/otcayxe-concert', '2024-11-14 16:30:00', '2024-11-14 16:30:00');

-- Insert Event Settings
INSERT INTO "EventSetting" (id, event_id, setting_key, setting_value, created_at, updated_at) VALUES
(1, 1, 'checkin_enabled', 'true', NOW(), NOW()),
(2, 1, 'max_tickets_per_user', '5', NOW(), NOW()),
(3, 1, 'allow_refunds', 'true', NOW(), NOW()),
(4, 1, 'auto_send_tickets', 'true', NOW(), NOW()),
(5, 1, 'require_phone_verification', 'false', NOW(), NOW());

-- Insert Images
INSERT INTO "Image" (id, file_path, file_name, file_type, file_size, alt_text, uploaded_by, created_at, updated_at) VALUES
(1, '/uploads/events/otcayxe-concert-banner.jpg', 'otcayxe-concert-banner.jpg', 'image/jpeg', 2048576, 'Ớt Cay Xè Concert Banner', 'admin_001', NOW(), NOW()),
(2, '/uploads/events/otcayxe-concert-poster.jpg', 'otcayxe-concert-poster.jpg', 'image/jpeg', 1536000, 'Ớt Cay Xè Concert Poster', 'admin_001', NOW(), NOW()),
(3, '/uploads/organizations/otcayxe-logo.png', 'otcayxe-logo.png', 'image/png', 512000, 'Ớt Cay Xè Entertainment Logo', 'admin_001', NOW(), NOW());

-- Insert Image Links
INSERT INTO "ImageLink" (id, image_id, entity_type, entity_id, organization_id, event_id, usage_type, linked_at, created_at, updated_at) VALUES
(1, 1, 'event', 1, 1, 1, 'banner', NOW(), NOW(), NOW()),
(2, 2, 'event', 1, 1, 1, 'poster', NOW(), NOW(), NOW()),
(3, 3, 'organization', 1, 1, NULL, 'logo', NOW(), NOW(), NOW());

-- Update ticket sold count based on completed orders
UPDATE "Ticket" SET sold = 9 WHERE id = 1;

-- Insert some checkin logs for completed orders
INSERT INTO "CheckinLog" (id, user_id, ticket_id, event_id, checkin_time, verified_by, created_at, updated_at) VALUES
(1, 'user_001', 1, 1, '2024-12-25 18:30:00', 'admin_001', NOW(), NOW()),
(2, 'user_002', 1, 1, '2024-12-25 18:35:00', 'admin_001', NOW(), NOW()),
(3, 'user_003', 1, 1, '2024-12-25 18:40:00', 'admin_001', NOW(), NOW()),
(4, 'user_004', 1, 1, '2024-12-25 18:45:00', 'admin_001', NOW(), NOW()),
(5, 'user_005', 1, 1, '2024-12-25 18:50:00', 'admin_001', NOW(), NOW());

-- Insert Order Promos (some orders used promo codes)
INSERT INTO "OrderPromo" (id, order_id, promo_code_id, discount_applied, created_at, updated_at) VALUES
(1, 1, 1, 48900, '2024-11-15 10:30:00', '2024-11-15 10:30:00'),
(2, 3, 2, 73350, '2024-11-17 09:15:00', '2024-11-17 09:15:00'),
(3, 5, 3, 50000, '2024-11-19 11:30:00', '2024-11-19 11:30:00');

-- Update order amounts for orders with promos
UPDATE "Order" SET amount = 440100 WHERE id = 1;
UPDATE "Order" SET amount = 415650 WHERE id = 3;
UPDATE "Order" SET amount = 439000 WHERE id = 5; 