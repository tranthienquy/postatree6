/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Sparkles, Sprout } from 'lucide-react';

// Cozy pixel-art pine tree SVG
const PixelIntroTree = () => (
  <svg 
    viewBox="0 0 16 16" 
    className="w-[85%] h-[85%] select-none" 
    style={{ imageRendering: 'pixelated' }}
  >
    {/* Trunk */}
    <rect x="7" y="11" width="2" height="5" fill="#8d6e63" />
    <rect x="8" y="11" width="1" height="5" fill="#5d4037" />
    
    {/* Leaves (Bottom Layer) */}
    <rect x="3" y="9" width="10" height="2" fill="#2e7d32" />
    <rect x="4" y="8" width="8" height="1" fill="#2e7d32" />
    {/* Shading/Highlights */}
    <rect x="8" y="9" width="5" height="2" fill="#1b5e20" />
    <rect x="8" y="8" width="4" height="1" fill="#1b5e20" />
    <rect x="3" y="8" width="1" height="1" fill="#81c784" />
    <rect x="4" y="9" width="1" height="1" fill="#81c784" />

    {/* Leaves (Middle Layer) */}
    <rect x="4" y="6" width="8" height="2" fill="#388e3c" />
    <rect x="5" y="5" width="6" height="1" fill="#388e3c" />
    {/* Shading/Highlights */}
    <rect x="8" y="6" width="4" height="2" fill="#2e7d32" />
    <rect x="8" y="5" width="3" height="1" fill="#2e7d32" />
    <rect x="4" y="5" width="1" height="1" fill="#a5d6a7" />
    <rect x="5" y="6" width="1" height="1" fill="#a5d6a7" />

    {/* Leaves (Top Layer) */}
    <rect x="5" y="3" width="6" height="2" fill="#4caf50" />
    <rect x="6" y="2" width="4" height="1" fill="#4caf50" />
    {/* Shading/Highlights */}
    <rect x="8" y="3" width="3" height="2" fill="#388e3c" />
    <rect x="8" y="2" width="2" height="1" fill="#388e3c" />
    <rect x="5" y="2" width="1" height="1" fill="#c8e6c9" />
    <rect x="6" y="3" width="1" height="1" fill="#c8e6c9" />

    {/* Tree Top Tip */}
    <rect x="7" y="1" width="2" height="1" fill="#81c784" />
    <rect x="8" y="1" width="1" height="1" fill="#4caf50" />
  </svg>
);

interface IntroViewProps {
  onStart: () => void;
  onViewLeaderboard: () => void;
  onViewStats: () => void;
}

export default function IntroView({ onStart, onViewLeaderboard, onViewStats }: IntroViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex flex-col flex-1 items-center justify-between py-2 text-center select-none"
      id="intro-view-container"
    >
      {/* Badge thương hiệu */}
      <div 
        className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f4e7c9] text-[#5d4037] text-[10px] sm:text-xs font-black rounded-none border-2 border-[#5d4037] shadow-[2px_2px_0px_0px_rgba(62,39,35,0.45)] mb-3 font-pixel"
        id="fe-badge"
      >
        <Sparkles className="w-3.5 h-3.5 text-accent-orange animate-pulse" />
        <span>FPT STUDENT EXPERIENCE SPACE</span>
      </div>

      {/* Main Illustration & Logo */}
      <div className="flex flex-col items-center my-auto px-4" id="intro-main-content">
        <motion.div 
          className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-white border-4 border-[#5d4037] rounded-none shadow-[4px_4px_0px_0px_rgba(62,39,35,0.35)] mb-4"
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          id="tree-logo-wrapper"
        >
          <PixelIntroTree />
        </motion.div>

        {/* Tiêu đề chính */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#5d4037] mb-1 uppercase font-pixel drop-shadow-[2px_2px_0px_rgba(62,39,35,0.15)]" id="app-title">
          POST-A-TREE
        </h1>
        <p className="text-xs sm:text-sm font-bold tracking-wider text-accent-orange uppercase mb-3 font-pixel" id="app-sub-title">
          Chiến dịch trồng cây POST-A-TREE Mùa 6
        </p>

        {/* Nội dung giới thiệu ý nghĩa */}
        <div className="max-w-md bg-[#f4e7c9] rounded-none p-3 sm:p-4 border-4 border-[#5d4037] shadow-[4px_4px_0px_0px_rgba(62,39,35,0.45)] mb-4 relative overflow-hidden" id="intro-description-card">
          <div className="absolute top-0 right-0 w-12 h-12 bg-[#81c784]/25 rounded-full blur-lg" />
          <p className="text-[#3e2723] text-[11px] sm:text-xs md:text-sm leading-relaxed font-bold font-pixel">
            Cứ 3 người chơi tham gia, FPT Student Experience Space sẽ được quy đổi thành 01 cây xanh thật 🌳 để vun trồng tại Rừng phòng hộ A Lưới - Thành phố Huế
          </p>
        </div>
      </div>

      {/* Hành động */}
      <div className="w-full max-w-sm px-4 space-y-3 mt-auto" id="intro-actions">
        <button
          type="button"
          onClick={onStart}
          className="w-full bg-[#d84315] hover:bg-[#bf360c] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(62,39,35,0.45)] text-white font-bold py-3 px-6 rounded-none shadow-[4px_4px_0px_0px_rgba(62,39,35,0.45)] text-base transition-all border-4 border-[#3e2723] pointer-events-auto cursor-pointer uppercase tracking-wider font-pixel"
          id="btn-start-game"
        >
          Bắt đầu chơi ngay
        </button>

        <div className="grid grid-cols-2 gap-2" id="bottom-intro-row">
          <button
            type="button"
            onClick={onViewLeaderboard}
            className="inline-flex items-center justify-center gap-1.5 bg-[#efebe9] hover:bg-[#d7ccc8] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(62,39,35,0.35)] border-4 border-[#5d4037] text-[#5d4037] py-2 px-1.5 rounded-none font-pixel text-[10px] sm:text-xs transition-all shadow-[4px_4px_0px_0px_rgba(62,39,35,0.35)] pointer-events-auto cursor-pointer uppercase font-bold"
            id="btn-view-leaderboard-link"
          >
            <Trophy className="w-3.5 h-3.5 text-accent-orange" />
            <span>Xếp hạng</span>
          </button>

          <button
            type="button"
            onClick={onViewStats}
            className="inline-flex items-center justify-center gap-1.5 bg-[#efebe9] hover:bg-[#d7ccc8] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(62,39,35,0.35)] border-4 border-[#5d4037] text-[#5d4037] py-2 px-1.5 rounded-none font-pixel text-[10px] sm:text-xs transition-all shadow-[4px_4px_0px_0px_rgba(62,39,35,0.35)] pointer-events-auto cursor-pointer uppercase font-bold"
            id="btn-view-stats-link"
          >
            <Sprout className="w-3.5 h-3.5 text-[#2e7d32]" />
            <span>Thống kê</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
