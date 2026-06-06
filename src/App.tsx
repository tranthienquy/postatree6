/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { AppScreen, PlayerInfo, PlayRecord } from './types';
import IntroView from './components/IntroView';
import FormView from './components/FormView';
import GameView from './components/GameView';
import ResultView from './components/ResultView';
import LeaderboardView from './components/LeaderboardView';

// ==========================================
// THÔNG TIN CẤU HÌNH BAN TỔ CHỨC (CẦN CHỈNH SỬA)
// ==========================================
// Hãy dán URL Web App Apps Script (sau khi Deploy ở dạng Web App "Anyone") vào đây để kích hoạt dữ liệu lưu Sheet
const APPS_SCRIPT_URL: string = "https://script.google.com/macros/s/AKfycbxEJ76Q-1JTAUiG-LYstTqrp5e2S2ansLH7nr99IgySKafIFGDKX60NfpJeruLvwxK6hA/exec"; 

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('INTRO');
  
  // Quản lý thông tin người chơi hiện tại
  const [player, setPlayer] = useState<PlayerInfo | null>(null);

  // Kết quả lượt chơi hiện tại
  const [diem, setDiem] = useState(0);
  const [soTuTimDuoc, setSoTuTimDuoc] = useState(0);
  const [hoanThanh, setHoanThanh] = useState(false);
  const [thoiGianConLai, setThoiGianConLai] = useState(0);

  // Trạng thái lưu dữ liệu lên Google Sheets
  const [saveStatus, setSaveStatus] = useState<'SAVING' | 'SUCCESS' | 'ERROR'>('SUCCESS');

  // Quản lý danh sách tất cả bản ghi từ Google Sheets hoặc cache giả lập
  const [allRecords, setAllRecords] = useState<PlayRecord[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(true);

  // Hàm tải dữ liệu bảng xếp hạng và người chơi
  const fetchRecords = async () => {
    setRecordsLoading(true);
    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL === "APPS_SCRIPT_URL_CHUA_CAU_HINH") {
      const saved = localStorage.getItem('post_a_tree_mock_records');
      if (saved) {
        setAllRecords(JSON.parse(saved));
      } else {
        const mockRecords: PlayRecord[] = [
          { hoTen: 'Nguyễn Trần Mạnh Nam', soDienThoai: '0912345678', email: 'namntm@fe.edu.vn', donVi: 'Đại học FPT Quy Nhơn', vaiTro: 'Sinh viên', diem: 236, soTuTimDuoc: 4, hoanThanh: true, thoiGianConLai: 68, thoiGianChoi: '2026-06-06T06:00:00.000Z' },
          { hoTen: 'Phạm Minh Đức', soDienThoai: '0988887777', email: 'ducpm2@fe.edu.vn', donVi: 'Cao đẳng FPT (Polytechnic)', vaiTro: 'Sinh viên', diem: 212, soTuTimDuoc: 4, hoanThanh: true, thoiGianConLai: 56, thoiGianChoi: '2026-06-06T06:01:00.000Z' },
          { hoTen: 'Lê Minh Hương', soDienThoai: '0977666555', email: 'huonglm3@fpt.edu.vn', donVi: 'Đại học FPT Hà Nội', vaiTro: 'Học sinh', diem: 254, soTuTimDuoc: 4, hoanThanh: true, thoiGianConLai: 77, thoiGianChoi: '2026-06-06T06:02:00.000Z' },
          { hoTen: 'Trần Thế Sơn', soDienThoai: '0905123456', email: 'sontt5@fe.edu.vn', donVi: 'Đại học FPT Quy Nhơn', vaiTro: 'Cán bộ - Giảng viên', diem: 198, soTuTimDuoc: 4, hoanThanh: true, thoiGianConLai: 49, thoiGianChoi: '2026-06-06T06:03:00.000Z' },
          { hoTen: 'Nguyễn Thị Hồng', soDienThoai: '0935555111', email: 'hongnt@fe.edu.vn', donVi: 'FSchool (Tiểu học / THCS / THPT FPT)', vaiTro: 'Học sinh', diem: 176, soTuTimDuoc: 4, hoanThanh: true, thoiGianConLai: 38, thoiGianChoi: '2026-06-06T06:04:00.000Z' },
          { hoTen: 'Hoàng Xuân Bắc', soDienThoai: '0944333222', email: 'bachx4@fe.edu.vn', donVi: 'BTEC FPT', vaiTro: 'Sinh viên', diem: 125, soTuTimDuoc: 2, hoanThanh: false, thoiGianConLai: 0, thoiGianChoi: '2026-06-06T06:05:00.000Z' },
          { hoTen: 'Nguyễn Văn Định', soDienThoai: '0977666556', email: 'dinhnv@fpt.edu.vn', donVi: 'Đại học FPT Hà Nội', vaiTro: 'Cán bộ - Giảng viên', diem: 180, soTuTimDuoc: 4, hoanThanh: true, thoiGianConLai: 40, thoiGianChoi: '2026-06-06T06:06:00.000Z' }
        ];
        localStorage.setItem('post_a_tree_mock_records', JSON.stringify(mockRecords));
        setAllRecords(mockRecords);
      }
      setRecordsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${APPS_SCRIPT_URL}?_cb=${Date.now()}`);
      if (response.ok) {
        const resJson = await response.json();
        if (resJson && resJson.status === 'ok') {
          const data = resJson.data || [];
          const loadedRecords = data.map((item: any) => ({
            hoTen: item.hoTen || item.ho_ten || '',
            soDienThoai: item.soDienThoai || item.so_dien_thoai || '',
            email: item.email || '',
            donVi: item.donVi || item.don_vi || '',
            vaiTro: item.vaiTro || item.vai_tro || '',
            diem: Number(item.diem) || 0,
            soTuTimDuoc: Number(item.soTuTimDuoc) || Number(item.so_tu_tim_duoc) || 0,
            hoanThanh: item.hoanThanh === true || String(item.hoanThanh).toLowerCase() === 'true',
            thoiGianConLai: Number(item.thoiGianConLai) || Number(item.thoi_gian_con_lai) || 0,
            thoiGianChoi: item.timestamp || item.thoiGianChoi || item.thoi_gian_choi || new Date().toISOString()
          }));
          setAllRecords(loadedRecords);
          localStorage.setItem('post_a_tree_mock_records', JSON.stringify(loadedRecords));
          setRecordsLoading(false);
          return;
        }
      }
      throw new Error("Không thể phân tích dữ liệu trả về từ Google Sheets.");
    } catch (error) {
      console.error("Lỗi khi tải bản ghi từ Google Sheets:", error);
      // Nạp dữ liệu dự phòng từ localStorage hoặc mặc định đẹp mắt để ứng dụng không bị trống
      const saved = localStorage.getItem('post_a_tree_mock_records');
      if (saved) {
        setAllRecords(JSON.parse(saved));
      } else {
        const fallbackRecords: PlayRecord[] = [
          { hoTen: 'Nguyễn Trần Mạnh Nam', soDienThoai: '0912345678', email: 'namntm@fe.edu.vn', donVi: 'Đại học FPT Quy Nhơn', vaiTro: 'Sinh viên', diem: 236, soTuTimDuoc: 4, hoanThanh: true, thoiGianConLai: 68, thoiGianChoi: '2026-06-06T06:00:00.000Z' },
          { hoTen: 'Phạm Minh Đức', soDienThoai: '0988887777', email: 'ducpm2@fe.edu.vn', donVi: 'Cao đẳng FPT (Polytechnic)', vaiTro: 'Sinh viên', diem: 212, soTuTimDuoc: 4, hoanThanh: true, thoiGianConLai: 56, thoiGianChoi: '2026-06-06T06:01:00.000Z' },
          { hoTen: 'Lê Minh Hương', soDienThoai: '0977666555', email: 'huonglm3@fpt.edu.vn', donVi: 'Đại học FPT Hà Nội', vaiTro: 'Học sinh', diem: 254, soTuTimDuoc: 4, hoanThanh: true, thoiGianConLai: 77, thoiGianChoi: '2026-06-06T06:02:00.000Z' },
          { hoTen: 'Trần Thế Sơn', soDienThoai: '0905123456', email: 'sontt5@fe.edu.vn', donVi: 'Đại học FPT Quy Nhơn', vaiTro: 'Cán bộ - Giảng viên', diem: 198, soTuTimDuoc: 4, hoanThanh: true, thoiGianConLai: 49, thoiGianChoi: '2026-06-06T06:03:00.000Z' },
          { hoTen: 'Nguyễn Thị Hồng', soDienThoai: '0935555111', email: 'hongnt@fe.edu.vn', donVi: 'FSchool (Tiểu học / THCS / THPT FPT)', vaiTro: 'Học sinh', diem: 176, soTuTimDuoc: 4, hoanThanh: true, thoiGianConLai: 38, thoiGianChoi: '2026-06-06T06:04:00.000Z' }
        ];
        localStorage.setItem('post_a_tree_mock_records', JSON.stringify(fallbackRecords));
        setAllRecords(fallbackRecords);
      }
    } finally {
      setRecordsLoading(false);
    }
  };

  // Load trước thông tin người chơi từ localStorage (nếu có) để tăng chất lượng trải nghiệm người dùng
  useEffect(() => {
    try {
      const savedInfo = localStorage.getItem('post_a_tree_player');
      if (savedInfo) {
        setPlayer(JSON.parse(savedInfo));
      }
    } catch (e) {
      console.error("Lỗi khi đọc thông tin người chơi từ localStorage:", e);
    }
    fetchRecords();
  }, []);

  // Hàm chuyển màn hình mượt mà
  const navigateTo = (nextScreen: AppScreen) => {
    // Cuộn lên đầu trang giúp trải nghiệm thiết bị di động tối ưu
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setScreen(nextScreen);
  };

  /**
   * Đồng bộ hóa và lưu bản ghi kết quả của người chơi lên Google Sheet
   */
  const submitResult = async (record: PlayRecord) => {
    setSaveStatus('SAVING');

    // Thêm bản ghi này trực tiếp vào allRecords một cách lạc quan để cập nhật UI tức thì
    setAllRecords(prev => {
      const updated = [...prev, record];
      if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL === "APPS_SCRIPT_URL_CHUA_CAU_HINH") {
        localStorage.setItem('post_a_tree_mock_records', JSON.stringify(updated));
      }
      return updated;
    });
    
    // Nếu chưa cấu hình APPS_SCRIPT_URL thực tế, ta mô phỏng trạng thái lưu thành công sau 1 giây
    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL === "APPS_SCRIPT_URL_CHUA_CAU_HINH") {
      console.warn("LƯU Ý: APPS_SCRIPT_URL chưa được cấu hình. Website đang chạy ở chế độ giả lập dữ liệu.");
      setTimeout(() => {
        setSaveStatus('SUCCESS');
      }, 1000);
      return;
    }

    try {
      // Gửi yêu cầu POST lên Web App bằng phương thức fetch không đồng bộ
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Thiết lập no-cors giúp tối giản hóa lỗi kết nối cross-domain trên một số trình duyệt
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(record)
      });

      // Đối với chế độ no-cors, phản hồi sẽ trả về opaque, ta mặc định là gửi lên thành công nếu không bắt lỗi exception mạng
      setSaveStatus('SUCCESS');

      // Đồng thời lưu trạng thái đá chơi vào localStorage chống các trường hợp spam quá mức
      localStorage.setItem('post_a_tree_has_played_flag', 'true');

    } catch (error) {
      console.error("Lỗi mạng khi kết nối lưu API Google Sheets:", error);
      setSaveStatus('ERROR');
    }
  };

  // Cố gắng gửi lại dữ liệu nếu bị rớt mạng hoặc lỗi ngoại lệ
  const handleRetrySave = () => {
    if (player) {
      const record: PlayRecord = {
        hoTen: player.hoTen,
        soDienThoai: player.soDienThoai || '',
        email: player.email,
        donVi: player.donVi,
        vaiTro: player.vaiTro || 'Thành viên',
        diem,
        soTuTimDuoc,
        hoanThanh,
        thoiGianConLai,
        thoiGianChoi: new Date().toISOString()
      };
      submitResult(record);
    }
  };

  // Xử lý nộp form thông tin thành công
  const handleFormSubmit = (info: PlayerInfo) => {
    setPlayer(info);
    // Lưu lại thông tin vào localStorage để lần chơi sau người dùng không cần gõ lại
    localStorage.setItem('post_a_tree_player', JSON.stringify(info));
    navigateTo('GAME');
  };

  // Xử lý khi ván game tìm chữ kết thúc (thắng hoặc hết giờ)
  const handleGameEnd = (params: {
    diem: number;
    soTuTimDuoc: number;
    hoanThanh: boolean;
    thoiGianConLai: number;
  }) => {
    setDiem(params.diem);
    setSoTuTimDuoc(params.soTuTimDuoc);
    setHoanThanh(params.hoanThanh);
    setThoiGianConLai(params.thoiGianConLai);
    
    navigateTo('RESULT');

    // Tiến hành tự động nộp bản ghi lên Google Sheets ngay lập tức
    if (player) {
      const record: PlayRecord = {
        hoTen: player.hoTen,
        soDienThoai: player.soDienThoai || '',
        email: player.email,
        donVi: player.donVi,
        vaiTro: player.vaiTro || 'Thành viên',
        diem: params.diem,
        soTuTimDuoc: params.soTuTimDuoc,
        hoanThanh: params.hoanThanh,
        thoiGianConLai: params.thoiGianConLai,
        thoiGianChoi: new Date().toISOString()
      };
      submitResult(record);
    }
  };

  return (
    <div 
      className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-center items-center py-6 px-4 selection:bg-emerald-500/10 selection:text-emerald-900"
      id="app-full-wrapper"
    >
      {/* KHỐI GIỮA: KHU BIỂU DIỄN CHÍNH (BENTO CARD ĐẶC ĐIỂM SẮC NÉT) */}
      <main className="max-w-md w-full bg-white border-2 border-emerald-900/5 rounded-3xl p-6 shadow-2xl relative" id="app-main-view-card">
        {/* Nền gợn sóng bán nguyệt góc cho mượt mà */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-emerald-50/20 rounded-full blur-xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />

        <AnimatePresence mode="wait">
          {screen === 'INTRO' && (
            <div key="intro" className="w-full">
              <IntroView 
                onStart={() => navigateTo('FORM')} 
                onViewLeaderboard={() => navigateTo('LEADERBOARD')} 
              />
            </div>
          )}

          {screen === 'FORM' && (
            <div key="form" className="w-full">
              <FormView 
                onBack={() => navigateTo('INTRO')}
                onSubmit={handleFormSubmit}
              />
            </div>
          )}

          {screen === 'GAME' && player && (
            <div key="game" className="w-full">
              <GameView 
                player={player}
                onFinishGame={handleGameEnd}
              />
            </div>
          )}

          {screen === 'RESULT' && player && (
            <div key="result" className="w-full">
              <ResultView 
                player={player}
                diem={diem}
                soTuTimDuoc={soTuTimDuoc}
                hoanThanh={hoanThanh}
                thoiGianConLai={thoiGianConLai}
                saveStatus={saveStatus}
                onRetrySave={handleRetrySave}
                onPlayAgain={() => navigateTo('FORM')}
                onViewLeaderboard={() => navigateTo('LEADERBOARD')}
                totalPlayerCount={allRecords.length}
              />
            </div>
          )}

          {screen === 'LEADERBOARD' && (
            <div key="leaderboard" className="w-full">
              <LeaderboardView 
                appsScriptUrl={APPS_SCRIPT_URL}
                onBack={() => navigateTo('INTRO')}
              />
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
