/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, RotateCcw, Sparkles, Sprout } from 'lucide-react';
import { PlayerInfo } from '../types';

interface ResultViewProps {
  player: PlayerInfo;
  diem: number;
  soTuTimDuoc: number;
  hoanThanh: boolean;
  thoiGianConLai: number;
  saveStatus: 'SAVING' | 'SUCCESS' | 'ERROR';
  onRetrySave: () => void;
  onPlayAgain: () => void;
  onViewLeaderboard: () => void;
  onViewStats: () => void;
  totalPlayerCount: number;
}

export default function ResultView({
  player,
  diem,
  soTuTimDuoc,
  hoanThanh,
  thoiGianConLai,
  saveStatus,
  onRetrySave,
  onPlayAgain,
  onViewLeaderboard,
  onViewStats,
  totalPlayerCount
}: ResultViewProps) {
  const X = totalPlayerCount > 0 ? totalPlayerCount : 1;
  const N = 3 - (X % 3);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.15
          }
        }
      }}
      className="flex flex-col flex-1 items-center py-2 text-center max-w-sm mx-auto select-none font-pixel relative h-full justify-between"
      id="result-view-container"
    >
      {/* Cành mầm cây pixel trang trí bay lơ lửng xung quanh */}
      <div className="absolute -top-6 -left-6 pointer-events-none select-none text-2xl animate-bounce duration-1000 hidden sm:block">🌱</div>
      <div className="absolute -top-2 -right-8 pointer-events-none select-none text-2xl animate-bounce delay-300 hidden sm:block">🍁</div>
      <div className="absolute bottom-20 -left-10 pointer-events-none select-none text-3xl animate-pulse hidden sm:block">🌳</div>
      <div className="absolute bottom-10 -right-10 pointer-events-none select-none text-2xl animate-bounce hidden sm:block">🍂</div>

      {/* Huy hiệu thành tựu */}
      <motion.div 
        variants={{
          hidden: { opacity: 0, y: -20, scale: 0.8 },
          visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 10 } }
        }}
        className="mb-1" 
        id="achievement-icon-block"
      >
        {hoanThanh ? (
          <div className="relative">
            <motion.div 
              className="w-16 h-16 sm:w-20 sm:h-20 bg-[#e8f5e9] border-4 border-[#3e2723] flex items-center justify-center rounded-none relative shadow-[3px_3px_0px_0px_rgba(62,39,35,0.45)]"
              animate={{ 
                rotate: [0, -3, 3, -3, 3, 0],
                scale: [1, 1.05, 0.98, 1.05, 1] 
              }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
              {/* Retro double inside border effect */}
              <div className="absolute inset-1 border-2 border-dashed border-[#81c784] opacity-70 pointer-events-none" />
              <span className="text-3xl sm:text-4xl select-none filter drop-shadow-[2px_2px_0px_rgba(0,0,0,0.15)]">🌳</span>
              <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-[#ffeb3b] animate-bounce" />
            </motion.div>
            <div className="absolute -top-2 -left-2 text-sm">✨</div>
            <div className="absolute -bottom-1 right-1 text-sm">⭐</div>
          </div>
        ) : (
          <motion.div 
            className="w-16 h-16 sm:w-20 sm:h-20 bg-[#fefeec] border-4 border-[#3e2723] rounded-none flex items-center justify-center relative shadow-[3px_3px_0px_0px_rgba(62,39,35,0.45)]"
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <div className="absolute inset-1 border-2 border-dashed border-[#ffb74d] opacity-50 pointer-events-none" />
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-[#ffb74d] fill-[#ffe082]" />
          </motion.div>
        )}
      </motion.div>

      {/* Tiêu đề trạng thái trò chơi - To rõ phong cách arcade cực bốc */}
      <motion.div
        variants={{
          hidden: { opacity: 0, scale: 0.9 },
          visible: { opacity: 1, scale: 1 }
        }}
        className="mb-1"
      >
        <h2 className="text-3xl text-[#3e2723] tracking-normal font-bold leading-none select-none uppercase drop-shadow-[2px_2px_0px_rgba(255,107,0,0.15)]" id="result-status-title">
          {hoanThanh ? "CHÚC MỪNG" : "GAME OVER ⏳"}
        </h2>
        <div className="h-1 w-20 bg-[#3e2723] mx-auto mt-1 md:mt-2 relative">
          <div className="absolute -left-1 -top-1 w-3 h-3 bg-[#ff6b00]" />
          <div className="absolute -right-1 -top-1 w-3 h-3 bg-[#2d6a4f]" />
        </div>
      </motion.div>

      <motion.p 
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        }}
        className="text-sm md:text-base font-bold text-[#5d4037] mb-2 tracking-wide bg-[#efebe9] border-2 border-[#5d4037] px-3 py-1 shadow-[2px_2px_0px_0px_rgba(62,39,35,0.2)] rounded-none inline-block uppercase" 
        id="player-greeting"
      >
        👨‍🚀 {player.hoTen} ({player.vaiTro})
      </motion.p>

      {/* Bảng điểm chi tiết - Board Game Retro */}
      <motion.div 
        variants={{
          hidden: { opacity: 0, y: 15 },
          visible: { opacity: 1, y: 0 }
        }}
        className="w-full bg-[#f4e7c9] border-4 border-[#3e2723] p-2 sm:p-3 shadow-[4px_4px_0px_0px_rgba(62,39,35,0.45)] mb-2 text-[#3e2723] rounded-none relative" 
        id="stats-board"
      >
        <div className="absolute top-1 left-2 text-[9px] uppercase font-bold text-[#3e2723]/45 tracking-widest pointer-events-none">
          SYSTEM_RECORD
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-2 mt-2">
          {/* Mục từ tìm được */}
          <div className="bg-[#efebe9] border-2 border-[#3e2723] p-1.5 rounded-none text-center relative shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
            <span className="text-[10px] sm:text-xs font-bold text-[#5d4037] uppercase block mb-0.5">TÌM ĐƯỢC</span>
            <span className="text-xl sm:text-2xl font-bold text-[#2d6a4f] leading-none block">{soTuTimDuoc} <span className="text-[10px]">TỪ</span></span>
          </div>

          {/* Mục thời gian còn lại */}
          <div className="bg-[#efebe9] border-2 border-[#3e2723] p-1.5 rounded-none text-center relative shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
            <span className="text-[10px] sm:text-xs font-bold text-[#5d4037] uppercase block mb-0.5">THỜI GIAN</span>
            <span className="text-xl sm:text-2xl font-bold text-[#ff6b00] leading-none block">{thoiGianConLai}<span className="text-[10px]">S</span></span>
          </div>
        </div>

        {/* Tổng điểm cực đại */}
        <div className="pt-2 border-t-2 border-dashed border-[#3e2723]/30 text-center relative">
          <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 bg-[#f4e7c9] px-2 text-[10px] font-bold text-[#3e2723]/50">
            FINAL_SCORE
          </div>
          <span className="text-[10px] font-bold text-[#d84315] uppercase tracking-wider block mb-0.5">TỔNG ĐIỂM ĐẠT ĐƯỢC</span>
          <span className="text-3xl sm:text-4xl font-bold text-[#d84315] tracking-tight leading-none filter drop-shadow-[1px_1px_0px_#fff]">{diem}</span>
        </div>
      </motion.div>

      {/* Thông báo quy đổi & ghi nhận trồng cây 🌱 */}
      <motion.div 
        variants={{
          hidden: { opacity: 0, y: 15 },
          visible: { opacity: 1, y: 0 }
        }}
        className="w-full flex-1 min-h-0 overflow-y-auto bg-[#f4e7c9] border-4 border-[#3e2723] p-2 sm:p-3 shadow-[4px_4px_0px_0px_rgba(62,39,35,0.45)] text-left mb-3 text-[#3e2723] rounded-none relative" 
        id="contribution-alert"
      >
        <div className="absolute top-0 right-0 w-16 h-16 bg-[#81c784]/25 rounded-none rotate-12 blur-lg pointer-events-none" />
        
        {/* Banner tiêu đề pixel xanh */}
        <div className="flex items-center gap-1 font-bold text-lg text-[#2e7d32] border-b-2 border-[#3e2723] pb-1 mb-2">
          <span className="text-xl select-none animate-bounce">🌳</span>
          <span className="text-sm sm:text-base tracking-normal">ĐÓNG GÓP XANH</span>
        </div>
        
        {/* Nội dung dạng hộp đại diện tin nhắn */}
        <div className="space-y-2">
          <p className="text-xs sm:text-sm font-bold text-[#3e2723] leading-snug">
            Bạn là người chơi thứ <strong className="text-base sm:text-lg text-[#d84315] font-bold px-1.5 bg-[#efebe9] border-2 border-[#3e2723] shadow-[1px_1px_0px_#3e2723]">{X}</strong> của dự án!
          </p>
          
          <div className="bg-[#e8f5e9] border-2 border-[#2e7d32] p-2 rounded-none shadow-[2px_2px_0px_rgba(0,0,0,0.1)] relative">
            <div className="absolute top-[-6px] right-2 bg-[#2e7d32] text-white text-[8px] font-bold px-1 py-0.2 uppercase font-pixel tracking-wider">
              CHIẾN DỊCH
            </div>
            <p className="text-[10px] sm:text-[11px] font-bold text-[#1b5e20] leading-relaxed">
              🌲 <span className="text-[#d84315]">Chỉ cần thêm {N} người chơi nữa</span> là FPT Student Experience Space lại vun trồng thêm 01 cây xanh thực tế tại Rừng phòng hộ A Lưới, Thành phố Huế!
            </p>
          </div>

          <p className="text-[10px] text-[#5d4037] font-bold leading-tight flex items-start gap-1">
            <span>💚</span>
            <span>Ghi nhận hoàn thành cho <strong>{player.hoTen} ({player.donVi})</strong>.</span>
          </p>
        </div>
      </motion.div>

      {/* Khu vực hành động dưới chân - Đậm chất pixel/arcade buttons */}
      <motion.div 
        variants={{
          hidden: { opacity: 0, y: 15 },
          visible: { opacity: 1, y: 0 }
        }}
        className="w-full space-y-2 mt-auto" 
        id="result-footer-actions"
      >
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={onPlayAgain}
            className="flex flex-col items-center justify-center bg-white hover:bg-[#efebe9] border-[3px] border-[#3e2723] text-[#3e2723] font-bold py-1.5 px-0.5 rounded-none text-[10px] sm:text-xs active:translate-y-[2px] cursor-pointer transition-all shadow-[2px_2px_0px_0px_#3e2723]"
            id="btn-play-again"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#3e2723] mb-0.5" />
            <span>CHƠI LẠI</span>
          </button>

          <button
            type="button"
            onClick={onViewLeaderboard}
            className="flex flex-col items-center justify-center bg-[#ff6b00] hover:bg-[#e05a00] text-white font-bold py-1.5 px-0.5 rounded-none text-[10px] sm:text-xs active:translate-y-[2px] border-[3px] border-[#3e2723] cursor-pointer shadow-[2px_2px_0px_0px_#3e2723] uppercase transition-all"
            id="btn-view-rankings"
          >
            <Trophy className="w-3.5 h-3.5 text-white mb-0.5" />
            <span>XẾP HẠNG</span>
          </button>

          <button
            type="button"
            onClick={onViewStats}
            className="flex flex-col items-center justify-center bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-bold py-1.5 px-0.5 rounded-none text-[10px] sm:text-xs active:translate-y-[2px] border-[3px] border-[#3e2723] cursor-pointer shadow-[2px_2px_0px_0px_#3e2723] uppercase transition-all"
            id="btn-view-stats"
          >
            <Sprout className="w-3.5 h-3.5 text-white mb-0.5" />
            <span>THỐNG KÊ</span>
          </button>
        </div>

        {/* Khối Góp ý / Feedback */}
        <div className="pt-1.5 space-y-1">
          <p className="text-[10px] sm:text-[11px] font-bold text-[#5d4037]/85 animate-pulse">
            Chơi xong rồi? Cho tụi mình xin vài góp ý nhé 🌱
          </p>
          <button
            type="button"
            onClick={() => window.open("https://docs.google.com/forms/d/e/1FAIpQLSfMqfuN2AwqWZtjBu-7gB9txd6znz9_0-jH3n6j7tWpfWF1WQ/viewform?usp=dialog", "_blank")}
            className="w-full flex items-center justify-center gap-2 bg-[#efebe9] hover:bg-[#d7ccc8] border-[3px] border-[#3e2723] text-[#3e2723] font-bold py-2 px-3 rounded-none text-xs sm:text-sm active:translate-y-[2px] cursor-pointer shadow-[2px_2px_0px_0px_rgba(62,39,35,0.45)] transition-all uppercase"
            id="btn-feedback"
          >
            <span>💬 Gửi Feedback</span>
          </button>
        </div>


      </motion.div>
    </motion.div>
  );
}
