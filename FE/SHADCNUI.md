1. GIỚI THIỆU
   shadcn/ui là tập hợp các component có thể tái sử dụng được xây dựng trên Radix UI và Tailwind CSS. Bạn không cài đặt nó như một thư viện thông thường mà sao chép mã nguồn vào dự án.

2. CÀI ĐẶT NHANH
   Khởi tạo dự án: npx shadcn-ui@latest init
   Thêm component: npx shadcn-ui@latest add [tên-component]

3. DANH SÁCH COMPONENT THEO NHÓM

NHÓM FORM & INPUT:

- Accordion: Nội dung đóng mở.
- Checkbox: Ô đánh dấu.
- Form: Quản lý form với React Hook Form + Zod.
- Input: Trường nhập liệu văn bản.
- Label: Nhãn cho input.
- Radio Group: Chọn một trong nhiều.
- Select: Menu thả xuống để chọn.
- Slider: Thanh trượt giá trị.
- Switch: Công tắc bật/tắt.
- Textarea: Nhập liệu văn bản dài.
- Toggle: Nút chuyển đổi trạng thái.
- Calendar: Bộ lịch chọn ngày.
- Date Picker: Chọn ngày tháng.

NHÓM ĐIỀU HƯỚNG (NAVIGATION):

- Breadcrumb: Đường dẫn phân cấp.
- Navigation Menu: Menu điều hướng chính.
- Pagination: Phân trang.
- Tabs: Chuyển đổi nội dung theo tab.
- Menubar: Thanh menu ngang.

NHÓM HIỂN THỊ (DATA DISPLAY):

- Avatar: Ảnh đại diện.
- Badge: Nhãn trạng thái.
- Card: Thẻ chứa nội dung.
- Carousel: Trình chiếu nội dung.
- Table: Bảng dữ liệu.
- Aspect Ratio: Giữ tỉ lệ khung hình.
- Collapsible: Vùng nội dung có thể thu gọn.

NHÓM THÔNG BÁO & PHẢN HỒI:

- Alert: Thông báo quan trọng.
- Alert Dialog: Hộp thoại xác nhận hành động.
- Dialog: Hộp thoại Modal.
- Drawer: Bảng trượt (thường dùng cho mobile).
- Popover: Nội dung nổi.
- Progress: Thanh tiến trình.
- Skeleton: Hiệu ứng chờ tải (Loading).
- Toast: Thông báo góc màn hình.
- Sonner: Thư viện Toast cao cấp.
- Tooltip: Chú thích khi di chuột.

NHÓM BỐ CỤC & TIỆN ÍCH:

- Scroll Area: Thanh cuộn tùy chỉnh.
- Separator: Đường kẻ phân cách.
- Sheet: Bảng trượt từ cạnh màn hình (Sidebar).
- Context Menu: Menu chuột phải.
- Dropdown Menu: Menu thả xuống.
- Resizable: Bố cục thay đổi kích thước bằng cách kéo.
- Command: Hộp lệnh tìm kiếm nhanh.

4. CẤU TRÚC THƯ MỤC

- components/ui/: Nơi chứa các component bạn đã add.
- lib/utils.ts: Chứa hàm cn() để gộp class Tailwind.

5. TÙY CHỈNH MÀU SẮC
   Mọi màu sắc được cấu hình qua CSS Variables trong file globals.css dưới dạng HSL.
   """
