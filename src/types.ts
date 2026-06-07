/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Định nghĩa các màn hình trong ứng dụng
export type AppScreen = 'INTRO' | 'FORM' | 'GAME' | 'RESULT' | 'LEADERBOARD' | 'STATS';

// Thông tin người chơi thu thập từ Form
export interface PlayerInfo {
  hoTen: string;
  soDienThoai: string;
  email: string;
  donVi: string;
  vaiTro?: string;
}

// Cấu trúc một từ cần tìm trong game
export interface TargetWord {
  id: string;
  text: string;     // Từ viết liền không dấu cách, viết hoa (ví dụ: POSTATREE)
  label: string;    // Nhãn hiển thị có thể có dấu cách (ví dụ: POST A TREE)
  found: boolean;   // Đã tìm thấy hay chưa
  startCoord?: [number, number]; // Tọa độ bắt đầu [row, col]
  endCoord?: [number, number];   // Tọa độ kết thúc [row, col]
}

// Cấu trúc một ô trong lưới chữ cái
export interface GridCell {
  row: number;
  col: number;
  char: string;
  isFound: boolean;        // Thuộc về từ nào đó đã tìm thấy
  foundWordIds: string[];  // Danh sách ID từ tìm thấy chứa ô này
}

// Kết quả lượt chơi để lưu lên Google Sheets
export interface PlayRecord {
  hoTen: string;
  soDienThoai: string;
  email: string;
  donVi: string;
  vaiTro?: string;
  diem: number;
  soTuTimDuoc: number;
  hoanThanh: boolean;
  thoiGianConLai: number;
  thoiGianChoi: string; // ISO string
}

// Dữ liệu lấy về từ Google Sheet cho Bảng xếp hạng
export interface LeaderboardItem {
  timestamp: string;
  hoTen: string;
  soDienThoai: string;
  email: string;
  donVi: string;
  vaiTro?: string;
  diem: number;
  soTuTimDuoc: number;
  hoanThanh: boolean;
  thoiGianConLai: number;
}

// Thống kê theo Đơn vị trường học
export interface SchoolStats {
  donVi: string;
  tongDiem: number;
  tongDongGop: number; // Số lượt hoàn thành đủ 4 từ
  soLuongNguoiChoi: number;
}
