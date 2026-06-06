/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, AlertTriangle, Sparkles, CheckCircle2, HelpCircle } from 'lucide-react';
import { TargetWord, GridCell, PlayerInfo } from '../types';
import { generateGame, checkSelectionLine } from '../utils/gameEngine';

// ==========================================
// STARDEW VALLEY ART DIRECTION RETRO PIXEL COMPONENTS
// ==========================================

// Cozy pixelated sprout (1st word)
const SproutClean = () => (
  <svg viewBox="0 0 16 16" className="w-[85%] h-[85%] absolute bottom-0 left-1/2 -translate-x-1/2 z-0 opacity-90 select-none" style={{ imageRendering: 'pixelated' }}>
    {/* Stem */}
    <rect x="7" y="8" width="2" height="8" fill="#55a630" />
    <rect x="8" y="9" width="1" height="7" fill="#2b9348" />
    {/* Left Leaf */}
    <rect x="4" y="6" width="3" height="2" fill="#80b918" />
    <rect x="5" y="4" width="2" height="2" fill="#aacc00" />
    {/* Right Leaf */}
    <rect x="9" y="5" width="3" height="2" fill="#38b000" />
    <rect x="9" y="3" width="2" height="2" fill="#007200" />
  </svg>
);

// Cozy pixelated orange flower (2nd word)
const PixelOrangeFlower = () => (
  <svg viewBox="0 0 16 16" className="w-[85%] h-[85%] absolute bottom-0 left-1/2 -translate-x-1/2 z-0 opacity-90 select-none" style={{ imageRendering: 'pixelated' }}>
    {/* Stem */}
    <rect x="7" y="10" width="2" height="6" fill="#38b000" />
    {/* Leaves */}
    <rect x="5" y="12" width="2" height="2" fill="#007200" />
    <rect x="9" y="11" width="2" height="2" fill="#80b918" />
    {/* Flower Base */}
    <rect x="6" y="6" width="4" height="4" fill="#ff7043" />
    <rect x="7" y="5" width="2" height="6" fill="#f4511e" />
    {/* Yellow Center */}
    <rect x="7" y="7" width="2" height="2" fill="#ffeb3b" />
  </svg>
);

// Cozy pixelated tiny pine tree (3rd word)
const PixelPineTree = () => (
  <svg viewBox="0 0 16 16" className="w-[85%] h-[85%] absolute bottom-0 left-1/2 -translate-x-1/2 z-0 opacity-90 select-none" style={{ imageRendering: 'pixelated' }}>
    {/* Trunk */}
    <rect x="7" y="11" width="2" height="5" fill="#4e342e" />
    {/* Green Layers */}
    <rect x="4" y="9" width="8" height="3" fill="#1b5e20" />
    <rect x="5" y="7" width="6" height="3" fill="#2e7d32" />
    <rect x="6" y="4" width="4" height="3" fill="#388e3c" />
    <rect x="7" y="1" width="2" height="3" fill="#4caf50" />
    {/* Shading */}
    <rect x="8" y="9" width="4" height="2" fill="#0c4a12" />
    <rect x="8" y="7" width="3" height="2" fill="#145217" />
    <rect x="8" y="4" width="2" height="2" fill="#1b5e20" />
  </svg>
);

// Cozy pixelated blue daisy (4th word)
const PixelBlueDaisy = () => (
  <svg viewBox="0 0 16 16" className="w-[85%] h-[85%] absolute bottom-0 left-1/2 -translate-x-1/2 z-0 opacity-90 select-none" style={{ imageRendering: 'pixelated' }}>
    {/* Stem */}
    <rect x="7" y="9" width="2" height="7" fill="#38b000" />
    {/* Petals */}
    <rect x="5" y="7" width="6" height="2" fill="#4fc3f7" />
    <rect x="7" y="5" width="2" height="6" fill="#0288d1" />
    <rect x="6" y="6" width="4" height="4" fill="#29b6f6" />
    {/* Center */}
    <rect x="7" y="7" width="2" height="2" fill="#ffffff" />
  </svg>
);

