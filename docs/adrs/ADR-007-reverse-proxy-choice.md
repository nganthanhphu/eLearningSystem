# ADR 005: Lựa chọn Nginx làm Reverse Proxy

## Trạng thái

Đã chấp nhận

## Ngày quyết định

2026-04-20

## Bối cảnh

Hệ thống E-Learning được xây dựng với frontend và backend. Frontend không thể tự phục vụ static file hiệu quả, và backend cần một cách để quản lý routing và bảo mật, nên cần một reverse proxy đứng giữa để xử lý các yêu cầu từ client.

## Các yếu tố quyết định

- Hiệu năng cao khi xử lý nhiều request
- Hỗ trợ deploy lên môi trường production
- Dễ dùng với Docker

## Các lựa chọn đã xem xét

### Lựa chọn 1: Nginx

**Ưu điểm**:

- Hiệu năng cao, xử lý nhiều request tốt
- Điều hướng request dễ dàng
- Phục vụ static file nhanh
- Hỗ trợ load balancing khi scale

**Nhược điểm**:

- Cấu hình phức tạp
- Ít linh hoạt hơn Apache trong một số trường hợp

### Lựa chọn 2: Apache HTTP Server

**Ưu điểm**:

- Linh hoạt, nhiều module
- Phổ biến và dễ tìm tài liệu

**Nhược điểm**:

- Hiệu năng thấp hơn Nginx trong xử lý concurrent request
- Không tối ưu cho reverse proxy hiện đại

### Lựa chọn 3: Không dùng Reverse Proxy gọi trực tiếp vào Backend

**Ưu điểm**:

- Kiến trúc đơn giản
- Dễ triển khai

**Nhược điểm**:

- Backend phải xử lý tất cả request
- Không tối ưu static file
- Khó scale và quản lý routing
- Kém bảo mật

## Quyết định

Chọn Nginx làm reverse proxy cho hệ thống.

## Lý do

- Tăng hiệu năng khi xử lý request
- Phục vụ static file cho frontend và trang admin của Django
- Có thể xử lý tải bằng load balancing trong tuơng lai

## Hệ quả

### Tích cực

- Hệ thống phản hồi nhanh hơn
- Dễ mở rộng khi hệ thống lớn
- Bảo mật tốt hơn

### Tiêu cực

- Tăng độ phức tạp hệ thống
- Cần cấu hình và bảo trì Nginx
