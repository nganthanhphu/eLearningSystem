# ADR 005: Lựa chọn RabbitMQ cho Message Queue
## Trạng thái
Accepted
## Bối cảnh
Trong quá trình vận hành hệ thống học trực tuyến thì API server (Django) phải gánh chịu nhiều nghiệp vụ đòi hỏi thời gian xử lý lâu hoặc ngốn nhiều tài nguyên như việc gửi tin nhắn cùng lúc cho hàng loạt sinh viên hay cấp chứng chỉ hoàn thành khóa học dưới dạng file pdf cho sinh viên.
## Quyết định
Sử dụng Rabbit MQ để chuyển các tác vụ nặng sang cơ chế xử lý bất đồng bộ
## Lý do:
+ Đảm bảo không mất dữ liệu không bị mất khi truyền những tin nhắn quan trọng
+ Giúp giảm bớt một phần gánh nặng cho API Server
+ Có thể kết hợp với Celery khi làm việc trên Python (Django)
## Hệ quả:
1. Tích cực: 
+ Tăng trải nghiệm người dùng, giúp người dùng nhận được phản hồi từ web mà không phải chờ đợi liên tục
+ Tách biệt các background tasks để xử lý riêng
2. Tiêu cực:
+ Làm phức tạp hóa hạ tầng vì phải thêm một dịch vụ mới vô hệ thống
## Ngày quyết định
2026-03-10