// Cozy pixelated clover for finalized win board
const PixelClover = () => (
  <svg viewBox="0 0 16 16" className="w-[60%] h-[60%] absolute bottom-1 left-1/2 -translate-x-1/2 z-0 opacity-75 select-none" style={{ imageRendering: 'pixelated' }}>
    <rect x="7" y="8" width="2" height="8" fill="#1b5e20" />
    <rect x="5" y="6" width="3" height="3" fill="#4caf50" />
    <rect x="8" y="6" width="3" height="3" fill="#2e7d32" />
    <rect x="7" y="4" width="2" height="2" fill="#81c784" />
  </svg>
);

// Pixel checkmark replacing default Lucide symbols
const PixelCheck = () => (
  <svg viewBox="0 0 16 16" className="w-4 h-4 fill-[#2e7d32]" style={{ imageRendering: 'pixelated' }}>
    <path d="M13.5 3.5 L15 5 L6.5 13.5 L1 8 L2.5 6.5 L6.5 10.5 Z" />
  </svg>
);

// Silhouette of pixel hills for the background of sun clock
const PixelHills = () => (
  <div className="absolute bottom-0 left-0 right-0 h-5 z-10 select-none pointer-events-none" style={{ imageRendering: 'pixelated' }}>
    <svg viewBox="0 0 120 16" preserveAspectRatio="none" className="w-full h-full">
      {/* Layer 1: dark green mountains */}
      <path d="M0 16 V10 L15 6 L30 11 L45 2 L65 12 L85 4 L100 9 L120 4 V16 Z" fill="#1b5e20" />
      {/* Layer 2: lighter forest outline */}
      <path d="M0 16 V12 L10 9 L25 13 L40 5 L55 11 L75 7 L95 12 L110 8 L120 10 V16 Z" fill="#2e7d32" opacity="0.6" />
    </svg>
  </div>
);

// Helper function to map word target match to pixelated plant sprout component
const renderPlantForWordId = (wordId: number | string) => {
  const idStr = String(wordId);
  if (idStr.includes('1') || idStr === '0') return <SproutClean />;
  if (idStr.includes('2') || idStr === '1') return <PixelOrangeFlower />;
  if (idStr.includes('3') || idStr === '2') return <PixelPineTree />;
  return <PixelBlueDaisy />;
};

interface GameViewProps {
  player: PlayerInfo;
  onFinishGame: (params: {
    diem: number;
    soTuTimDuoc: number;
    hoanThanh: boolean;
    thoiGianConLai: number;
  }) => void;
}

