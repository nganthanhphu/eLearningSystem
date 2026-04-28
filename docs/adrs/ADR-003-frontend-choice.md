# ADR 003: Lựa chọn ReactJs cho Frontend

## Trạng thái

Đã chấp nhận

## Ngày quyết định

2026-03-10

## Bối cảnh

Hệ thống học trực tuyến yêu cầu giao diện người dùng đơn giản, thân thiện, dễ sử dụng cho cả học sinh và giáo viên, hiệu năng tốt

## Các yếu tố quyết định

- Hiệu năng khi xử lý giao diện động
- Khả năng tái sử dụng và tổ chức code
- Hệ sinh thái và cộng đồng hỗ trợ
- Khả năng bảo trì, mở rộng, sửa lỗi
- Quy mô đội ngũ hiện tại

## Các lựa chọn đã xem xét

### Lựa chọn 1: ReactJS

**Ưu điểm**:

- Tối ưu bằng Virtual DOM, chỉ render phần thay đổi
- Kiến trúc component giúp tái sử dụng giao diện
- Hệ sinh thái, cộng đồng lớn
- Linh hoạt mở rộng

**Nhược điểm**:

- Re-render không kiểm soát nếu không tối ưu, đòi hỏi developer có kinh nghiệm
- Cần kết hợp thêm thư viện khác để hoàn chỉnh hệ thống lớn

### Lựa chọn 2: Angular

**Ưu điểm**:

- Change detection tự động giúp đồng bộ UI với dữ liệu, giảm công sức xử lý thủ công
- Kiến trúc rõ ràng, quy chuẩn có sẵn , tái sử dụng tốt
- Đầy đủ công cụ built-in, ít phụ thuộc thư viện ngoài
- Dễ bảo trì nhờ cấu trúc chặt chẽ, TypeScript giúp giảm lỗi

**Nhược điểm**:

- Hiệu năng xử lý giao diện động
- Ít linh hoạt tùy biến hơn so với ReactJs
- Không phù hợp với team nhỏ
- Việc debug phức tạp hơn ReactJS

### Lựa chọn 3: VueJs

**Ưu điểm**:

- Cập nhật UI tự động khi state thay đổi-> Hiệu năng tốt với UI vừa
- Kiến trúc component giúp tái sử dụng giao diện
- Dễ debug, maintain ban đầu
- Phù hợp với team nhỏ– trung bình
- Linh hoạt tùy biến có kiểm soát

**Nhược điểm**:

- Cộng đồng nhỏ hơn React, ít tài nguyên và thư viện hơn trong hệ sinh thái lớn
- Khó mở rộng ở hệ thống rất lớn (so với React/Angular)
- Khó tùy biến sâu hơn so với ReactJs

## Quyết định

Chúng tôi quyết định sử dụng ReactJS cho Frontend

## Lý do

- Cân bằng tốt giữa hiệu năng và khả năng tùy biến
- Kiến trúc component hỗ trợ tái sử dụng, bảo trì và mở rộng
- Hệ sinh thái mạnh và cộng đồng lớn
- Phù hợp với quy mô team hiện tại

## Hệ quả

### Tích cực

- Trải nghiệm người dùng mượt mà, đặc biệt với các chức năng tương tác cao
- Dễ dàng mở rộng hệ thống
- Có nhiều lựa chọn công nghệ bổ trợ nhờ hệ sinh thái phong phú

### Tiêu cực

- Cần kết hợp với các thư viện khác để xây dựng hệ thống lớn hoàn chỉnh có kiến ​​trúc tốt
- Phụ thuộc vào cách tổ chức code của team: Nếu không chuẩn hóa ngay từ đầu thì dễ phát sinh technical debt
- Cần kiểm soát re-render và quản lý state để tránh ảnh hưởng hiệu năng
