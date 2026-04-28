# ADR-001: Lựa chọn kiến trúc Layered

## Trạng thái

Đã chấp nhận

## Ngày quyết định

10-03-2026

## Bối cảnh

Chúng tôi cần lựa chọn kiến trúc phù hợp cho hệ thống có yêu cầu hiệu suất không cao và số lượng người dùng đồng thời ở mức vừa phải. Hệ thống không quá phức tạp về mặt nghiệp vụ, chủ yếu tập trung vào luồng xử lý dữ liệu ổn định. Đồng thời, dự án cần ưu tiên tốc độ phát triển và sự đơn giản trong vận hành để tối ưu hóa nguồn lực của team nhỏ.

## Các yếu tố quyết định

- Tốc độ triển khai nhanh
- Dễ dàng phân công công việc cho team nhỏ và không có nhiều kinh nghiệm với các kiến trúc phức tạp
- Đơn giản, không quá phức tạp về mặt kiến trúc
- Hiệu suất đủ đáp ứng nhu cầu của hệ thống

## Các lựa chọn đã xem xét

### Lựa chọn 1: Microservices Architecture

**Mô tả**: Chia nhỏ nền tảng E-Learning thành các dịch vụ hoàn toàn độc lập giao tiếp với nhau qua API hoặc Message Broker.

**Ưu điểm**:

- Khả năng mở rộng linh hoạt theo chiều ngang
- Hiệu suất tốt khi xử lý số lượng người dùng đồng thời lớn
- Độ tin cậy cao, nếu một dịch vụ gặp sự cố không ảnh hưởng đến toàn bộ hệ thống

**Nhược điểm**:

- Độ phức tạp cao
- Thời gian và chi phí phát triển lớn, không phù hợp với đội ngũ nhỏ
- Tính nhất quán và toàn vẹn dữ liệu khó đảm bảo nếu không được thiết kế cẩn thận
- Khó khăn trong việc kiểm thử và gỡ lỗi

### Lựa chọn 2: Layered Architecture

**Mô tả**: Chia hệ thống thành các lớp riêng biệt như Presentation Layer, Business Logic Layer, Data Access Layer và Database Layer, mỗi lớp có trách nhiệm rõ ràng và giao tiếp với nhau.

**Ưu điểm**:

- Các lớp tách biệt trách nhiệm rõ ràng, dễ dàng phân công công việc theo từng lớp
- Dễ triển khai, kiểm thử và bảo trì
- Các lớp có khả năng tái sử dụng cao
- Tốc độ phát triển nhanh, đáp ứng yêu cầu về thời gian của dự án
- Độ phức tạp thấp, dễ tiếp cận

**Nhược điểm**:

- Hiệu năng bị ảnh hưởng do mỗi request phải đi qua nhiều lớp
- Khó mở rộng linh hoạt theo chiều ngang
- Nếu xảy ra lỗi ở một lớp, có thể ảnh hưởng đến toàn bộ hệ thống

## Quyết định

Chúng tôi chọn **Layered Architecture**

## Lý do

- Phù hợp với quy mô và yêu cầu của dự án hiện tại
- Đơn giản, dễ hiểu, phù hợp với đội ngũ phát triển nhỏ và ít kinh nghiệm
- Tốc độ phát triển nhanh, đáp ứng yêu cầu về thời gian của dự án

## Hệ quả

### Tích cực

- Kiến trúc đơn giản, dễ hiểu, phù hợp với team nhỏ và yêu cầu về tốc độ phát triển nhanh
- Dễ dàng phân công công việc theo từng lớp
- Dễ triển khai, kiểm thử và bảo trì
- Hiệu năng đáp ứng đủ nhu cầu hiện tại của hệ thống

### Tiêu cực

- Khó mở rộng linh hoạt theo chiều ngang khi hệ thống phát triển lớn hơn
- Hiệu năng có thể bị ảnh hưởng nếu số lượng người dùng đồng thời tăng lên đột ngột
