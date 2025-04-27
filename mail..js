// 從 Zapier 獲取輸入文字，若無則拋出錯誤
const text = inputData.text || '';
if (!text) throw new Error('inputData.text is missing');

// 提取.Concurrent No 允許 A/C No 後有任意非數字字符，直到遇到數字
const accountNoMatch = text.match(/A\/C\s*No[^\d]*(\d+)\s*/i);
const accountNo = accountNoMatch ? accountNoMatch[1] : null;

// 提取 Date（支持 YYYY.MM.DD HH:MM 格式，可選前後星號，並轉為 YYYY-MM-DD）
const dateMatch = text.match(/\*?\s*(\d{4}\.\d{2}\.\d{2})\s+\d{2}:\d{2}\s*\*?/);
const date = dateMatch ? dateMatch[1].replace(/\./g, '-') : null;

// 定義 A/C Summary 標題的正則表達式 (星號和冒號可選，支援空格變化)
const acSummaryPattern = /\*?\s*A\/C\s*SUMMARY:?\s*\*?/i;

// 修改 extractNumber 函數以支援空格作為千分位分隔符
const extractNumber = (fieldName) => {
  // 放寬正則表達式，允許空格或逗號作為分隔符
  const pattern = new RegExp(acSummaryPattern.source + `[\\s\\S]*?${fieldName}:\\s*([-]?\\d{1,3}(?:[\\s,]?\\d{3})*(?:\\.\\d+)?)`, 'i');
  const match = text.match(pattern);
  if (match) {
    // 移除數值中的空格和逗號
    const value = match[1].replace(/[,\s]/g, '');
    return parseFloat(value);
  }
  return null;
};

// 獨立處理 marginRequirements 欄位
const extractMarginRequirements = () => {
  // 使用更寬鬆的正則表達式，僅匹配欄位名稱後的數值（支援空格或逗號分隔）
  const pattern = /Margin\s*Requirements:\s*([-]?\d{1,3}(?:[\\s,]?\\d{3})*(?:\\.\\d+)?)/i;
  const match = text.match(pattern);
  if (!match || !match[1].trim()) {
    throw new Error('Margin Requirements is missing or empty, which is not allowed');
  }
  const value = match[1].replace(/[,\s]/g, '');
  return parseFloat(value);
};

// 提取 A/C Summary 下的欄位
const balance = extractNumber('Balance');
const closedTradePL = extractNumber('Closed Trade P\/L');
const depositWithdrawal = extractNumber('Deposit\/Withdrawal');
const previousEquity = extractNumber('Previous Equity');
const equity = extractNumber('Equity');
const floatingPL = extractNumber('Floating P\/L');
const marginRequirements = extractMarginRequirements(); // 獨立處理
const availableMargin = extractNumber('Available Margin');

// 調試日誌
console.log('Text Content:', text.substring(0, 500));
console.log('Account No:', accountNo);
console.log('Date:', date);
console.log('Balance:', balance);
console.log('Closed Trade P/L:', closedTradePL);
console.log('Deposit/Withdrawal:', depositWithdrawal);
console.log('Previous Equity:', previousEquity);
console.log('Equity:', equity);
console.log('Floating P/L:', floatingPL);
console.log('Margin Requirements:', marginRequirements);
console.log('Available Margin:', availableMargin);

// 驗證數據完整性
if (
  !accountNo ||
  !date ||
  balance === null ||
  closedTradePL === null ||
  depositWithdrawal === null ||
  previousEquity === null ||
  equity === null ||
  floatingPL === null ||
  marginRequirements === null ||
  availableMargin === null
) {
  throw new Error(
    `Missing fields: A/C No=${accountNo}, Date=${date}, Balance=${balance}, ` +
    `Closed Trade P/L=${closedTradePL}, Deposit/Withdrawal=${depositWithdrawal}, ` +
    `Previous Equity=${previousEquity}, Equity=${equity}, Floating P/L=${floatingPL}, ` +
    `Margin Requirements=${marginRequirements}, Available Margin=${availableMargin}`
  );
}

// 輸出結果
output = {
  accountNo,
  date,
  balance,
  closedTradePL,
  depositWithdrawal,
  previousEquity,
  equity,
  floatingPL,
  marginRequirements,
  availableMargin
};
