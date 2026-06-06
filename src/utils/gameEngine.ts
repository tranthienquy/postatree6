/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TargetWord, GridCell } from '../types';

// Ngân hàng từ vựng môi trường có cấu hình rõ ràng để dễ thêm bớt
export const WORD_BANK = [
  { text: "MÔITRƯỜNG", label: "Môi trường" },
  { text: "CÂYXANH", label: "Cây xanh" },
  { text: "TRỒNGCÂY", label: "Trồng cây" },
  { text: "TÁICHẾ", label: "Tái chế" },
  { text: "RỪNGXANH", label: "Rừng xanh" },
  { text: "THIÊNNHIÊN", label: "Thiên nhiên" },
  { text: "KHÍHẬU", label: "Khí hậu" },
  { text: "GIẢMRÁC", label: "Giảm rác" },
  { text: "NGUỒNNƯỚC", label: "Nguồn nước" },
  { text: "SỐNGXANH", label: "Sống xanh" },
  { text: "HỆSINHTHÁI", label: "Hệ sinh thái" },
];

export const REQUIRED_WORD = { text: "POSTATREE", label: "POST A TREE" };

// Các lựa chọn các hướng đặt từ: 
// - Ngang: [0, 1] (phải)
// - Dọc: [1, 0] (dưới)
// - Chéo: [1, 1] (bên phải dưới)
const DIRECTIONS = [
  [0, 1],  // Ngang
  [1, 0],  // Dọc
  [1, 1]   // Chéo
];

// Bộ ký tự tiếng Việt viết hoa đầy đủ cả dấu để điền vào các ô trống một cách tự nhiên khó bị lộ
const VIETNAMESE_CHARS = [
  'A', 'Ă', 'Â', 'B', 'C', 'D', 'Đ', 'E', 'Ê', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'O', 'Ô', 'Ơ', 'P', 'Q', 'R', 'S', 'T', 'U', 'Ư', 'V', 'X', 'Y',
  'Á', 'À', 'Ả', 'Ã', 'Ạ', 'Ắ', 'Ằ', 'Ẳ', 'Ẵ', 'Ặ', 'Ấ', 'Ầ', 'Ẩ', 'Ẫ', 'Ậ', 'É', 'È', 'Ẻ', 'Ẽ', 'Ẹ', 'Ế', 'Ề', 'Ể', 'Ễ', 'Ệ', 'Í', 'Ì', 'Ỉ', 'Ĩ', 'Ị',
  'Ó', 'Ò', 'Ỏ', 'Õ', 'Ọ', 'Ố', 'Ồ', 'Ổ', 'Ỗ', 'Ộ', 'Ớ', 'Ờ', 'Ở', 'Ỡ', 'Ợ', 'Ú', 'Ù', 'Ủ', 'Ũ', 'Ụ', 'Ứ', 'Ừ', 'Ử', 'Ữ', 'Ự', 'Ý', 'Ỳ', 'Ỷ', 'Ỹ', 'Ỵ'
];

/**
 * Chọn ngẫu nhiên kí tự tiếng Việt
 */
function getRandomChar(): string {
  const index = Math.floor(Math.random() * VIETNAMESE_CHARS.length);
  return VIETNAMESE_CHARS[index];
}

/**
 * Xáo trộn mảng ngẫu nhiên (Fisher-Yates)
 */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Hàm khởi tạo và tạo lập lưới game
 * Lưới kích thước 12x12
 */
export function generateGame(gridSize: number = 12): { grid: GridCell[][]; targets: TargetWord[] } {
  // 1. CHỌN TỪ CHO VÁN CHƠI
  // Luôn có từ POSTATREE bắt buộc.
  const selectedEnvironmentWords = shuffleArray(WORD_BANK).slice(0, 3);
  
  // Tạo mảng target words
  const targets: TargetWord[] = [
    {
      id: 'required-word',
      text: REQUIRED_WORD.text,
      label: REQUIRED_WORD.label,
      found: false
    },
    ...selectedEnvironmentWords.map((word, index) => ({
      id: `env-${index}`,
      text: word.text,
      label: word.label,
      found: false
    }))
  ];

  let grid: string[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
  let placedWordCoords: { [wordId: string]: { start: [number, number], end: [number, number] } } = {};

  // Thử sinh lưới cho đến khi xếp đặt thành công toàn bộ các từ
  let attempt = 0;
  let success = false;

  while (attempt < 200 && !success) {
    grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    placedWordCoords = {};
    let allPlaced = true;

    // Xếp từng từ một vào lưới
    for (const target of targets) {
      const placed = tryPlaceWord(grid, target.text, gridSize);
      if (placed) {
        placedWordCoords[target.id] = { start: placed.start, end: placed.end };
      } else {
        allPlaced = false;
        break; // Thất bại, thử lại từ đầu
      }
    }

    if (allPlaced) {
      success = true;
    }
    attempt++;
  }

  // Cập nhật lại tọa độ cho target words
  const finalTargets = targets.map(target => {
    const coords = placedWordCoords[target.id];
    return {
      ...target,
      startCoord: coords?.start,
      endCoord: coords?.end
    };
  });

  // Có lưới tối ưu. Bây giờ điền những ô trống bằng các ký tự ngẫu nhiên
  const finalGrid: GridCell[][] = [];
  for (let r = 0; r < gridSize; r++) {
    const rowCells: GridCell[] = [];
    for (let c = 0; c < gridSize; c++) {
      let char = grid[r][c];
      if (!char) {
        char = getRandomChar();
      }
      rowCells.push({
        row: r,
        col: c,
        char,
        isFound: false,
        foundWordIds: []
      });
    }
    finalGrid.push(rowCells);
  }

  return {
    grid: finalGrid,
    targets: finalTargets
  };
}

/**
 * Thử đặt một từ vào lưới trống/hiện tại
 */
function tryPlaceWord(
  grid: string[][], 
  word: string, 
  gridSize: number
): { start: [number, number]; end: [number, number] } | null {
  const wordLen = word.length;
  // Xáo trộn hướng để tăng tính ngẫu nhiên
  const shuffledDirections = shuffleArray(DIRECTIONS);

  // Tạo danh sách các ô bắt đầu khả thi rồi dịch ngẫu nhiên
  const cells: [number, number][] = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      cells.push([r, c]);
    }
  }
  const shuffledCells = shuffleArray(cells);

  for (const [startRow, startCol] of shuffledCells) {
    for (const [dr, dc] of shuffledDirections) {
      const endRow = startRow + dr * (wordLen - 1);
      const endCol = startCol + dc * (wordLen - 1);

      // Kiểm tra xem từ có nằm trọn trong lưới không
      if (endRow >= 0 && endRow < gridSize && endCol >= 0 && endCol < gridSize) {
        let fits = true;

        // Đi qua xem có xung đột gì không
        for (let i = 0; i < wordLen; i++) {
          const r = startRow + dr * i;
          const c = startCol + dc * i;
          const letter = word[i];

          if (grid[r][c] !== '' && grid[r][c] !== letter) {
            fits = false;
            break;
          }
        }

        if (fits) {
          // Ghi từ vào lưới
          for (let i = 0; i < wordLen; i++) {
            const r = startRow + dr * i;
            const c = startCol + dc * i;
            grid[r][c] = word[i];
          }
          return {
            start: [startRow, startCol],
            end: [endRow, endCol]
          };
        }
      }
    }
  }

  return null;
}

