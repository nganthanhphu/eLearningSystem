# ADR 006: Lựa chọn Celery cho Background Worker

## Trạng thái

Đã chấp nhận

## Ngày quyết định

2026-03-10

## Bối cảnh

Hệ thống học trực tuyến cần xử lý các tác vụ mất nhiều thời gian mà không làm gián đoạn luồng chính của ứng dụng. Các tác vụ này bao gồm: Gửi email thông báo (đăng ký khóa học, tạo tài khoản, cấp chứng chỉ). Cần một công cụ quản lý hàng đợi (queue) và một background worker ổn định, chịu tải tốt.

## Các yếu tố quyết định

- Khả năng tích hợp mượt mà với Django
- Hiệu năng xử lý và khả năng mở rộng

## Các lựa chọn đã xem xét

### Lựa chọn 1: Celery

**Ưu điểm**:

- Tích hợp cực kỳ tốt với Django.
- Hiệu năng cao, khả năng phân tán và scale dễ dàng bằng cách thêm worker độc lập.
- Hỗ trợ đầy đủ các tính năng nâng cao: lập lịch (Celery Beat), retry khi lỗi, và workflows phức tạp.
- Có công cụ giám sát trực quan (ví dụ: Flower).
- Cộng đồng lớn mạnh, tài liệu vô cùng phong phú.

**Nhược điểm**:

- Thiết lập ban đầu khá phức tạp

### Lựa chọn 2: Pika

**Ưu điểm**:

- Thư viện Python thuần túy để giao tiếp với RabbitMQ, nhẹ và đơn giản.
- Cho phép xây dựng một hệ thống worker tùy chỉnh hoàn toàn theo nhu cầu.

**Nhược điểm**:

- Không cung cấp các tính năng quản lý hàng đợi, retry, hay lập lịch sẵn có như Celery, đòi hỏi phải tự xây dựng thêm nhiều logic xử lý phức tạp.
- Không có công cụ giám sát trực quan, khó khăn trong việc theo dõi và quản lý các tác vụ đang chạy.

## Quyết định

Sử dụng Celery làm Background Worker

## Lý do

- Celery kết hợp tốt với Django, cộng đồng lớn mạnh, tài liệu nhiều.
- Đáp ứng trọn vẹn cả nhu cầu xử lý bất đồng bộ lẫn các tác vụ lặp lại định kỳ thông qua Celery Beat.
- Đảm bảo tính mở rộng dài hạn: Có thể chia tách server chạy Web API và server chạy Worker riêng biệt.

## Hệ quả

### Tích cực

- Có thể tăng cường hiệu năng xử lý dễ dàng bằng cách thêm các container Worker khi lượng học viên tăng vọt.
- Có công cụ giám sát trực quan giúp theo dõi trạng thái các tác vụ, dễ dàng debug và tối ưu hóa hiệu năng.

### Tiêu cực

- Tăng độ phức tạp của hạ tầng
- Cần học thêm về Celery và cách cấu hình để tận dụng tối đa các tính năng của nó.
