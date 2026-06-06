/**
 * GOOGLE APPS SCRIPT - GOOGLE SHEETS INTEGRATION FOR POST-A-TREE
 * 
 * HƯỚNG DẪN THIẾT LẬP CHI TIẾT (DÀNH CHO BẠN TỰ CẤU HÌNH TRONG 5 PHÚT):
 * 
 * BƯỚC 1: Tạo một Google Sheet mới trên Google Drive của bạn.
 * BƯỚC 2: Thiết lập Tên các cột tại Dòng 1 (bắt buộc khớp đúng thứ tự hoặc tự điều chỉnh):
 *        Cột A: Thời gian chơi (Timestamp)
 *        Cột B: Họ và tên
 *        Cột C: Số điện thoại
 *        Cột D: Email
 *        Cột E: Đơn vị FPT
 *        Cột F: Điểm số
 *        Cột G: Số từ tìm được
 *        Cột H: Hoàn thành (TRUE/FALSE)
 *        Cột I: Thời gian còn lại (giây)
 * BƯỚC 3: Trên thanh menu Google Sheet, chọn Tiện ích mở rộng -> Apps Script (Extensions -> Apps Script).
 * BƯỚC 4: Xóa toàn bộ code cũ trong file Code.gs của Apps Script và dán toàn bộ đoạn code dưới đây vào.
 * BƯỚC 5: Bấm biểu tượng "Lưu" (hình đĩa mềm) hoặc tổ hợp phím Ctrl + S.
 * BƯỚC 6: Nhấp nút "Triển khai" ở góc trên bên phải -> "Triển khai mới" (Deploy -> New deployment).
 *        - Chọn kiểu triển khai: Ứng dụng web (Web app).
 *        - Mô tả: "Post-A-Tree Backend v1".
 *        - Thực thi dưới danh nghĩa: Tôi (Execute as: Me - email của bạn).
 *        - Ai có quyền truy cập: Bất kỳ ai (Who has access: Anyone).
 *        *LƯU Ý QUAN TRẠNG:* Phải chọn "Anyone" thì website React mới có thể gửi dữ liệu lên được.
 * BƯỚC 7: Nhấp nút "Triển khai" (Deploy). Nếu được hỏi, chọn "Cấp quyền truy cập" (Authorize access), đăng nhập tài khoản Google của bạn và bấm "Nâng cao" (Advanced) -> "Đi tới Dự án không tên (Không an toàn)" (Go to Untitled project (unsafe)) để đồng ý xác thực.
 * BƯỚC 8: Copy URL ứng dụng web được hiển thị ở bước cuối cùng (có đuôi /exec).
 * BƯỚC 9: Dán URL đó vào hằng số APPS_SCRIPT_URL trong file `src/App.tsx` hoặc cấu hình tương ứng trong Web App.
 */

// Hàm xử lý khi Web App nhận yêu cầu POST (để lưu dữ liệu chơi game)
function doPost(e) {
  try {
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);
    
    // Mở bảng tính hiện tại
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Thêm một dòng mới chứa đầy đủ thông tin nhận được
    sheet.appendRow([
      data.thoiGianChoi || new Date().toISOString(), // Thời gian ghi nhận
      data.hoTen,                                    // Họ tên
      "'" + data.soDienThoai,                        // Thêm dấu nháy đơn ' ở đầu SĐT để tránh bị Google Sheet biến đổi thành số mất số 0
      data.email,                                    // Email
      data.donVi,                                    // Đơn vị FPT hoặc tự nhập
      data.diem,                                     // Điểm số
      data.soTuTimDuoc,                              // Số từ tìm được
      data.hoanThanh,                                // Đã hoàn thành (true/false)
      data.thoiGianConLai                            // Số giây còn lại
    ]);
    
    // Tạo phản hồi trả về thành công dạng JSON CORS-friendly
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "ok", 
      message: "Lưu dữ liệu chơi game thành công!" 
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
    
  } catch (error) {
    // Trả về lỗi nếu xảy ra sự cố
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: error.toString() 
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
  }
}

// Hàm xử lý khi Web App nhận yêu cầu GET (để lấy dữ liệu hiện thị lên Bảng xếp hạng)
function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rows = sheet.getDataRange().getValues();
    
    var dataList = [];
    
    // Duyệt qua toàn bộ các dòng trừ dòng đầu tiên là tiêu đề (Header)
    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      if (row[1]) { // Kiểm tra nếu có Họ tên thì mới add
        dataList.push({
          timestamp: row[0],
          hoTen: row[1],
          soDienThoai: row[2] ? row[2].toString().replace(/^'/, '') : '', // Loại bỏ dấu nháy đơn bảo vệ định dạng SĐT
          email: row[3],
          donVi: row[4],
          diem: parseInt(row[5]) || 0,
          soTuTimDuoc: parseInt(row[6]) || 0,
          hoanThanh: row[7] === true || row[7] === "TRUE",
          thoiGianConLai: parseInt(row[8]) || 0
        });
      }
    }
    
    // Trả về danh sách dữ liệu dạng JSON
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "ok", 
      data: dataList 
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: error.toString() 
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
  }
}

// Xử lý tiền gửi OPTIONS cho CORS preflight requests
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}