export default function GameView({ player, onFinishGame }: GameViewProps) {
  // Trọng tâm dữ liệu game
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [targets, setTargets] = useState<TargetWord[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 120 giây theo yêu cầu

  // Quản lý trạng thái tương tác lựa chọn chữ
  const [isDragging, setIsDragging] = useState(false);
  const [startCell, setStartCell] = useState<{ r: number; c: number } | null>(null);
  const [currentCell, setCurrentCell] = useState<{ r: number; c: number } | null>(null);
  
  // Hỗ trợ chế độ chọn bằng 2 lần nhấp (Click ô đầu - Ô cuối)
  const [firstClickedCell, setFirstClickedCell] = useState<{ r: number; c: number } | null>(null);

  // Lưu trữ danh sách tọa độ đang chọn hiện tại trong quá trình kéo
  const [activeSelectionCoords, setActiveSelectionCoords] = useState<[number, number][]>([]);

  // Lưu trữ vĩnh viễn các tọa độ đã được tìm thấy đúng để tô màu xanh lá cây
  const [highlightedCoords, setHighlightedCoords] = useState<{ [key: string]: string }>({}); // "r_c": "colorCode"
  
  // Trạng thái trồi điểm số bay bay (+25 điểm) để giải trí cực cao
  const [floatingPoints, setFloatingPoints] = useState<{ id: number; r: number; c: number; text: string }[]>([]);
  const floatIdCounter = useRef(0);

  // Bảng lưới DOM container để tính toán tọa độ touch drag trên mobile
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Khởi động ván đấu
  useEffect(() => {
    const { grid: initialGrid, targets: initialTargets } = generateGame(12);
    setGrid(initialGrid);
    setTargets(initialTargets);
  }, []);

  // Bộ đếm ngược thời gian
  useEffect(() => {
    if (timeLeft <= 0) {
      // Hết giờ -> Kết thúc game
      handleGameOver(false, 0);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Kiểm tra điều kiện thắng tức thì khi cập nhật số từ tìm fount
  useEffect(() => {
    if (targets.length > 0 && targets.every(t => t.found)) {
      // Tìm đủ 4 từ -> Thắng cuộc xuất sắc!
      const timeBonus = timeLeft * 2;
      const finalScore = 100 + timeBonus;
      
      // Chờ một chút để người chơi tận hưởng cảm xúc chiến thắng
      const delay = setTimeout(() => {
        handleGameOver(true, finalScore);
      }, 1000);

      return () => clearTimeout(delay);
    }
  }, [targets]);

  // Tính toán đường kéo trực tiếp khi startCell & currentCell thay đổi
  useEffect(() => {
    if (startCell && currentCell) {
      const { isValid, coords } = checkSelectionLine(startCell.r, startCell.c, currentCell.r, currentCell.c);
      if (isValid) {
        setActiveSelectionCoords(coords);
      } else {
        // Nếu chệch hướng, chỉ giữ lại ô đầu tiên
        setActiveSelectionCoords([[startCell.r, startCell.c]]);
      }
    } else {
      setActiveSelectionCoords([]);
    }
  }, [startCell, currentCell]);

  // Hàm kết thúc ván đấu
  const handleGameOver = (isCompleted: boolean, finalScoreOverride?: number) => {
    const foundCount = targets.filter(t => t.found).length;
    let finalScore = finalScoreOverride !== undefined ? finalScoreOverride : (foundCount * 25);
    
    onFinishGame({
      diem: finalScore,
      soTuTimDuoc: foundCount,
      hoanThanh: isCompleted,
      thoiGianConLai: timeLeft
    });
  };

  /**
   * Trích xuất chuỗi chữ cái từ danh sách tọa độ ô
   */
  const getWordFromCoords = (coords: [number, number][]): string => {
    return coords.map(([r, c]) => grid[r]?.[c]?.char || '').join('').normalize('NFC').toUpperCase();
  };

  /**
   * Đánh giá xem đường thẳng vừa chọn có khớp với bất kỳ từ khóa nào chưa tìm thấy không
   */
  const evaluateSelection = (coords: [number, number][]) => {
    if (coords.length === 0) return;

    const spelledForward = getWordFromCoords(coords).normalize('NFC').toUpperCase();
    const spelledBackward = spelledForward.split('').reverse().join('').normalize('NFC').toUpperCase();

    // Tìm từ khóa chưa được tìm thấy
    const matchedTarget = targets.find(target => {
      const normalizedTargetText = (target.text || '').normalize('NFC').toUpperCase();
      return !target.found && (normalizedTargetText === spelledForward || normalizedTargetText === spelledBackward);
    });

    if (matchedTarget) {
      // 1. Ghi nhận từ tìm thấy
      setTargets(prev => prev.map(t => t.id === matchedTarget.id ? { ...t, found: true } : t));
      
      // 2. Cộng điểm
      setScore(prev => prev + 25);

      // Thêm điểm bay bay tại tọa độ kết thúc
      const endC = coords[coords.length - 1];
      if (endC) {
        floatIdCounter.current++;
        setFloatingPoints(prev => [...prev, {
          id: floatIdCounter.current,
          r: endC[0],
          c: endC[1],
          text: "+25"
        }]);
      }

      // 3. Tô màu cố định cho các ô này (Sử dụng bảng màu ngọc bích sẫm mượt mà theo style)
      const newHighlights = { ...highlightedCoords };
      coords.forEach(([r, c]) => {
        newHighlights[`${r}_${c}`] = 'bg-leaf text-white font-bold shadow-xs border-leaf';
      });
      setHighlightedCoords(newHighlights);

      // Cập nhật isFound trong lưới chữ cái
      setGrid(prev => {
        const newGrid = prev.map(row => row.map(cell => ({ ...cell })));
        coords.forEach(([r, c]) => {
          if (newGrid[r]?.[c]) {
            newGrid[r][c].isFound = true;
            if (!newGrid[r][c].foundWordIds.includes(matchedTarget.id)) {
              newGrid[r][c].foundWordIds.push(matchedTarget.id);
            }
          }
        });
        return newGrid;
      });
    }
  };

  // --- MOUSE EVENTS ---
  const handleCellMouseDown = (r: number, c: number) => {
    // Đảo ngược click đầu cuối nếu đã chọn first click cũ
    if (firstClickedCell) {
      const { isValid, coords } = checkSelectionLine(firstClickedCell.r, firstClickedCell.c, r, c);
      if (isValid && coords.length > 1) {
        evaluateSelection(coords);
      }
      setFirstClickedCell(null);
      setIsDragging(false);
      setStartCell(null);
      setCurrentCell(null);
    } else {
      setIsDragging(true);
      setStartCell({ r, c });
      setCurrentCell({ r, c });
    }
  };

  const handleCellMouseEnter = (r: number, c: number) => {
    if (isDragging && startCell) {
      setCurrentCell({ r, c });
    }
  };

  const handleMouseUp = () => {
    if (isDragging && startCell && currentCell) {
      const { isValid, coords } = checkSelectionLine(startCell.r, startCell.c, currentCell.r, currentCell.c);
      if (isValid) {
        evaluateSelection(coords);
      }
    }
    // Chuyển sang lưu trữ firstClickedCell để hỗ trợ mode nhấp tap đôi
    if (isDragging && startCell && currentCell && startCell.r === currentCell.r && startCell.c === currentCell.c) {
      setFirstClickedCell({ r: startCell.r, c: startCell.c });
    } else {
      setFirstClickedCell(null);
    }
    setIsDragging(false);
    setStartCell(null);
    setCurrentCell(null);
  };

  // --- TOUCH EVENTS FOR SMARTMOBILE ---
  // Tìm ô chữ nằm bên dưới điểm chạm ngón tay dựa trên tọa độ màn hình
  const getGridCoordsFromTouch = (touchX: number, touchY: number): { r: number; c: number } | null => {
    if (!gridContainerRef.current) return null;
    
    // Tìm tất cả các phần tử con có data-row và data-col
    const elements = document.elementsFromPoint(touchX, touchY);
    for (const el of elements) {
      const rowAttr = el.getAttribute('data-row');
      const colAttr = el.getAttribute('data-col');
      if (rowAttr !== null && colAttr !== null) {
        return {
          r: parseInt(rowAttr, 10),
          c: parseInt(colAttr, 10)
        };
      }
    }
    return null;
  };

  const handleTouchStart = (e: React.TouchEvent, r: number, c: number) => {
    setIsDragging(true);
    setStartCell({ r, c });
    setCurrentCell({ r, c });
    setFirstClickedCell(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !startCell) return;
    const touch = e.touches[0];
    if (touch) {
      const coords = getGridCoordsFromTouch(touch.clientX, touch.clientY);
      if (coords) {
        setCurrentCell(coords);
      }
    }
  };

  const handleTouchEnd = () => {
    if (isDragging && startCell && currentCell) {
      const { isValid, coords } = checkSelectionLine(startCell.r, startCell.c, currentCell.r, currentCell.c);
      if (isValid) {
        evaluateSelection(coords);
      }
    }
    setIsDragging(false);
    setStartCell(null);
    setCurrentCell(null);
  };

  // Quản lý dọn dẹp các điểm bay bay
  useEffect(() => {
    if (floatingPoints.length > 0) {
      const timer = setTimeout(() => {
        setFloatingPoints(prev => prev.slice(1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [floatingPoints]);

  // Kiểm tra xem tọa độ ô có nằm trong danh sách đang được chọn kéo hay không
  const isSelectedActive = (r: number, c: number): boolean => {
    return activeSelectionCoords.some(([sr, sc]) => sr === r && sc === c);
  };

  // Kiểm tra xem ô có đang là ô click đầu tiên trong chế độ 2-taps không
  const isFirstClicked = (r: number, c: number): boolean => {
    return firstClickedCell?.r === r && firstClickedCell?.c === c;
  };

  // Kiểm tra trạng thái chiến thắng (tìm đủ 4 từ) để làm xanh tốt mảnh vườn
  const allFound = targets.length > 0 && targets.every(t => t.found);

  // Phần trăm tiến độ thời gian còn lại
  const timePercent = (timeLeft / 120) * 100;

  // Tính toán vị trí mặt trời dựa vào thời gian còn lại (120s down to 0)
  const progressRatio = (120 - timeLeft) / 120;
  const sunTop = 10 + progressRatio * 75; // Sinks down behind mountains
  const sunLeft = 10 + progressRatio * 75; // Sinks from top-left to bottom-right across the sky

  // Đổi màu mặt trời theo hoàng hôn
  const sunMainColor = timeLeft <= 15 ? "#ff3d00" : timeLeft <= 45 ? "#ff9100" : "#ffea00";
  const sunInnerColor = timeLeft <= 15 ? "#dd2c00" : timeLeft <= 45 ? "#ff3700" : "#ffb300";

  // Thay đổi bầu trời dựa vào thời gian trôi qua
  let skyGradient = "from-[#4fc3f7] to-[#0288d1]"; // Ban ngày xanh trong
  if (timeLeft <= 15) {
    skyGradient = "from-[#ff5722] to-[#b71c1c]"; // Hoàng hôn đỏ cam rực rỡ
  } else if (timeLeft <= 45) {
    skyGradient = "from-[#ffa726] to-[#fb8c00]"; // Chiều tà vàng cam
  } else if (timeLeft <= 85) {
    skyGradient = "from-[#81d4fa] to-[#0288d1]"; // Nắng dịu nhẹ
  }

  return (
    <div 
      className={`w-full flex flex-col select-none p-1.5 transition-colors duration-1000 ${
        timeLeft <= 15 ? "bg-[#ffab91]/20 border-2 border-dashed border-[#ff7043]/30" : ""
      }`} 
      id="game-view-container"
      onMouseUp={handleMouseUp}
      onTouchEnd={handleTouchEnd}
    >
      {/* Khối Thông tin người chơi & Điểm ở trên - Thiết kế bảng gỗ pixel */}
      <div 
        className="flex items-center justify-between bg-[#f4e7c9] border-4 border-[#5d4037] p-4 shadow-[4px_4px_0px_0px_rgba(62,39,35,0.45)] mb-3 font-pixel text-[#3e2723] rounded-none" 
        id="game-dashboard-header"
      >
        <div className="flex flex-col">
          <span className="text-xs uppercase font-extrabold tracking-wider opacity-85 leading-none">NÔNG DÂN</span>
          <span className="text-xl font-black truncate max-w-[180px] leading-tight text-[#5d4037]">{player.hoTen}</span>
        </div>
        
        {/* Điểm số */}
        <div className="bg-[#e7d4b2] border-2 border-[#5d4037] px-4 py-1.5 text-center flex flex-col items-center min-w-[95px] shadow-[2px_2px_0px_0px_rgba(62,39,35,0.25)]">
          <span className="text-[11px] uppercase font-bold tracking-wider leading-none opacity-80">ĐIỂM SỐ</span>
          <span className="text-2xl font-black text-[#d84315] animate-pulse leading-none mt-1">{score}</span>
        </div>
      </div>

      {/* THIẾT KẾ ĐỒNG HỒ MẶT TRỜI LẶN & THANH GỖ PIXEL CẠN DẦN */}
      <div 
        className="bg-[#d7ccc8] border-4 border-[#5d4037] p-3 shadow-[4px_4px_0px_0px_rgba(62,39,35,0.45)] mb-3 flex flex-col gap-3 font-pixel text-[#3e2723] rounded-none" 
        id="game-timer-card"
      >
        {/* Màn hình bầu trời pixel giả lập chu kỳ thời gian */}
        <div className={`relative w-full h-[76px] overflow-hidden border-2 border-[#5d4037] bg-gradient-to-b ${skyGradient} transition-all duration-1000 shadow-inner`}>
          
          {/* Mấy hạt mây dẹt pixel */}
          <div className="absolute top-2 left-6 w-8 h-2 bg-white/40 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]" />
          <div className="absolute top-4 right-10 w-12 h-3 bg-white/30 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)]" />
          
          {/* ĐỒNG HỒ MẶT TRỜI LẶN DẦN */}
          <div 
            className="absolute transition-all duration-1000 ease-linear pointer-events-none"
            style={{
              top: `${sunTop}%`,
              left: `${sunLeft}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <svg viewBox="0 0 16 16" className="w-[38px] h-[38px] drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]" style={{ imageRendering: 'pixelated' }}>
              <rect x="5" y="1" width="6" height="14" fill={sunMainColor} />
              <rect x="1" y="5" width="14" height="6" fill={sunMainColor} />
              <rect x="3" y="3" width="10" height="10" fill={sunMainColor} />
              {/* Core */}
              <rect x="6" y="3" width="4" height="10" fill={sunInnerColor} />
              <rect x="3" y="6" width="10" height="4" fill={sunInnerColor} />
              <rect x="5" y="5" width="6" height="6" fill={sunInnerColor} />
              {/* Highlight */}
              <rect x="5" y="4" width="2" height="2" fill="#ffffff" opacity="0.8" />
            </svg>
          </div>

          {/* Dòng núi pixel xanh che chở ở chân trời */}
          <PixelHills />

          {/* Góc thông báo nhỏ nhấp nháy khi ngả hoàng hôn */}
          {timeLeft <= 15 && (
            <div className="absolute top-1.5 right-1.5 bg-[#bf360c] text-white border border-[#ffeb3b] px-1.5 py-0.5 text-[10px] font-black tracking-wider animate-bounce select-none">
              HOÀNG HÔN! VỘI LÊN! ⏳
            </div>
          )}
        </div>

        {/* Thông tin chữ hiển thị */}
        <div className="flex items-center justify-between text-base font-black">
          <div className="flex items-center gap-1">
            <Timer className={`w-4 h-4 ${timeLeft <= 15 ? 'text-red-600 animate-spin' : 'text-[#2e7d32]'}`} />
            <span>Thời gian vườn ươm:</span>
          </div>
          <div className={`text-lg font-extrabold flex items-center gap-1.5 ${timeLeft <= 15 ? 'text-red-600 animate-pulse' : 'text-[#1b5e20]'}`}>
            {timeLeft <= 15 && <AlertTriangle className="w-4 h-4 text-red-600" />}
            <span>{timeLeft} giây</span>
          </div>
        </div>

        {/* THANH GỖ PIXEL CẠN DẦN (Progress bar stamina) */}
        <div className="w-full h-6 bg-[#3e2723] p-1 border-2 border-[#5d4037] flex items-center relative overflow-hidden shadow-inner" id="timer-progress-track">
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: `${timePercent}%` }}
            transition={{ ease: "linear", duration: 1 }}
            className={`h-full ${
              timeLeft <= 15 
                ? 'bg-gradient-to-r from-[#ff3d00] to-[#b71c1c] animate-pulse' 
                : 'bg-gradient-to-r from-[#4caf50] to-[#2e7d32]'
            } shadow-[inset_0_2px_0_rgba(255,255,255,0.45),inset_0_-2px_0_rgba(0,0,0,0.35)]`}
          />
          {/* Vạch khắc vân gỗ pixel */}
          <div className="absolute inset-y-0 left-0 right-0 flex justify-between pointer-events-none opacity-25">
            {[...Array(12)].map((_, i) => (
              <div key={`wood-grain-${i}`} className="w-[2px] h-full bg-[#1b0000]" />
            ))}
          </div>
        </div>
      </div>

      {/* LƯỚI CHỮ PIXEL MẢNH VƯỜN / LUỐNG ĐẤT COZY */}
      <div 
        className="relative bg-[#3e2723] border-[6px] border-[#5d4037] p-2 rounded-none shadow-[6px_6px_0px_0px_rgba(62,39,35,0.35)] mb-4 w-full flex items-center justify-center overflow-x-auto select-none"
        id="interactive-grid-box"
      >
        <div
          ref={gridContainerRef}
          onTouchMove={handleTouchMove}
          className="grid grid-cols-12 gap-[3px] w-full max-w-[420px] min-w-[280px] aspect-square text-center relative touch-none bg-[#1b0000]"
          id="word-grid"
        >
          {grid.map((rowArr, r) => 
            rowArr.map((cell, c) => {
              const isSelected = isSelectedActive(r, c);
              const isFirstClick = isFirstClicked(r, c);

              // Xây dựng lớp CSS pixel tùy biến hoàn toàn cho ô lưới vườn tược - KO bo góc
              let cellClass = "aspect-square select-none cursor-pointer flex items-center justify-center font-sans font-black uppercase relative transition-all duration-300 rounded-none border border-[#bcaaa4] ";

              if (isSelected) {
                // Đang chọn kéo: Highlight dạng pixel màu đỏ cam rực với viền vàng rực, vuông góc!
                cellClass += "bg-[#bf360c] text-white border-2 border-[#ffeb3b] z-20 scale-100 shadow-[0_0_10px_rgba(251,140,0,0.5)]";
              } else if (isFirstClick) {
                // Ô đầu tiên khi taptap
                cellClass += "bg-[#ffd54f] text-[#3e2723] border-4 border-[#ff8f00] z-20 animate-bounce rounded-none";
              } else if (cell.isFound || allFound) {
                // Ô đã tìm được: Nẩy cỏ xanh tố mơn mởn, nền xanh lá pixel, chữ trắng/kem
                cellClass += "bg-[#2e7d32] text-[#faf3e0] border-[#1b5e20] shadow-[inset_0_-2px_0_rgba(0,0,0,0.3)] z-10";
              } else {
                // Ô đất bình thường: Kem sáng đồng nhất, chữ nâu đậm tương phản cao
                cellClass += "bg-[#faf3e0] hover:bg-[#efe3c5] text-[#3a2a1a] shadow-[inset_0_-1.5px_0_rgba(0,0,0,0.08)]";
              }

              return (
                <div
                  key={`${r}_${c}`}
                  data-row={r}
                  data-col={c}
                  onMouseDown={() => handleCellMouseDown(r, c)}
                  onMouseEnter={() => handleCellMouseEnter(r, c)}
                  onTouchStart={(e) => handleTouchStart(e, r, c)}
                  className={cellClass}
                >
                  {/* Chữ cái nổi bật, cỡ chữ to dễ đọc không bị cắt dấu */}
                  <span className={`font-sans font-black text-[13px] xs:text-[14px] sm:text-[17px] tracking-normal select-none relative z-10 leading-normal block text-center w-full ${
                    isSelected || isFirstClick || cell.isFound || allFound
                      ? 'drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]'
                      : ''
                  }`}>
                    {cell.char}
                  </span>

                  {/* Hiệu ứng mầm non lớn dần theo từ vựng nảy mầm */}
                  {cell.isFound && cell.foundWordIds && cell.foundWordIds.length > 0 && (
                    <motion.div 
                      key={`plant-${r}-${c}-${cell.foundWordIds[0]}`}
                      initial={{ scale: 0, y: 12 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 250, 
                        damping: 14,
                        delay: (r + c) * 0.02 // Stagger nảy mầm lấp lánh tự nhiên
                      }}
                      className="absolute inset-x-0 bottom-0 top-0 flex items-center justify-center pointer-events-none z-0 opacity-40"
                    >
                      {renderPlantForWordId(cell.foundWordIds[0])}
                    </motion.div>
                  )}

                  {/* Khi hoàn thành xuất sắc 4 từ -> Cả mảnh vườn mọc cỏ ba lá mọc lá dẹt */}
                  {!cell.isFound && allFound && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 0.8 }}
                      transition={{ delay: (r + c) * 0.012 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40"
                    >
                      <PixelClover />
                    </motion.div>
                  )}
                </div>
              );
            })
          )}

          {/* Floaters số điểm bay bổng gieo mầm hạt */}
          <AnimatePresence>
            {floatingPoints.map(f => {
              const topPct = (f.r / 12) * 100;
              const leftPct = (f.c / 12) * 100;
              return (
                <motion.div
                  key={`float-${f.id}`}
                  initial={{ opacity: 1, y: 10, scale: 0.8 }}
                  animate={{ opacity: 0, y: -45, scale: 1.4 }}
                  exit={{ opacity: 0 }}
                  className="absolute pointer-events-none text-[#ffeb3b] bg-[#bf360c] border-2 border-[#ffeb3b] font-pixel text-base px-2 py-0.5 rounded-none shadow-md z-30 font-black"
                  style={{
                    top: `${topPct}%`,
                    left: `${leftPct}%`,
                  }}
                >
                  {f.text}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Hướng dẫn thao tác ấm cúng */}
      <p className="text-xs text-[#5d4037]/90 font-bold font-pixel text-center mb-3 flex items-center justify-center gap-1 leading-relaxed">
        <HelpCircle className="w-4 h-4 text-[#d84315] shrink-0" />
        <span>Gợi ý: Nhấp giữ kéo chuỗi, hoặc chọn ô đầu rồi chọn ô cuối! (Ngang/Dọc/Chéo)</span>
      </p>

      {/* DANH SÁCH TỪ VỰNG KIỂU THÙNG GỖ TẬP ĐÔNG */}
      <div className="bg-[#f4e7c9] border-4 border-[#5d4037] p-4 shadow-[4px_4px_0px_0px_rgba(62,39,35,0.45)] font-pixel text-[#3e2723] rounded-none" id="word-search-hints font-semibold">
        <h3 className="text-sm font-black text-[#5d4037] tracking-wider uppercase mb-3 text-center border-b-2 border-[#e7d4b2] pb-2">
          Hạt mầm kỳ bí cần tìm kiếm ({targets.filter(t => t.found).length}/4)
        </h3>
        
        <div className="grid grid-cols-2 gap-2" id="targets-hints-grid">
          {targets.map((word) => (
            <div
              key={word.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-none border-2 transition-all text-xs font-black uppercase tracking-wide shadow-xs ${
                word.found
                  ? 'bg-[#c8e6c9] border-[#2e7d32] text-[#1b5e20]'
                  : 'bg-[#efebe9] border-[#8d6e63] text-[#5d4037]'
              }`}
            >
              {word.found ? (
                <div className="w-4 h-4 rounded-none bg-[#2e7d32] flex items-center justify-center shrink-0">
                  <PixelCheck />
                </div>
              ) : (
                <div className="w-4 h-4 bg-[#8d6e63] border border-[#5d4037] shrink-0 flex items-center justify-center rounded-none">
                  <div className="w-1.5 h-1.5 bg-[#d84315] animate-ping opacity-75" />
                </div>
              )}
              <span className={word.found ? 'line-through text-[#1b5e20]/60 decoration-2' : ''}>
                {word.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
