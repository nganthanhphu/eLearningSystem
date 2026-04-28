# ADR-004: Sử dụng MySQL làm cơ sở dữ liệu chính

## Trạng thái

Đã chấp nhận

## Ngày

2026-03-10

## Bối cảnh

Chúng tôi cần chọn một cơ sở dữ liệu chính cho hệ thống học trực tuyến dễ sử dụng, có hiệu suất tốt và phù hợp với kinh nghiệm của đội ngũ phát triển nhỏ, hỗ trợ truy vấn các bảng có mối quan hệ không quá phức tạp và đảm bảo tính nhất quán của dữ liệu ở mức độ vừa phải.

## Các yếu tố quyết định

- Quen thuộc với đội ngũ phát triển
- Đảm bảo tính nhất quán của dữ liệu
- Hiệu suất đủ đáp ứng nhu cầu của hệ thống
- Dễ dàng triển khai và quản lý

## Các lựa chọn đã xem xét

### Lựa chọn 1: PostgreSQL

**Mô tả**: PostgreSQL là một hệ quản trị cơ sở dữ liệu quan hệ mã nguồn mở, hỗ trợ ACID và có khả năng mở rộng tốt.

**Ưu điểm**:

- Đảm bảo ACID cao
- Hỗ trợ JSON cho các thuộc tính linh hoạt
- Mã nguồn mở, có cộng đồng hỗ trợ lớn
- Hiệu suất tốt cho các truy vấn phức tạp
- Nhiều tính năng nâng cao

**Nhược điểm**:

- Cấu hình phức tạp khi mở rộng theo chiều ngang nếu hệ thống phát triển lớn hơn
- Cần có kiến thức chuyên sâu để tối ưu hóa hiệu suất trong các trường hợp phức tạp
- Có thể quá mức cần thiết cho các yêu cầu đơn giản của hệ thống hiện tại

### Lựa chọn 2: MySQL

**Mô tả**: MySQL là một hệ quản trị cơ sở dữ liệu quan hệ phổ biến, dễ sử dụng và được hỗ trợ rộng rãi.

**Ưu điểm**:

- Phổ biến, được hỗ trợ tốt và dễ dàng tìm kiếm tài liệu
- Quen thuộc với nhiều nhà phát triển
- Hiệu suất tốt cho các truy vấn không quá phức tạp
- Dễ dàng triển khai và quản lý

**Nhược điểm**:

- Hỗ trợ JSON không tốt bằng PostgreSQL
- Ít tính năng hơn so với các hệ quản trị cơ sở dữ liệu quan hệ khác

### Lựa chọn 3: MongoDB

**Mô tả**: MongoDB là một cơ sở dữ liệu NoSQL, sử dụng định dạng BSON để lưu trữ dữ liệu linh hoạt.

**Ưu điểm**:

- Không cần định nghĩa lược đồ trước, linh hoạt
- Dễ dàng mở rộng theo chiều ngang
- Tốc độ ghi cực nhanh

**Nhược điểm**:

- Không phù hợp cho dữ liệu quan hệ phức tạp
- Tính nhất quán cuối cùng, không đảm bảo ACID cho các giao dịch phức tạp
- Tốn dung lượng lưu trữ lớn hơn so với cơ sở dữ liệu quan hệ

## Quyết định

Chúng tôi chọn **MySQL**

## Lý do

- Đảm bảo tính nhất quán của dữ liệu
- Hiệu suất đủ đáp ứng nhu cầu của hệ thống hiện tại
- Dễ dàng triển khai và quản lý
- Đội ngũ có kinh nghiệm với MySQL

## Hệ quả

### Tích cực

- Dữ liệu được quản lý một cách nhất quán và đáng tin cậy
- Hiệu suất đáp ứng đủ nhu cầu của hệ thống hiện tại
- Tài liệu và hỗ trợ tốt từ cộng đồng MySQL

### Tiêu cực

- Hỗ trợ JSON không tốt bằng PostgreSQL, có thể hạn chế khả năng lưu trữ các thuộc tính linh hoạt trong tương lai
- Hiệu suất so với các đối thủ khác không tốt bằng
- Khó xử lý các truy vấn phức tạp nếu mở rộng trong tương lai
