# ADR 007: Lựa chọn Nginx làm Reverse Proxy và Web Server

## Trạng thái

Đã chấp nhận

## Ngày quyết định

2026-04-20

## Bối cảnh

Hệ thống E-Learning được xây dựng với frontend và backend. Frontend không thể tự phục vụ static file hiệu quả, và backend cần một cách để quản lý routing và bảo mật, nên cần một reverse proxy đứng giữa để xử lý các yêu cầu từ client. Ngoài ra, hệ thống cũng cần một web server để tiếp nhận request từ domain và ánh xạ các URL path tới các tài nguyên tương ứng hoặc chuyển tiếp đến backend service.

## Các yếu tố quyết định

- Hiệu năng cao khi xử lý nhiều request
- Hỗ trợ chạy trên môi trường production
- Dễ cấu hình và quản lý routing
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

### Lựa chọn 3: Không dùng Reverse Proxy gọi trực tiếp vào Backend và sử dụng backend làm web server, frontend phục vụ bằng thư viện như serve

**Ưu điểm**:

- Kiến trúc đơn giản
- Dễ triển khai
- Không cần cấu hình thêm web server riêng

**Nhược điểm**:

- Backend phải xử lý tất cả request
- Khó scale và quản lý routing
- Kém bảo mật
- Hiệu năng phục vụ static file kém so với web server chuyên dụng, không phù hợp production.

## Quyết định

Chọn Nginx làm reverse proxy và đồng thời là web server cho hệ thống.

## Lý do

- Tăng hiệu năng khi xử lý request
- Phục vụ static file cho frontend và trang admin của Django
- Có thể xử lý tải bằng load balancing trong tuơng lai

## Hệ quả

### Tích cực

- Hệ thống phản hồi nhanh hơn
- Phù hợp với môi trường production
- Dễ mở rộng khi hệ thống lớn
- Bảo mật tốt hơn

### Tiêu cực

- Tăng độ phức tạp hệ thống
- Cần cấu hình và bảo trì Nginx
- Cần hiểu rõ cách mapping URL và cấu hình routing
