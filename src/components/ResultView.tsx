/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Share2, RotateCcw, CheckCheck, Sparkles } from 'lucide-react';
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
  totalPlayerCount
}: ResultViewProps) {
  const [copied, setCopied] = useState(false);

  // Tạo liên kết chia sẻ kèm lời rủ bạn cùng chơi cực chất
  const handleShare = () => {
    const currentUrl = window.location.origin + window.location.pathname;
    const X = totalPlayerCount > 0 ? totalPlayerCount : 1;
    const shareText = `Cùng gieo mầm xanh cùng POST-A-TREE! Mình là người chơi thứ ${X} 🌳 Cứ 3 người chơi = 01 cây xanh thật được trồng! Click chơi ngay cùng mình nhé: ${currentUrl}`;
    
    // Thử dùng API chia sẻ hệ thống nếu có, hoặc fallback sao chép vào clipboard
    if (navigator.share) {
      navigator.share({
        title: 'POST-A-TREE - CÙNG NHAU GIEO MẦM XANH CHO TƯƠNG LAI',
        text: shareText,
        url: currentUrl
      }).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }).catch((err) => {
        console.log("Hủy hoặc lỗi chia sẻ thông thường", err);
        // Fallback sao chép clipboard
        navigator.clipboard.writeText(shareText).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
        });
      });
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }).catch(() => {
        alert("Đã sao chép nội dung chia sẻ: " + shareText);
      });
    }
  };

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
      className="flex flex-col items-center py-5 text-center max-w-sm mx-auto select-none font-pixel relative"
      id="result-view-container"
    >
      {/* Cành mầm cây pixel trang trí bay lơ lửng xung quanh */}
      <div className="absolute -top-6 -left-6 pointer-events-none select-none text-2xl animate-bounce duration-1000">🌱</div>
      <div className="absolute -top-2 -right-8 pointer-events-none select-none text-2xl animate-bounce delay-300">🍁</div>
      <div className="absolute bottom-20 -left-10 pointer-events-none select-none text-3xl animate-pulse">🌳</div>
      <div className="absolute bottom-10 -right-10 pointer-events-none select-none text-2xl animate-bounce">🍂</div>

      {/* Huy hiệu thành tựu */}
      <motion.div 
        variants={{
          hidden: { opacity: 0, y: -20, scale: 0.8 },
          visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 10 } }
        }}
        className="mb-5" 
        id="achievement-icon-block"
      >
        {hoanThanh ? (
          <div className="relative">
            <motion.div 
              className="w-24 h-24 bg-[#e8f5e9] border-[6px] border-[#3e2723] flex items-center justify-center rounded-none relative shadow-[5px_5px_0px_0px_rgba(62,39,35,0.45)]"
              animate={{ 
                rotate: [0, -3, 3, -3, 3, 0],
                scale: [1, 1.05, 0.98, 1.05, 1] 
              }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
              {/* Retro double inside border effect */}
              <div className="absolute inset-1 border-2 border-dashed border-[#81c784] opacity-70 pointer-events-none" />
              <span className="text-5xl select-none filter drop-shadow-[2px_2px_0px_rgba(0,0,0,0.15)]">🌳</span>
              <Sparkles className="absolute -top-2.5 -right-2.5 w-7 h-7 text-[#ffeb3b] animate-bounce" />
            </motion.div>
            <div className="absolute -top-3 -left-3 text-lg">✨</div>
            <div className="absolute -bottom-2 right-1 text-lg">⭐</div>
          </div>
        ) : (
          <motion.div 
            className="w-24 h-24 bg-[#fefeec] border-[6px] border-[#3e2723] rounded-none flex items-center justify-center relative shadow-[5px_5px_0px_0px_rgba(62,39,35,0.45)]"
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <div className="absolute inset-1 border-2 border-dashed border-[#ffb74d] opacity-50 pointer-events-none" />
            <Trophy className="w-12 h-12 text-[#ffb74d] fill-[#ffe082]" />
          </motion.div>
        )}
      </motion.div>

      {/* Tiêu đề trạng thái trò chơi - To rõ phong cách arcade cực bốc */}
      <motion.div
        variants={{
          hidden: { opacity: 0, scale: 0.9 },
          visible: { opacity: 1, scale: 1 }
        }}
        className="mb-2"
      >
        <h2 className="text-4xl text-[#3e2723] tracking-normal font-bold leading-none select-none uppercase drop-shadow-[2px_2px_0px_rgba(255,107,0,0.15)]" id="result-status-title">
          {hoanThanh ? "CHÚC MỪNG" : "GAME OVER ⏳"}
        </h2>
        <div className="h-1 w-28 bg-[#3e2723] mx-auto mt-2 relative">
          <div className="absolute -left-1 -top-1 w-3 h-3 bg-[#ff6b00]" />
          <div className="absolute -right-1 -top-1 w-3 h-3 bg-[#2d6a4f]" />
        </div>
      </motion.div>

      <motion.p 
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        }}
        className="text-lg font-bold text-[#5d4037] mb-5 tracking-wide bg-[#efebe9] border-2 border-[#5d4037] px-4 py-1.5 shadow-[2px_2px_0px_0px_rgba(62,39,35,0.2)] rounded-none inline-block uppercase" 
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
        className="w-full bg-[#f4e7c9] border-[6px] border-[#3e2723] p-4 shadow-[5px_5px_0px_0px_rgba(62,39,35,0.45)] mb-5 text-[#3e2723] rounded-none relative" 
        id="stats-board"
      >
        <div className="absolute top-1 left-2 text-[10px] uppercase font-bold text-[#3e2723]/45 tracking-widest pointer-events-none">
          SYSTEM_RECORD
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4 mt-2">
          {/* Mục từ tìm được */}
          <div className="bg-[#efebe9] border-[3px] border-[#3e2723] p-2 rounded-none text-center relative shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
            <span className="text-xs font-bold text-[#5d4037] uppercase block mb-1">TÌM ĐƯỢC</span>
            <span className="text-3xl font-bold text-[#2d6a4f] leading-none block">{soTuTimDuoc} <span className="text-xs">TỪ</span></span>
          </div>

          {/* Mục thời gian còn lại */}
          <div className="bg-[#efebe9] border-[3px] border-[#3e2723] p-2 rounded-none text-center relative shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
            <span className="text-xs font-bold text-[#5d4037] uppercase block mb-1">THỜI GIAN</span>
            <span className="text-3xl font-bold text-[#ff6b00] leading-none block">{thoiGianConLai}<span className="text-xs">S</span></span>
          </div>
        </div>

        {/* Tổng điểm cực đại */}
        <div className="pt-3 border-t-4 border-dashed border-[#3e2723]/30 text-center relative">
          <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 bg-[#f4e7c9] px-2 text-[10px] font-bold text-[#3e2723]/50">
            FINAL_SCORE
          </div>
          <span className="text-xs font-bold text-[#d84315] uppercase tracking-wider block mb-1">TỔNG ĐIỂM ĐẠT ĐƯỢC</span>
          <span className="text-5xl font-bold text-[#d84315] tracking-tight leading-none filter drop-shadow-[1px_1px_0px_#fff]">{diem}</span>
        </div>
      </motion.div>

      {/* Thông báo quy đổi & ghi nhận trồng cây 🌱 */}
      <motion.div 
        variants={{
          hidden: { opacity: 0, y: 15 },
          visible: { opacity: 1, y: 0 }
        }}
        className="w-full bg-[#f4e7c9] border-[5px] border-[#3e2723] p-4 shadow-[5px_5px_0px_0px_rgba(62,39,35,0.45)] text-left mb-5 text-[#3e2723] rounded-none relative overflow-hidden" 
        id="contribution-alert"
      >
        <div className="absolute top-0 right-0 w-16 h-16 bg-[#81c784]/25 rounded-none rotate-12 blur-lg pointer-events-none" />
        
        {/* Banner tiêu đề pixel xanh */}
        <div className="flex items-center gap-2 font-bold text-xl text-[#2e7d32] border-b-4 border-[#3e2723] pb-2 mb-3">
          <span className="text-2xl select-none animate-bounce">🌳</span>
          <span className="text-lg tracking-normal">ĐÓNG GÓP XANH</span>
        </div>
        
        {/* Nội dung dạng hộp đại diện tin nhắn */}
        <div className="space-y-3">
          <p className="text-base font-bold text-[#3e2723] leading-snug">
            Bạn là người chơi thứ <strong className="text-2xl text-[#d84315] font-bold px-1.5 bg-[#efebe9] border-2 border-[#3e2723] shadow-[1px_1px_0px_#3e2723]">{X}</strong> của dự án!
          </p>
          
          <div className="bg-[#e8f5e9] border-[3px] border-[#2e7d32] p-3 rounded-none shadow-[2px_2px_0px_rgba(0,0,0,0.1)] relative">
            <div className="absolute top-[-8px] right-2 bg-[#2e7d32] text-white text-[9px] font-bold px-1 py-0.2 uppercase font-pixel tracking-wider">
              CHIẾN DỊCH
            </div>
            <p className="text-[13px] font-bold text-[#1b5e20] leading-relaxed">
              🌲 <span className="text-[#d84315]">Chỉ cần thêm {N} người chơi nữa</span> là FPT Student Experience Space lại vun trồng thêm 01 cây xanh thực tế tại Rừng phòng hộ A Lưới, Thành phố Huế!
            </p>
          </div>

          <p className="text-[11px] text-[#5d4037] font-bold leading-tight flex items-center gap-1">
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
        className="w-full space-y-3.5" 
        id="result-footer-actions"
      >
        <div className="grid grid-cols-2 gap-3.5">
          <button
            type="button"
            onClick={onPlayAgain}
            className="flex items-center justify-center gap-1.5 bg-white hover:bg-[#efebe9] border-[4px] border-[#3e2723] text-[#3e2723] font-bold py-2.5 px-3 rounded-none text-lg active:translate-y-[2px] cursor-pointer transition-all shadow-[3px_3px_0px_0px_#3e2723]"
            id="btn-play-again"
          >
            <RotateCcw className="w-5 h-5 text-[#3e2723]" />
            <span>CHƠI LẠI</span>
          </button>

          <button
            type="button"
            onClick={onViewLeaderboard}
            className="flex items-center justify-center gap-1.5 bg-[#ff6b00] hover:bg-[#e05a00] text-white font-bold py-2.5 px-3 rounded-none text-lg active:translate-y-[2px] border-[4px] border-[#3e2723] cursor-pointer shadow-[3px_3px_0px_0px_#3e2723] uppercase transition-all"
            id="btn-view-rankings"
          >
            <Trophy className="w-5 h-5 text-white" />
            <span>XẾP HẠNG</span>
          </button>
        </div>

        {/* Nút chia sẻ copy link */}
        <button
          type="button"
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 bg-[#efebe9] hover:bg-[#d7ccc8] border-[4px] border-[#3e2723] text-[#3e2723] font-bold py-3.5 px-4 rounded-none text-sm active:translate-y-[2px] cursor-pointer shadow-[4px_4px_0px_0px_rgba(62,39,35,0.45)] transition-all uppercase"
          id="btn-share-copy"
        >
          {copied ? (
            <>
              <CheckCheck className="w-5 h-5 text-[#2e7d32]" />
              <span className="text-[#2e7d32] font-bold">ĐÃ SAO CHÉP LINK & LỜI MỜI GIEO HẠT!</span>
            </>
          ) : (
            <>
              <Share2 className="w-5 h-5 text-[#d84315] animate-pulse" />
              <span>RỦ THÊM ĐỒNG ĐỘI TRỒNG CÂY 🌳</span>
            </>
          )}
        </button>
      </motion.div>
    </motion.div>
  );
}
