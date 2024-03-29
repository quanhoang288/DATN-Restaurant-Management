const successMessages = {
  REGISTER_SUCCESSFUL: "Đăng ký tài khoản thành công",
};

const errorMessages = {
  EMAIL_REQUIRED: "Email là bắt buộc",
  NAME_REQUIRED: "Tên là bắt buộc",
  PHONE_NUMBER_REQUIRED: "Số điện thoại là bắt buộc",
  PASSWORD_REQUIRED: "Mật khẩu là bắt buộc",
  CONFIRM_PASSWORD_REQUIRED: "Xác nhận mật khẩu là bắt buộc",
  CONFIRM_PASSWORD_NOT_MATCH: "Xác nhận mật khẩu không trùng khớp",
  PASSWORD_LENGTH_INVALID:
    "Mật khẩu phải chứa ít nhất 6 ký tự và không vượt quá 255 ký tự",
  USERNAME_ALREADY_EXIST: "Email đã được sử dụng",
  INTERNAL_SERVER_ERROR: "Đã có lỗi xảy ra từ phía server",
  INCORRECT_EMAIL_OR_PASSWORD: "Email hoặc mật khẩu không hợp lệ",
  INVALID_MIME_TYPE: "Bạn cần chọn file có định dạng MP4 hoặc WebM",
  INVALID_FILE_SIZE: "Bạn cần chọn file có kích thước không vượt quá 2GB",
  UPLOAD_VIDEO_FAILURE: "Đã có lỗi xảy ra khi đăng tải video!",
  TABLE_NOT_CHECKED_IN:
    "Bàn chưa được check-in. Vui lòng check-in thông tin trước khi gọi món",
};

export { successMessages, errorMessages };