/**
 * Xác định xem lựa chọn từ (start và end) có phải đường thẳng hợp lệ và hướng đúng không
 * Phải thẳng ngang, thẳng dọc, hoặc chéo xuống.
 */
export function checkSelectionLine(
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
): { isValid: boolean; coords: [number, number][] } {
  const dr = endRow - startRow;
  const dc = endCol - startCol;

  const absDr = Math.abs(dr);
  const absDc = Math.abs(dc);

  // 1. Kiểm tra xem có đúng là đường chéo 45 độ, ngang, hoặc dọc
  if (!(dr === 0 || dc === 0 || absDr === absDc)) {
    return { isValid: false, coords: [] };
  }

  // 2. Kiểm tra hướng chỉ được phép: ngang (trái->phải), dọc (trên->dưới), chéo (trên-trái->dưới-phải)
  // Ý nghĩa:
  // - dr == 0, dc > 0 (ngang)
  // - dr > 0, dc == 0 (dọc)
  // - dr > 0, dc > 0 (chéo xuống)
  // Ngoài ra, để cải thiện trải nghiệm kéo, ta cho phép kéo ngược một chút nhưng nên chuẩn chỉ theo hướng của game.
  // Tuy nhiên, người dùng kéo từ điểm đầu đến điểm cuối, nếu họ lỡ kéo ngược thì ta đảo đầu lại cho đúng chiều!
  let r0 = startRow;
  let c0 = startCol;
  let r1 = endRow;
  let c1 = endCol;

  // Đảo đầu nếu hướng bị ngược để hỗ trợ người dùng thuận tiện khi tìm thấy từ bị ngược nhưng ta lưu trong mảng là xuôi
  // Đảo theo ngang: trái qua phải
  if (r0 === r1 && c1 < c0) {
    c0 = endCol;
    c1 = startCol;
  }
  // Đảo theo dọc: trên xuống dưới
  else if (c0 === c1 && r1 < r0) {
    r0 = endRow;
    r1 = startRow;
  }
  // Đảo theo chéo: trên-trái xuống dưới-phải
  else if (r1 < r0 && c1 < c0) {
    r0 = endRow;
    c0 = endCol;
    r1 = startRow;
    c1 = startCol;
  }

  // Kiểm tra xem góc kéo hiện tại có đúng trong các góc cho phép (ngang, dọc, chéo xuống)
  const finalDr = r1 - r0;
  const finalDc = c1 - c0;

  const stepR = finalDr === 0 ? 0 : 1;
  const stepC = finalDc === 0 ? 0 : 1;

  if (finalDr < 0 || finalDc < 0) {
    // Không cho phép hướng ngược sau khi đã tối ưu đảo chiều (ví dụ kéo chéo từ trên-phải xuống dưới-trái)
    // Để dễ chơi nhất rộng lượng, nếu là chéo từ trên-phải xuống dưới-trái, ta cũng có thể hỗ trợ nếu chiều chữ không có chéo ngược.
    // Thực tế từ chỉ đặt theo: ngang (trái->phải), dọc (trên->dưới), chéo (trên-trái->dưới-phải). Do đó bất kỳ đường nào tìm đúng
    // thì sau khi đảo thuận chiều của từ, nó phải có dr >= 0 và dc >= 0.
    return { isValid: false, coords: [] };
  }

  const length = Math.max(Math.abs(finalDr), Math.abs(finalDc)) + 1;
  const coords: [number, number][] = [];

  for (let i = 0; i < length; i++) {
    coords.push([r0 + stepR * i, c0 + stepC * i]);
  }

  return { isValid: true, coords };
}
