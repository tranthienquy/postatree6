/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Layers, Users, Medal, ShieldAlert } from 'lucide-react';
import { LeaderboardItem, SchoolStats } from '../types';

interface LeaderboardViewProps {
  appsScriptUrl: string;
  onBack: () => void;
}

export default function LeaderboardView({ appsScriptUrl, onBack }: LeaderboardViewProps) {
  const [activeTab, setActiveTab] = useState<'INDIVIDUAL' | 'SCHOOL'>('INDIVIDUAL');
  const [items, setItems] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Hàm tải dữ liệu bảng xếp hạng từ Google Apps Script Web App
  const loadLeaderboardData = async () => {
    if (!appsScriptUrl || appsScriptUrl.includes('APPS_SCRIPT_URL_CHUA_CAU_HINH')) {
      // Nếu Apps Script URL chưa cấu hình, ta tự tạo dữ liệu giả lập mẫu cực kỳ trực quan
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
      // Gọi fetch API dạng GET qua Express proxy để tránh CORS
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
      setErrorMsg(
        'Hiển thị dữ liệu cục bộ an toàn. Đảm bảo Apps Script đã deploy Public và biến APPS_SCRIPT_URL chính xác.'
      );
      // Fallback sang mock data nếu kết nối lỗi
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
    loadLeaderboardData();
  }, [appsScriptUrl]);

  // --- XỬ LÝ DỮ LIỆU CÁ NHÂN ---
  const getIndividualLeaderboard = () => {
    const playerGroups: { [key: string]: { hoTen: string; donVi: string; vaiTro?: string; diemCaoNhat: number; soLanChoi: number } } = {};

    items.forEach(item => {
      // Group by email (case-insensitive) as the primary unique key, falling back to name
      const key = item.email ? item.email.trim().toLowerCase() : item.hoTen.trim();
      const currentPoints = item.diem;

      if (!playerGroups[key]) {
        playerGroups[key] = {
          hoTen: item.hoTen,
          donVi: item.donVi,
          vaiTro: item.vaiTro,
          diemCaoNhat: currentPoints,
          soLanChoi: 1
        };
      } else {
        playerGroups[key].soLanChoi += 1;
        if (currentPoints > playerGroups[key].diemCaoNhat) {
          playerGroups[key].diemCaoNhat = currentPoints;
          // Optimize display details with their highest score's inputs
          playerGroups[key].hoTen = item.hoTen;
          playerGroups[key].donVi = item.donVi;
          playerGroups[key].vaiTro = item.vaiTro;
        }
      }
    });

    return Object.values(playerGroups)
      .sort((a, b) => b.diemCaoNhat - a.diemCaoNhat);
  };

  // --- XỬ LÝ DỮ LIỆU THEO ĐƠN VỊ TRƯỜNG ---
  const getSchoolLeaderboard = (): SchoolStats[] => {
    // Để tính chính xác đóng góp ổn định (đã áp dụng giới hạn tối đa 3 lượt hoàn thành hợp lệ mỗi người)
    const schoolGroups: { 
      [key: string]: { 
        donVi: string; 
        tongDiem: number; 
        userCompletedPlays: { [userKey: string]: number };
        soLuongNguoiChoi: Set<string>;
      } 
    } = {};

    items.forEach(item => {
      const donViKey = item.donVi || 'Khác';
      const userKey = item.email ? item.email.trim().toLowerCase() : item.hoTen.trim().toLowerCase();

      if (!schoolGroups[donViKey]) {
        schoolGroups[donViKey] = {
          donVi: donViKey,
          tongDiem: item.diem,
          userCompletedPlays: {},
          soLuongNguoiChoi: new Set([userKey])
        };
      } else {
        schoolGroups[donViKey].tongDiem += item.diem;
        schoolGroups[donViKey].soLuongNguoiChoi.add(userKey);
      }

      if (item.hoanThanh) {
        schoolGroups[donViKey].userCompletedPlays[userKey] = (schoolGroups[donViKey].userCompletedPlays[userKey] || 0) + 1;
      }
    });

    return Object.values(schoolGroups).map(school => {
      // Mỗi cá nhân chỉ đóng góp tối đa 3 lượt hoàn thành hợp lệ (tương tương tối đa 1 cây xanh)
      const cappedPlaysForSchool = Object.values(school.userCompletedPlays).reduce(
        (sum, count) => sum + Math.min(count, 3), 0
      );
      // Quy đổi: 3 lượt hoàn thành hợp lệ đã áp dụng giới hạn = 1 cây xanh thật dồi dào, ổn định
      const tongDongGopTrees = Math.floor(cappedPlaysForSchool / 3);

      return {
        donVi: school.donVi,
        tongDiem: school.tongDiem,
        tongDongGop: tongDongGopTrees,
        soLuongNguoiChoi: school.soLuongNguoiChoi.size
      };
    }).sort((a, b) => {
      if (b.tongDongGop !== a.tongDongGop) {
        return b.tongDongGop - a.tongDongGop;
      }
      return b.tongDiem - a.tongDiem;
    });
  };

  const individualLeaders = getIndividualLeaderboard().slice(0, 10);
  const schoolLeaders = getSchoolLeaderboard().slice(0, 10);

  // Lấy giá trị đóng góp cao nhất của một nhóm trường học để làm mốc tính % tiến trình trực quan
  const maxDongGopUnit = schoolLeaders.length > 0 ? schoolLeaders[0].tongDongGop : 1;

  // Tính các thông số phục vụ quy chế gieo mầm đã bình ổn (giới hạn tối đa 3 lượt hoàn thành mỗi người)
  const uniquePlayersCount = new Set(
    items.map(item => item.email ? item.email.trim().toLowerCase() : item.hoTen.trim().toLowerCase())
  ).size;

  const userCompletedPlays: { [key: string]: number } = {};
  items.forEach(item => {
    if (item.hoanThanh) {
      const userKey = item.email ? item.email.trim().toLowerCase() : item.hoTen.trim().toLowerCase();
      userCompletedPlays[userKey] = (userCompletedPlays[userKey] || 0) + 1;
    }
  });

  // Mỗi một tài khoản chỉ đóng góp tối đa 3 lượt hoàn thành hợp lệ (tương ứng 1 cây xanh thật) để bình ổn tốc độ tăng trưởng
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
      className="w-full flex-1 flex flex-col font-pixel relative h-full min-h-0"
      id="leaderboard-view-container"
    >
      {/* Tiêu đề Bảng xếp hạng */}
      <div className="text-center mb-3 shrink-0" id="leaderboard-title-block">
        <h2 className="text-2xl sm:text-3xl font-black text-[#5d4037] uppercase tracking-normal font-pixel drop-shadow-[1.5px_1.5px_0px_rgba(62,39,35,0.1)]">
          🏆 BẢNG XẾP HẠNG 🏆
        </h2>
        <div className="h-1 w-24 bg-[#3e2723] mx-auto mt-1 relative">
          <div className="absolute -left-1 -top-1 w-2.5 h-2.5 bg-[#ff6b00]" />
          <div className="absolute -right-1 -top-1 w-2.5 h-2.5 bg-[#2d6a4f]" />
        </div>
      </div>

      {/* Điều hướng và Tải lại */}
      <div className="flex items-center justify-between gap-2 mb-2 shrink-0" id="leaderboard-menu-bar">
        <button
          type="button"
          onClick={onBack}
          className="px-3 py-1.5 sm:py-2 bg-white hover:bg-[#efebe9] text-[#3e2723] text-xs sm:text-sm font-bold rounded-none border-[3px] border-[#3e2723] active:translate-y-[2px] cursor-pointer shadow-[2px_2px_0px_0px_#3e2723] transition-all uppercase"
          id="btn-back-from-leaderboard"
        >
          ← Trang chủ
        </button>

        <button
          type="button"
          onClick={loadLeaderboardData}
          disabled={loading}
          className="inline-flex items-center gap-1 bg-white hover:bg-[#efebe9] text-[#3e2723] text-xs sm:text-sm font-bold px-3 py-1.5 sm:py-2 border-[3px] border-[#3e2723] rounded-none shadow-[2px_2px_0px_0px_#3e2723] cursor-pointer active:translate-y-[2px] disabled:opacity-40 transition-all uppercase"
          id="btn-refresh-leaderboard"
          title="Tải lại bảng xếp hạng"
        >
          <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 text-[#d84315] ${loading ? 'animate-spin' : ''}`} />
          <span>LÀM MỚI</span>
        </button>
      </div>

      {/* Bộ chọn thẻ TAB trực quan */}
      <div className="flex border-b-[4px] border-[#3e2723] mb-2 bg-[#efebe9]/50 shrink-0" id="ranking-tab-selector">
        <button
          type="button"
          onClick={() => setActiveTab('INDIVIDUAL')}
          className={`flex-1 text-center font-bold py-2 text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'INDIVIDUAL'
              ? 'bg-[#f4e7c9] text-[#3e2723] border-t-[4px] border-x-[4px] border-[#3e2723] translate-y-[4px]'
              : 'text-[#5d4037]/60 hover:text-[#5d4037]'
          }`}
          id="tab-individual"
        >
          <Users className="w-4 h-4 text-[#3e2723]" />
          <span>CÁ NHÂN</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('SCHOOL')}
          className={`flex-1 text-center font-bold py-2 text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'SCHOOL'
              ? 'bg-[#f4e7c9] text-[#3e2723] border-t-[4px] border-x-[4px] border-[#3e2723] translate-y-[4px]'
              : 'text-[#5d4037]/60 hover:text-[#5d4037]'
          }`}
          id="tab-unit"
        >
          <Layers className="w-4 h-4 text-[#3e2723]" />
          <span>ĐƠN VỊ THI ĐUA</span>
        </button>
      </div>

      {/* MAIN CONTAINER CONTENT VIEW */}
      <div className="flex-1 bg-white border-[4px] border-[#3e2723] rounded-none shadow-[4px_4px_0px_0px_rgba(62,39,35,0.45)] overflow-hidden min-h-0 flex flex-col" id="ranking-scroll-box">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#3e2723] font-bold" id="ranking-loading">
            <RefreshCw className="w-10 h-10 text-[#d84315] animate-spin mb-4" />
            <span className="text-base tracking-widest uppercase animate-pulse">ĐANG KẾT NỐI VƯỜN ƯƠM...</span>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* TAB 1: CÁ NHÂN */}
            {activeTab === 'INDIVIDUAL' && (
              <motion.div
                key="tab-individual-content"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="overflow-x-auto flex-1 overflow-y-auto"
              >
                {individualLeaders.length === 0 ? (
                  <div className="text-center py-16 text-[#5d4037]/80 text-sm font-bold uppercase">
                    Chưa có hạt giống nào nảy mầm. Hãy chơi ngay!
                  </div>
                ) : (
                  <table className="w-full text-left text-xs border-collapse font-pixel">
                    <thead>
                      <tr className="bg-[#efebe9] text-[#3e2723] font-bold border-b-[4px] border-[#3e2723] uppercase text-[10px] tracking-wide">
                        <th className="py-2 px-2 text-center w-12 border-r-4 border-[#3e2723]/30">HẠNG</th>
                        <th className="py-2 px-3 border-r-4 border-[#3e2723]/30">HỌ VÀ TÊN</th>
                        <th className="py-2 px-3 border-r-4 border-[#3e2723]/30">CƠ SỞ TRỰC THUỘC</th>
                        <th className="py-2 px-2 text-center border-r-4 border-[#3e2723]/30">LƯỢT</th>
                        <th className="py-2 px-3 text-right">ĐIỂM CAO</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-[#3e2723]/20">
                      {individualLeaders.map((player, idx) => {
                        const rank = idx + 1;
                        let rankBadge = null;
                        
                        if (rank === 1) {
                          rankBadge = <span className="inline-flex items-center justify-center w-5.5 h-5.5 bg-[#ffeb3b] text-[#3e2723] font-bold border-2 border-[#3e2723] text-xs shadow-[1px_1px_0px_#3e2723]">🥇</span>;
                        } else if (rank === 2) {
                          rankBadge = <span className="inline-flex items-center justify-center w-5.5 h-5.5 bg-[#e0e0e0] text-[#3e2723] font-bold border-2 border-[#3e2723] text-xs shadow-[1px_1px_0px_#3e2723]">🥈</span>;
                        } else if (rank === 3) {
                          rankBadge = <span className="inline-flex items-center justify-center w-5.5 h-5.5 bg-[#ffb74d] text-[#3e2723] font-bold border-2 border-[#3e2723] text-xs shadow-[1px_1px_0px_#3e2723]">🥉</span>;
                        } else {
                          rankBadge = <span className="text-[#5d4037] font-bold text-xs w-5 text-center inline-block">#{rank}</span>;
                        }

                        // Zebra pattern background colors for premium visual touch
                        const rowBg = rank % 2 === 1 ? 'bg-white' : 'bg-[#fcfaf2]';

                        return (
                          <tr key={`ind-${idx}`} className={`hover:bg-[#efebe9]/50 transition-colors ${rowBg} font-bold text-xs uppercase border-b-2 border-[#3e2723]/10`}>
                            <td className="py-2 px-2 text-center border-r-4 border-[#3e2723]/10 select-none">{rankBadge}</td>
                            <td className="py-2 px-3 border-r-4 border-[#3e2723]/10">
                              <span className="font-bold text-[#3e2723] text-[12px] block truncate max-w-[130px]">{player.hoTen}</span>
                              {player.vaiTro && (
                                <span className="font-bold text-[8px] bg-[#e8f5e9] text-[#2e7d32] border border-[#2e7d32]/30 px-1 py-0.2 select-none uppercase tracking-wide inline-block mt-0.5">
                                  {player.vaiTro}
                                </span>
                              )}
                            </td>
                            <td className="py-2 px-3 text-[#5d4037]/90 text-[10px] font-bold border-r-4 border-[#3e2723]/10 leading-snug truncate max-w-[110px]">{player.donVi}</td>
                            <td className="py-2 px-2 text-center text-[#5d4037] border-r-4 border-[#3e2723]/10 font-bold text-xs">{player.soLanChoi}</td>
                            <td className="py-2 px-3 text-right text-[#d84315] font-bold text-base tabular-nums tracking-tight filter drop-shadow-[0.5px_0.5px_0px_#5d4037]">{player.diemCaoNhat}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </motion.div>
            )}

            {/* TAB 2: THI ĐUA ĐƠN VỊ */}
            {activeTab === 'SCHOOL' && (
              <motion.div
                key="tab-school-content"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3 sm:p-4 space-y-2.5 bg-[#faf8f4] flex-1 overflow-y-auto"
              >
                {schoolLeaders.length === 0 ? (
                  <div className="text-center py-16 text-[#5d4037] font-bold uppercase leading-relaxed">
                    Chưa có thống kê thi đua.
                  </div>
                ) : (
                  schoolLeaders.map((school, i) => {
                    const progressVal = maxDongGopUnit > 0 ? (school.tongDongGop / maxDongGopUnit) * 100 : 0;
                    return (
                      <div key={`school-${i}`} className="flex flex-col gap-1 border-b-2 border-dashed border-[#5d4037]/20 pb-2.5 last:border-b-0" id={`school-row-${i}`}>
                        <div className="flex justify-between items-center text-xs font-bold">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-[#efebe9] text-[#3e2723] w-5 h-5 flex items-center justify-center rounded-none font-bold border-2 border-[#3e2723] shadow-[1px_1px_0px_#3e2723]">
                              {i + 1}
                            </span>
                            <span className="text-[#3e2723] truncate max-w-[180px] text-xs uppercase tracking-tight font-bold">{school.donVi}</span>
                          </div>
                          
                          <div className="text-right flex items-center gap-2 shrink-0">
                            <span className="text-[#2e7d32] font-bold text-xs">
                              {school.tongDongGop} CÂY 🌱
                            </span>
                            <span className="text-[9px] text-[#5d4037]/75 font-semibold">
                              ({school.tongDiem}đ • {school.soLuongNguoiChoi}👤)
                            </span>
                          </div>
                        </div>

                        {/* Thanh progress bar visual pixel-art */}
                        <div className="w-full bg-[#efebe9] h-4 overflow-hidden border-2 border-[#3e2723] p-0.5 shadow-[1px_1px_0px_rgba(0,0,0,0.1)] relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressVal}%` }}
                            className="bg-[#81c784] h-full"
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Thông tin chân trang bổ sung */}
      <div className="text-center text-[10px] sm:text-[11px] text-[#5d4037]/80 font-bold mt-2 space-y-1 font-pixel leading-relaxed shrink-0">
        <p className="text-[#2e7d32] uppercase">QUY ĐỔI: 3 LƯỢT = 1 CÂY (TỐI ĐA 1 CÂY/NGƯỜI)</p>
      </div>
    </motion.div>
  );
}
