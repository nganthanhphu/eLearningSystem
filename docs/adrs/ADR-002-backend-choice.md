# ADR 002: Lựa chọn Django cho Backend

## Trạng thái

Đã chấp nhận

## Ngày quyết định

2026-03-10

## Bối cảnh

Hệ thống học trực tuyến cần một backend đáp ứng các chức năng như quản lý khóa học, bài học; đăng ký khóa học,... Backend cần xử lý dữ liệu ổn định, đảm bảo tính nhất quán, phát triển nhanh phù hợp quy mô đội ngũ hiện tại

## Các yếu tố quyết định

- Tốc độ phát triển và triển khai
- Khả năng bảo trì, mở rộng, sửa lỗi
- Hệ sinh thái và cộng đồng
- Tính bảo mật
- Quy mô đội ngũ hiện tại

## Các lựa chọn đã xem xét

### Lựa chọn 1: Django

**Ưu điểm**:

- Có sẵn ORM, authentication, giảm thời gian phát triển các chức năng cơ bản
- Dễ bảo trì và mở rộng do có kiến trúc rõ ràng
- Cộng đồng lớn, tài liệu phong phú
- Bảo mật tốt: Built-in chống CSRF, XSS, SQL Injection
- Phù hợp với team nhỏ ở giai đoạn ban đầu

**Nhược điểm**:

- Ít linh hoạt so với Flask
- Có thể bị quá tải khi hệ thống phức tạp dần nếu team nhỏ

### Lựa chọn 2: Flask

**Ưu điểm**:

- Nhẹ, setup nhanh ban đầu
- Tính linh hoạt cao

**Nhược điểm**:

- Phải tự xây dựng nhiều thành phần
- Không có cấu trúc chuẩn dễ dẫn đến code thiếu tổ chức khi hệ thống lớn, khó bảo trì sau này

### Lựa chọn 3: Spring Boot

**Ưu điểm**:

- Kiến trúc rất chặt chẽ, phù hợp hệ thống lớn
- Dễ mở rộng theo hướng doanh nghiệp
- Hệ sinh thái và cộng đồng lớn mạnh
- Đáp ứng yêu cầu bảo mật cao

**Nhược điểm**:

- Setup ban đầu phức tạp, nhiều cấu hình
- Thời gian phát triển chậm hơn so với Django hoặc Flask
- Quá trình debug phức tạp
- Phức tạp, không phù hợp với team nhỏ ở giai đoạn ban đầu

## Quyết định

Sử dụng Django cho Backend

## Lý do

- Phù hợp với quy mô team hiện tại
- Tốc độ phát triển và triển khai nhanh
- Khả năng bảo trì và mở rộng tính năng tốt
- Hệ sinh thái mạnh và cộng đồng lớn
- Tính bảo mật cao

## Hệ quả

### Tích cực

- Tăng tốc độ phát triển hệ thống, nhanh chóng triển khai, giảm khối lượng code phải xây dựng từ đầu
- Hệ thống ổn định, đảm bảo tính nhất quán dữ liệu
- Dễ bảo trì, sửa lỗi và mở rộng khi thêm chức năng mới
- Phù hợp với năng lực và quy mô team hiện tại
- Tài liệu và hỗ trợ cồng động lớn

### Tiêu cực

- Khó mở rộng theo chiều ngang
- Thời gian học và làm quen ban đầu với Django có thể dài hơn so với Flask
