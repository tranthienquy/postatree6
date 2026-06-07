/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ClipboardList, Info, HelpCircle } from 'lucide-react';
import { PlayerInfo } from '../types';

// Danh sách Đơn vị & Cơ sở chi tiết theo phân cấp ban tổ chức cung cấp
const SCHOOL_DATA: { [key: string]: string[] } = {
  "Trường Đại học FPT": [
    "Hà Nội",
    "Đà Nẵng",
    "TP. HCM",
    "Cần Thơ",
    "Gia Lai"
  ],
  "Greenwich Việt Nam": [
    "Hà Nội",
    "Đà Nẵng",
    "TP. HCM",
    "Cần Thơ"
  ],
  "Swinburne Việt Nam": [
    "Hà Nội",
    "Đà Nẵng",
    "TP. HCM",
    "Cần Thơ"
  ],
  "Cao đẳng FPT Polytechnic": [
    "Hà Nội",
    "Thái Nguyên",
    "Hải Phòng",
    "Hà Nam",
    "Thanh Hoá",
    "TP. HCM",
    "Đà Nẵng",
    "Quy Nhơn",
    "Đắk Lắk",
    "Đồng Nai",
    "Cần Thơ",
    "Phú Thọ",
    "Huế"
  ],
  "Viện Đào tạo Quốc tế FPT": [
    "Hà Nội",
    "TP. HCM",
    "Đà Nẵng",
    "Cần Thơ"
  ],
  "Viện Quản trị & Công nghệ FSB": [
    "Hà Nội",
    "Cần Thơ",
    "Đà Nẵng",
    "TP. HCM"
  ],
  "Hệ thống Trường Phổ thông FPT": [
    "Trường Tiểu học và Trung học Cơ sở FPT Cầu Giấy",
    "Trường Trung học Phổ thông FPT Hà Nội",
    "Trường Tiểu học - Trung học cơ sở FPT Đà Nẵng",
    "Trường Trung học phổ thông FPT Đà Nẵng",
    "Trường Trung học Phổ thông FPT Cần Thơ",
    "Trường THPT FPT Quy Nhơn",
    "Trường THCS và THPT FPT Hải Phòng",
    "Trường Phổ thông liên cấp FPT Bắc Ninh",
    "Trường Tiểu học, THCS và THPT FPT Thanh Hoá",
    "Trường Phổ thông Liên cấp FPT Hà Nam",
    "Trường Tiểu học, THCS và THPT FPT Bắc Giang",
    "Trường THPT FPT Tây Hà Nội",
    "Trường Tiểu học, THCS và THPT FPT Huế",
    "Trường Tiểu học, THCS và THPT FPT Long Vân",
    "Trường Tiểu học, THCS và THPT FPT Vinh",
    "Trường Tiểu học, THCS và THPT FPT Hậu Giang",
    "Trường Tiểu học, THCS và THPT FPT Sóc Trăng",
    "Trường Tiểu học, THCS và THPT FPT Millennia"
  ],
  "Chương trình Phổ thông Cao đẳng": [
    "Hà Nội",
    "Thái Nguyên",
    "Bắc Giang",
    "Hải Phòng",
    "Hà Nam",
    "Vĩnh Phúc",
    "Nam Định",
    "Quảng Ninh",
    "Thanh Hoá",
    "Huế",
    "Đà Nẵng",
    "Bình Định",
    "Quảng Nam",
    "Nghệ An",
    "Tây Nguyên",
    "Nha Trang",
    "Gia Lai",
    "Bình Dương",
    "Bình Phước",
    "Đồng Nai",
    "Cần Thơ",
    "TP. HCM",
    "Bà Rịa Vũng Tàu",
    "Cà Mau",
    "Tây Ninh"
  ],
  "Cao đẳng Anh quốc BTEC FPT": [
    "Hà Nội",
    "TP. HCM",
    "Cần Thơ",
    "Đà Nẵng"
  ],
  "Melbourne Polytechnic Việt Nam": [
    "Hà Nội",
    "TP. HCM",
    "Cần Thơ",
    "Đà Nẵng"
  ],
  "Asia Việt Nam": [
    "Hà Nội",
    "TP. HCM"
  ],
  "Metropolia Việt Nam": [
    "Hà Nội"
  ],
  "Gachon Việt Nam": [
    "Hà Nội",
    "TP. HCM"
  ],
  "Knu Việt Nam": [
    "Hà Nội",
    "Đà Nẵng",
    "TP. HCM",
    "Cần Thơ"
  ]
};

