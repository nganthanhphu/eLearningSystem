# ADR-004: Lựa chọn MySQL cho Database
## Trạng thái
Accepted
## Bối cảnh
Project cần một cơ sở dữ liệu dễ sử dụng và có hiệu suất tốt để lưu trữ và truy xuất dữ liệu.
## Quyết định
Sử dụng MySQL làm cơ sở dữ liệu chính.
## Lý do
1. Quen thuộc, đã có kinh nghiệm sử dụng trong các dự án trước đây
2. Độ tin cậy cao, đảm bảo tính chất ACID
3. Phổ biến, cộng đồng lớn, nhiều tài liệu hỗ trợ
## Hệ quả
1. Tích cực:
+ Dễ dàng triển khai và quản lý, hiệu suất tốt cho hầu hết các trường hợp sử dụng
+ Hiệu suất tốt đáp ứng nhu cầu của dự án
2. Tiêu cực:
+ Tính năng không nhiều như các cơ sở dữ liệu khác
+ Không phù hợp khi cần mở rộng hệ thống lớn
## Ngày quyết định
2026-03-10