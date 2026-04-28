# ADR 005: Lựa chọn RabbitMQ làm Message Queue

## Trạng thái

Đã chấp nhận

## Ngày quyết định

2026-03-10

## Bối cảnh

Hệ thống E-Learning có tác vụ bất đồng bộ không cần xử lý ngay lập tức. Nếu thực hiện trực tiếp trong quá trình xử lý request của Django, người dùng sẽ phải chờ lâu, dễ xảy ra timeout và hệ thống khó mở rộng khi lượng truy cập tăng. Cần tách chúng ra khỏi luồng chính và xử lý ở phía sau bằng một cơ chế như Message Queue để đảm bảo hiệu năng và khả năng mở rộng.

## Các yếu tố quyết định

- Độ tin cậy (Reliability): đảm bảo message không bị mất kể cả khi hệ thống gặp lỗi
- Khả năng retry: khi xử lý task thất bại, hệ thống có thể tự động thử lại mà không cần can thiệp thủ công
- Hiệu năng: xử lý được nhiều tác vụ cùng lúc mà không làm chậm hệ thống chính

## Các lựa chọn đã xem xét

### Lựa chọn 1: RabbitMQ

**Ưu điểm**:

- Đảm bảo message không mất
- Hỗ trợ routing phức tạp

**Nhược điểm**:

- Setup và cấu hình phức tạp hơn Redis
- Tiêu tốn tài nguyên nhiều hơn
- Cần hiểu rõ cơ chế queue để vận hành tốt

### Lựa chọn 2: Redis

**Ưu điểm**:

- Setup nhanh, dễ triển khai
- Hiệu năng cao do chạy trên RAM
- Phù hợp cho hệ thống đơn giản, không cần routing phức tạp

**Nhược điểm**:

- Độ bền message thấp hơn (có thể mất khi crash nếu config không chuẩn)
- Không hỗ trợ routing phức tạp
- Không phù hợp cho workflow queue phức tạp

### Lựa chọn 3: Kafka

**Ưu điểm**:

- Scale cực lớn, phù hợp hệ thống phân tán
- Xử lý được rất nhiều dữ liệu cùng lúc
- Có thể lưu lại dữ liệu trong thời gian dài để dùng lại sau

**Nhược điểm**:

- Kiến trúc phức tạp, khó triển khai
- Không phù hợp cho task queue đơn giản
- Dùng cho hệ thống nhỏ là quá dư thừa

## Quyết định

Chọn RabbitMQ

## Lý do

- Phù hợp nhất với công nghệ backend Django đang sử dụng
- Đảm bảo độ tin cậy message cao, có cơ chế retry khi lỗi
- Đáp ứng tốt nhu cầu hiện tại và vẫn có thể mở rộng khi hệ thống lớn hơn

## Hệ quả

### Tích cực

- Backend Django nhẹ hơn vì không phải xử lý tác vụ nặng
- Hệ thống phản hồi nhanh hơn, user không phải chờ
- Tránh timeout khi xử lý tác vụ nặng

### Tiêu cực

- Hệ thống phức tạp hơn
- Khó debug hơn vì task chạy phía sau, không nằm trong request
