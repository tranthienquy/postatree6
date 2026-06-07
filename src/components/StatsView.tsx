/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, Leaf, Target, MapPin, Sparkles } from 'lucide-react';
import { LeaderboardItem } from '../types';

interface StatsViewProps {
  appsScriptUrl: string;
  onBack: () => void;
}

export default function StatsView({ appsScriptUrl, onBack }: StatsViewProps) {
  const [items, setItems] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const loadStatsData = async () => {
    if (!appsScriptUrl || appsScriptUrl.includes('APPS_SCRIPT_URL_CHUA_CAU_HINH')) {
      setLoading(true);
      setTimeout(() => {
        const mockData: LeaderboardItem[] = [
          { timestamp: '1', hoTen: 'Nguyễn Trần Mạnh Nam', soDienThoai: '0912345678', email: 'namntm@fe.edu.vn', donVi: 'Đại học FPT Quy Nhơn', vaiTro: 'Sinh viên', diem: 236, soTuTimDuoc: 4, hoanThanh: true, thoiGianConLai: 68 },
          { timestamp: '2', hoTen: 'Phạm Minh Đức', soDienThoai: '0988887777', email: 'ducpm2@fe.edu.vn', donVi: 'Cao đẳng FPT (Polytechnic)', vaiTro: 'Sinh viên', diem: 212, soTuTimDuoc: 4, hoanThanh: true, thoiGianConLai: 56 },
          { timestamp: '3', hoTen: 'Lê Minh Hương', soDienThoai: '0977666555', email: 'huonglm3@fpt.edu.vn', donVi: 'Đại học FPT Hà Nội', vaiTro: 'Học sinh', diem: 254, soTuTimDuoc: 4, hoanThanh: true, thoiGianConLai: 77 },
          { timestamp: '4', hoTen: 'Trần Thế Sơn', soDienThoai: '0905123456', email: 'sontt5@fe.edu.vn', donVi: 'Đại học FPT Quy Nhơn', vaiTro: 'Cán bộ - Giảng viên', diem: 198, soTuTimDuoc: 4, hoanThanh: true, thoiGianConLai: 49 },
          { timestamp: '5', hoTen: 'Nguyễn Thị Hồng', soDienThoai: '0935555111', email: 'hongnt@fe.edu.vn', donVi: 'FSchool (Tiểu học / THCS / THPT FPT)', vaiTro: 'Học sinh', diem: 176, soTuTimDuoc: 4, hoanThanh: true, thoiGianConLai: 38 },
          { timestamp: '6', hoTen: 'Hoàng Xuân Bắc', soDienThoai: '0944333222', email: 'bachx4@fe.edu.vn', donVi: 'BTEC FPT', vaiTro: 'Sinh viên', diem: 125, soTuTimDuoc: 2, hoanThanh: false, thoiGianConLai: 0 },
          { timestamp: '7', hoTen: 'Nguyễn Văn Định', soDienThoai: '0977666556', email: 'dinhnv@fpt.edu.vn', donVi: 'Đại học FPT Hà Nội', vaiTro: 'Cán bộ - Giảng viên', diem: 180, soTuTimDuoc: 4, hoanThanh: true, thoiGianConLai: 40 }
        ];
        setItems(mockData);
        setLoading(false);
      }, 700);
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const response = await fetch(`/api/records?url=${encodeURIComponent(appsScriptUrl)}&_cb=${Date.now()}`);
      if (!response.ok) {
        throw new Error(`Mã phản hồi lỗi: ${response.status}`);
      }
      const resJson = await response.json();
      if (resJson && resJson.status === 'ok') {
        const raw = resJson.data || [];
        setItems(raw.map((item: any) => ({
          timestamp: item.timestamp || item.thoiGianChoi || new Date().toISOString(),
          hoTen: item.hoTen || item.ho_ten || '',
          soDienThoai: item.soDienThoai || item.so_dien_thoai || '',
          email: item.email || '',
          donVi: item.donVi || item.don_vi || '',
          vaiTro: item.vaiTro || item.vai_tro || '',
          diem: Number(item.diem) || 0,
          soTuTimDuoc: Number(item.soTuTimDuoc) || Number(item.so_tu_tim_duoc) || 0,
          hoanThanh: item.hoanThanh === true || String(item.hoanThanh).toLowerCase() === 'true',
          thoiGianConLai: Number(item.thoiGianConLai) || Number(item.thoi_gian_con_lai) || 0,
        })));
      } else {
        throw new Error(resJson.message || 'Dữ liệu trả về lỗi.');
      }
    } catch (err: any) {
      console.error(err);
      const savedMock = localStorage.getItem('post_a_tree_mock_records');
      if (savedMock) {
        setItems(JSON.parse(savedMock));
      } else {
        setItems([
          { timestamp: '1', hoTen: 'Nguyễn Trần Mạnh Nam', soDienThoai: '0912345678', email: 'namntm@fe.edu.vn', donVi: 'Đại học FPT Quy Nhơn', vaiTro: 'Sinh viên', diem: 236, soTuTimDuoc: 4, hoanThanh: true, thoiGianConLai: 68 },
          { timestamp: '2', hoTen: 'Phạm Minh Đức', soDienThoai: '0988887777', email: 'ducpm2@fe.edu.vn', donVi: 'Cao đẳng FPT (Polytechnic)', vaiTro: 'Sinh viên', diem: 212, soTuTimDuoc: 4, hoanThanh: true, thoiGianConLai: 56 },
          { timestamp: '3', hoTen: 'Lê Minh Hương', soDienThoai: '0977666555', email: 'huonglm3@fpt.edu.vn', donVi: 'Đại học FPT Hà Nội', vaiTro: 'Học sinh', diem: 254, soTuTimDuoc: 4, hoanThanh: true, thoiGianConLai: 77 },
          { timestamp: '4', hoTen: 'Trần Thế Sơn', soDienThoai: '0905123456', email: 'sontt5@fe.edu.vn', donVi: 'Đại học FPT Quy Nhơn', vaiTro: 'Cán bộ - Giảng viên', diem: 198, soTuTimDuoc: 4, hoanThanh: true, thoiGianConLai: 49 },
          { timestamp: '5', hoTen: 'Nguyễn Thị Hồng', soDienThoai: '0935555111', email: 'hongnt@fe.edu.vn', donVi: 'FSchool (Tiểu học / THCS / THPT FPT)', vaiTro: 'Học sinh', diem: 176, soTuTimDuoc: 4, hoanThanh: true, thoiGianConLai: 38 },
          { timestamp: '6', hoTen: 'Hoàng Xuân Bắc', soDienThoai: '0944333222', email: 'bachx4@fe.edu.vn', donVi: 'BTEC FPT', vaiTro: 'Sinh viên', diem: 125, soTuTimDuoc: 2, hoanThanh: false, thoiGianConLai: 0 },
          { timestamp: '7', hoTen: 'Nguyễn Văn Định', soDienThoai: '0977666556', email: 'dinhnv@fpt.edu.vn', donVi: 'Đại học FPT Hà Nội', vaiTro: 'Cán bộ - Giảng viên', diem: 180, soTuTimDuoc: 4, hoanThanh: true, thoiGianConLai: 40 }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatsData();
  }, [appsScriptUrl]);

  // Tính các thông số phục vụ quy chế gieo mầm đã bình ổn
  const userCompletedPlays: { [key: string]: number } = {};
  items.forEach(item => {
    if (item.hoanThanh) {
      const userKey = item.email ? item.email.trim().toLowerCase() : item.hoTen.trim().toLowerCase();
      userCompletedPlays[userKey] = (userCompletedPlays[userKey] || 0) + 1;
    }
  });

  const totalCappedPlays = Object.values(userCompletedPlays).reduce(
    (sum, count) => sum + Math.min(count, 3), 0
  );

  const Y_totalTrees = Math.floor(totalCappedPlays / 3);
  const KPI_TargetTrees = 220;
  const remainingTrees = Math.max(0, KPI_TargetTrees - Y_totalTrees);
  const progressPercent = Math.min(100, (Y_totalTrees / KPI_TargetTrees) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="w-full flex-1 flex flex-col font-pixel relative h-full min-h-0 justify-between gap-3 text-[#3e2723]"
      id="stats-view-container"
    >
      {/* Khối chính hiển thị Thống kê phủ xanh */}
      <div 
        className="flex-1 bg-[#f4e7c9] border-[4px] border-[#3e2723] p-4 sm:p-5 shadow-[4px_4px_0px_0px_rgba(62,39,35,0.45)] text-center relative overflow-y-auto rounded-none flex flex-col justify-between"
        id="community-tree-stats-block"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#81c784]/20 rounded-none rotate-45 blur-lg pointer-events-none" />
        
        <div className="shrink-0">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2e7d32] bg-[#e8f5e9] border border-[#2e7d32] px-3 py-1 inline-block mb-3">
            KẾT QUẢ PHỦ XANH 🌱
          </span>
          
          {/* Số lượng cây xanh */}
          <h3 className="text-3xl sm:text-4xl font-black text-[#2e7d32] flex items-center justify-center gap-2 mb-2" id="total-contributions-count">
            <span>🌳 {Y_totalTrees} CÂY XANH THẬT</span>
          </h3>
        </div>

        {/* Hàng mầm xanh trực quan để nâng cao tính sinh động */}
        <div className="flex-1 min-h-[140px] flex flex-col justify-center my-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-6 text-[#3e2723] font-bold">
              <RefreshCw className="w-8 h-8 text-[#d84315] animate-spin mb-2" />
              <span className="text-xs tracking-widest uppercase animate-pulse">ĐANG CẬP NHẬT CÂY XANH...</span>
            </div>
          ) : (
            Y_totalTrees > 0 ? (
              <div className="flex justify-center gap-2 p-3 bg-[#e8f5e9]/50 border-2 border-dashed border-[#81c784] flex-wrap max-w-sm mx-auto">
                {Array.from({ length: Math.min(Y_totalTrees, 20) }).map((_, treeIdx) => {
                  return (
                    <span 
                      key={`pseed-${treeIdx}`} 
                      className="text-2xl select-none animate-bounce" 
                      style={{ animationDelay: `${treeIdx * 100}ms` }}
                    >
                      🌳
                    </span>
                  );
                })}
                {Y_totalTrees > 20 && (
                  <span className="text-[10px] font-bold bg-[#2e7d32] text-white px-2 py-0.5 border-2 border-[#1b5e20] self-center shrink-0">
                    +{Y_totalTrees - 20} cây khác
                  </span>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-[#5d4037]/70 text-[11px] font-bold uppercase">
                Chưa có hạt giống nào được nảy mầm. Hãy là người đầu tiên!
              </div>
            )
          )}
        </div>

        {/* Thông tin quy đổi & Địa điểm */}
        <div className="space-y-2 shrink-0">
          <p className="text-[11px] text-[#5d4037] font-bold leading-relaxed max-w-sm mx-auto">
            (Cơ chế quy đổi: Cứ 3 lượt chơi hợp lệ tương ứng với 01 cây xanh thật! 🌳)
          </p>

          <div className="bg-[#e8f5e9] border-[3px] border-[#2e7d32] p-2 rounded-none text-center relative shadow-[2px_2px_0px_rgba(0,0,0,0.1)] max-w-sm mx-auto">
            <span className="text-[9px] font-black text-[#2e7d32] uppercase tracking-wider block mb-0.5">Địa điểm vun trồng thực tế 📍</span>
            <span className="text-[11px] sm:text-xs font-bold text-[#1b5e20] uppercase">Rừng phòng hộ A Lưới - Thành phố Huế</span>
          </div>
        </div>

        {/* Thanh tiến trình mục tiêu */}
        <div className="mt-3 pt-3 border-t-2 border-dashed border-[#3e2723]/20 shrink-0">
          <div className="flex justify-between items-center mb-1 text-[11px] font-bold uppercase">
            <span className="text-[#2e7d32]">Tiến trình mục tiêu:</span>
            {!loading && (
              <span className="text-[#d84315] animate-pulse">
                Còn {remainingTrees} cây xanh nữa!
              </span>
            )}
          </div>

          <div className="w-full bg-[#efebe9] border-[3px] border-[#3e2723] p-0.5 h-6 rounded-none relative overflow-hidden shadow-[inset_1px_1px_0px_rgba(0,0,0,0.15)]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className="bg-[#2e7d32] h-full"
            />
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#3e2723]">
              🌳 {Y_totalTrees} / {KPI_TargetTrees} CÂY HOÀN THÀNH
            </div>
          </div>
        </div>
      </div>

      {/* Phím điều hướng dưới chân */}
      <div className="flex items-center justify-between gap-2 shrink-0" id="stats-menu-bar">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-white hover:bg-[#efebe9] text-[#3e2723] text-xs font-bold rounded-none border-[3px] border-[#3e2723] active:translate-y-[2px] cursor-pointer shadow-[2px_2px_0px_0px_#3e2723] transition-all uppercase font-pixel"
          id="btn-back-from-stats"
        >
          ← Trang chủ
        </button>

        <button
          type="button"
          onClick={loadStatsData}
          disabled={loading}
          className="inline-flex items-center gap-1 bg-[#2e7d32] hover:bg-[#1b5e20] text-white text-xs font-bold px-4 py-2 border-[3px] border-[#3e2723] rounded-none shadow-[2px_2px_0px_0px_#3e2723] cursor-pointer active:translate-y-[2px] disabled:opacity-40 transition-all uppercase font-pixel"
          id="btn-refresh-stats"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-white ${loading ? 'animate-spin' : ''}`} />
          <span>LÀM MỚI</span>
        </button>
      </div>
    </motion.div>
  );
}