interface FormViewProps {
  onBack: () => void;
  onSubmit: (info: PlayerInfo) => void;
}

export default function FormView({ onBack, onSubmit }: FormViewProps) {
  // Quản lý state cho form tuyển dụng/đăng ký
  const [hoTen, setHoTen] = useState('');
  const [email, setEmail] = useState('');
  
  // Tự điền Đơn vị & lựa chọn dropdown Cơ sở
  const [donVi, setDonVi] = useState('Trường Đại học FPT');
  const [coSo, setCoSo] = useState('Hà Nội');

  const [agreed, setAgreed] = useState(false);

  // Quản lý thông báo lỗi dạng inline
  const [errors, setErrors] = useState<{
    hoTen?: string;
    email?: string;
    donVi?: string;
  }>({});

  // Tự động tải trước thông tin người chơi từ localStorage nếu có
  useEffect(() => {
    try {
      const savedInfo = localStorage.getItem('post_a_tree_player');
      if (savedInfo) {
        const parsed = JSON.parse(savedInfo);
        if (parsed.hoTen) setHoTen(parsed.hoTen);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.donVi) {
          const parts = parsed.donVi.split(' - ');
          if (parts.length > 1) {
            const savedDonVi = parts[0].trim();
            const savedCoSo = parts[1].trim();
            if (SCHOOL_DATA[savedDonVi]) {
              setDonVi(savedDonVi);
              if (SCHOOL_DATA[savedDonVi].includes(savedCoSo)) {
                setCoSo(savedCoSo);
              } else {
                setCoSo(SCHOOL_DATA[savedDonVi][0]);
              }
            } else {
              setDonVi('Trường Đại học FPT');
              setCoSo('Hà Nội');
            }
          } else {
            const savedDonVi = parsed.donVi.trim();
            if (SCHOOL_DATA[savedDonVi]) {
              setDonVi(savedDonVi);
              setCoSo(SCHOOL_DATA[savedDonVi][0]);
            } else {
              setDonVi('Trường Đại học FPT');
              setCoSo('Hà Nội');
            }
          }
        } else {
          setDonVi('Trường Đại học FPT');
          setCoSo('Hà Nội');
        }
      } else {
        setDonVi('Trường Đại học FPT');
        setCoSo('Hà Nội');
      }
    } catch (e) {
      console.error("Lỗi khi đọc cache người chơi:", e);
      setDonVi('Trường Đại học FPT');
      setCoSo('Hà Nội');
    }
  }, []);

  // Cập nhật Cơ sở phù hợp với Đơn vị đã chọn
  useEffect(() => {
    if (donVi && SCHOOL_DATA[donVi]) {
      const availableCampuses = SCHOOL_DATA[donVi];
      if (!availableCampuses.includes(coSo)) {
        setCoSo(availableCampuses[0] || 'Hà Nội');
      }
    }
  }, [donVi, coSo]);

  // Hàm kiểm tra định dạng dữ liệu (Validate)
  const validateForm = (showErrorsOnlyOnSubmit = false) => {
    const newErrors: typeof errors = {};

    // Validate Họ tên
    if (!hoTen.trim()) {
      newErrors.hoTen = 'Vui lòng nhập họ và tên của bạn.';
    } else if (hoTen.trim().length < 2) {
      newErrors.hoTen = 'Họ và tên quá ngắn, vui lòng kiểm tra lại.';
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập địa chỉ Email của bạn.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Địa chỉ email không chính xác (Thiếu @ hoặc sai định dạng).';
    }

    // Validate Đơn vị (bắt buộc nhập)
    if (!donVi.trim()) {
      newErrors.donVi = 'Vui lòng ghi rõ thông tin đơn vị học tập/công tác của bạn.';
    } else if (donVi.trim().length < 2) {
      newErrors.donVi = 'Vui lòng nhập tên đơn vị chi tiết hơn.';
    }

    if (!showErrorsOnlyOnSubmit) {
      setErrors(newErrors);
    }
    
    // Form hợp lệ khi không còn lỗi nào xuất hiện và đã tích đồng ý bảo mật
    return Object.keys(newErrors).length === 0 && agreed;
  };

  // Chạy linter validate nhỏ khi thay đổi giá trị để tối ưu UI
  useEffect(() => {
    validateForm(true);
  }, [hoTen, email, donVi, coSo, agreed]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm(false)) {
      onSubmit({
        hoTen: hoTen.trim(),
        soDienThoai: '',
        email: email.trim(),
        donVi: `${donVi.trim()} - ${coSo}`,
        vaiTro: 'Thành viên'
      });
    }
  };

  const isFormValid = hoTen.trim() !== '' && 
                      email.trim() !== '' && 
                      donVi.trim() !== '' && 
                      agreed;

  return (
    <motion.div
      initial={{ opacity: 0, x: 25 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -25 }}
      className="w-full flex flex-col select-none font-pixel"
      id="form-view-container"
    >
      {/* Thanh Header Quay Lại */}
      <div className="flex items-center gap-2 mb-2" id="form-header">
        <button
          type="button"
          onClick={onBack}
          className="p-1 px-1.5 bg-[#efebe9] hover:bg-[#d7ccc8] text-[#5d4037] border-4 border-[#5d4037] shadow-[2px_2px_0px_0px_rgba(62,39,35,0.45)] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(62,39,35,0.45)] transition-all cursor-pointer rounded-none"
          id="btn-back-to-intro"
          title="Quay lại"
        >
          <ChevronLeft className="w-4 h-4 pointer-events-none" />
        </button>
        <div>
          <h2 className="text-lg sm:text-xl font-black text-[#5d4037] uppercase tracking-tight drop-shadow-[1px_1px_0px_rgba(62,39,35,0.1)]" id="form-title">
            Thông tin người chơi
          </h2>
        </div>
      </div>

      {/* Form Đăng ký */}
      <form onSubmit={handleSubmit} className="space-y-2.5 max-w-md mx-auto w-full flex-1 overflow-y-auto pr-1" id="player-form">
        
        {/* Trường: Họ tên */}
        <div id="wrapper-fullname">
          <label htmlFor="fullname" className="block text-sm font-black text-[#5d4037] uppercase tracking-wider mb-1">
            Họ và tên <span className="text-[#d84315]">*</span>
          </label>
          <input
            id="fullname"
            type="text"
            required
            value={hoTen}
            onChange={(e) => setHoTen(e.target.value)}
            placeholder="Ví dụ: Nguyễn Văn A"
            className={`w-full px-3.5 py-2.5 bg-white border-4 border-[#5d4037] rounded-none text-[#3e2723] focus:ring-0 outline-none shadow-[2px_2px_0px_0px_rgba(62,39,35,0.25)] focus:shadow-[2px_2px_0px_0px_rgba(62,39,35,0.45)] transition-all placeholder-[#a1887f] ${
              errors.hoTen ? 'border-[#d84315] focus:border-[#d84315]' : 'border-[#5d4037]'
            }`}
          />
          {errors.hoTen && (
            <p className="text-xs text-[#d84315] font-black mt-1 flex items-center gap-1 animate-pulse" id="error-fullname">
              <span className="w-1.5 h-1.5 bg-[#d84315] inline-block" />
              {errors.hoTen}
            </p>
          )}
        </div>

        {/* Trường: Email */}
        <div id="wrapper-email">
          <label htmlFor="email" className="block text-sm font-black text-[#5d4037] uppercase tracking-wider mb-1">
            Email liên hệ <span className="text-[#d84315]">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ví dụ: anvd@fe.edu.vn"
            className={`w-full px-3.5 py-2.5 bg-white border-4 border-[#5d4037] rounded-none text-[#3e2723] focus:ring-0 outline-none shadow-[2px_2px_0px_0px_rgba(62,39,35,0.25)] focus:shadow-[2px_2px_0px_0px_rgba(62,39,35,0.45)] transition-all placeholder-[#a1887f] ${
              errors.email ? 'border-[#d84315] focus:border-[#d84315]' : 'border-[#5d4037]'
            }`}
          />
          {errors.email && (
            <p className="text-xs text-[#d84315] font-black mt-1 flex items-center gap-1 animate-pulse" id="error-email">
              <span className="w-1.5 h-1.5 bg-[#d84315] inline-block" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Trường: Đơn vị đang thuộc về dòng Giáo dục FPT */}
        <div className="bg-[#f4e7c9] border-4 border-[#5d4037] p-2.5 shadow-[4px_4px_0px_0px_rgba(62,39,35,0.45)] rounded-none relative overflow-hidden" id="wrapper-fpt-unit">
          <div className="mb-2">
            <label htmlFor="don-vi-select" className="text-xs font-black text-[#5d4037] uppercase tracking-wider mb-1.5 block">
              Đơn vị <span className="text-[#d84315]">*</span>
            </label>
            <select
              id="don-vi-select"
              required
              value={donVi}
              onChange={(e) => setDonVi(e.target.value)}
              className="w-full bg-white border-4 border-[#5d4037] px-3 py-2 rounded-none text-[#3e2723] font-semibold focus:ring-0 outline-none pointer-events-auto cursor-pointer"
            >
              {Object.keys(SCHOOL_DATA).map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
            {errors.donVi && (
              <p className="text-xs text-[#d84315] font-black mt-1 flex items-center gap-1 animate-pulse" id="error-don-vi">
                <span className="w-1.5 h-1.5 bg-[#d84315] inline-block" />
                {errors.donVi}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="fpt-select-campus" className="text-xs font-black text-[#5d4037] uppercase tracking-wider mb-1.5 block">
              Cơ sở <span className="text-[#d84315]">*</span>
            </label>
            <select
              id="fpt-select-campus"
              value={coSo}
              onChange={(e) => setCoSo(e.target.value)}
              className="w-full bg-white border-4 border-[#5d4037] px-3 py-2 rounded-none text-[#2e7d32] font-semibold focus:ring-0 outline-none pointer-events-auto cursor-pointer"
            >
              {(SCHOOL_DATA[donVi] || []).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Checkbox thỏa thuận điều kiện sử dụng */}
        <div className="pt-1" id="wrapper-terms">
          <label className="flex items-start gap-2.5 text-xs md:text-sm text-[#5d4037] leading-relaxed font-bold cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 border-2 border-[#5d4037] bg-white text-[#d84315] focus:ring-0 rounded-none w-4.5 h-4.5 cursor-pointer"
              id="chk-terms"
            />
            <span>
              Tôi đồng ý cho <strong className="text-[#2e7d32] font-black">POST-A-TREE</strong> sử dụng thông tin trên cho mục định thống kê và liên hệ về chương trình.
            </span>
          </label>
        </div>

        {/* Nút nộp form để bắt đầu chơi */}
        <div className="pt-1 mt-auto" id="form-action-container">
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-2.5 sm:py-3 px-6 rounded-none text-center text-sm md:text-base uppercase tracking-wider transition-all border-4 pointer-events-auto select-none ${
              isFormValid
                ? 'bg-[#d84315] hover:bg-[#bf360c] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(62,39,35,0.45)] text-white shadow-[4px_4px_0px_0px_rgba(62,39,35,0.45)] border-[#3e2723] cursor-pointer font-black'
                : 'bg-[#d7ccc8] text-[#8d6e63] border-[#a1887f] shadow-[4px_4px_0px_0px_rgba(141,110,99,0.25)] cursor-not-allowed font-bold'
            }`}
            id="btn-submit-player-form"
          >
            Vào phòng chơi ngay 🚀
          </button>
        </div>
      </form>
    </motion.div>
  );
}
