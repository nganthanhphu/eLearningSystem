# ADR 006: Lựa chọn Celery cho Worker xử lý tác vụ
## Trạng thái
Accepted
## Bối cảnh
Trong hệ thống E-Learning, một số chức năng như gửi email đăng ký khóa học, cấp chứng chỉ, cập nhật tiến độ học tập có thể mất nhiều thời gian xử lý. Nếu xử lý trực tiếp trong API của Django sẽ làm chậm phản hồi của hệ thống
## Quyết định
Sử dụng Celery làm Worker để xử lý các tác vụ bất đồng bộ.
## Lý do
1. Tích hợp tốt với Django/Python.
2. Giúp API phản hồi nhanh hơn bằng cách xử lý task ở background.
3. Có thể mở rộng nhiều worker khi hệ thống có nhiều người dùng.
4. Hoạt động tốt với queue như RabbitMQ hoặc Redis.
## Hệ quả
1. Tích cực: 
+ Cải thiện hiệu suất hệ thống
+ Tách biệt xử lý background task
2. Tiêu cực:
+ Tăng độ phức tạp hệ thống
+ Cần triển khai thêm worker và queue
## Ngày quyết định
2026-03-10