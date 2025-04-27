// 從 Zapier 獲取輸入文字，若無則拋出錯誤
const text = inputData.text || '';
if (!text) throw new Error('inputData.text is missing');

// 提取 A/C No 允許 A/C No 後有任意非數字字符，直到遇到數字
const accountNoMatch = text.match(/A\/C\s*No[^\d]*(\d+)\s*/i);
const accountNo = accountNoMatch ? accountNoMatch[1] : null;

// 提取 Date（支持 YYYY.MM.DD HH:MM 格式，可選前後星號，並轉為 YYYY-MM-DD）
const dateMatch = text.match(/\*?\s*(\d{4}\.\d{2}\.\d{2})\s+\d{2}:\d{2}\s*\*?/);
const date = dateMatch ? dateMatch[1].replace(/\./g, '-') : null;

// 定義 A/C Summary 標題的正則表達式 (星號和冒號可選，支援空格變化)
const acSummaryPattern = /\*?\s*A\/C\s*SUMMARY:?\s*\*?/i;

const extractNumber = (fieldName) => {
  // 定義欄位特定的正則表達式模式
  let fieldPattern;
  if (fieldName === 'Balance') {
    // 確保僅匹配獨立的 Balance 欄位，而非 Previous Ledger Balance
    fieldPattern = `(?<!Previous\\s+Ledger\\s+)\\bBalance\\b`;
  } else if (fieldName === 'Equity') {
    // 確保僅匹配獨立的 Equity 欄位，而非 Previous Equity
    fieldPattern = `(?<!Previous\\s+)\\bEquity\\b`;
  } else {
    // 其他欄位使用預設模式，確保精確匹配
    fieldPattern = `\\b${fieldName}\\b`;
  }

  // 定義通用的數值提取模式，支援負數、千分位分隔符和帶小數的數字
  const numberPattern = `([-]?\\d{1,3}(?:[\\s,]?\\d{3})*(?:\\.\\d+)?)`;
  
  // 組合完整的正則表達式模式，從 A/C Summary 區塊開始匹配
  const pattern = new RegExp(
    `${acSummaryPattern.source}[\\s\\S]*?${fieldPattern}\\s*:\\s*${numberPattern}`,
    'i'
  );

  const match = text.match(pattern);
  if (match) {
    // 移除數值中的空格和逗號，並轉為浮點數
    const value = match[1].replace(/[,\s]/g, '');
    return parseFloat(value);
  }
  return null;
};

// 獨立處理 marginRequirements 欄位，確保小數點後數值被正確提取
const extractMarginRequirements = () => {
  // 使用 acSummaryPattern 錨定，並精確匹配 Margin Requirements
  const pattern = new RegExp(
    acSummaryPattern.source + `[\\s\\S]*?\\bMargin\\s*Requirements\\b\\s*:\\s*([-]?\\d{1,3}(?:[\\s,]?\\d{3})*(?:\\.\\d+)?)`,
    'i'
  );
  const match = text.match(pattern);
  if (!match || !match[1].trim()) {
    throw new Error('Margin Requirements is missing or empty, which is not allowed');
  }
  const value = match[1].replace(/[,\s]/g, '');
  return parseFloat(value);
};

// 提取 A/C Summary 下的欄位
const previousLedgerBalance = extractNumber('Previous Ledger Balance');
const balance = extractNumber('Balance');
const closedTradePL = extractNumber('Closed Trade P\/L');
const depositWithdrawal = extractNumber('Deposit\/Withdrawal');
const previousEquity = extractNumber('Previous Equity');
const equity = extractNumber('Equity');
const floatingPL = extractNumber('Floating P/L');
const marginRequirements = extractMarginRequirements(); // 獨立處理
const availableMargin = extractNumber('Available Margin');

// 調試日誌
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
  previousLedgerBalance,
  balance,
  closedTradePL,
  depositWithdrawal,
  previousEquity,
  equity,
  floatingPL,
  marginRequirements,
  availableMargin
};
