const text = inputData.text || '';
if (!text) throw new Error('inputData.text is missing');

// 提取 A/C No (增加靈活性)
const accountNoMatch = text.match(/A\/C\s*No[.:]?\s*\*?(\d+)\*?\s*/i);
const accountNo = accountNoMatch ? accountNoMatch[1] : null;

// 提取 Date (支持 YYYY.MM.DD HH:MM 格式，前後星號可選，轉為 YYYY-MM-DD)
const dateMatch = text.match(/\*?\s*(\d{4}\.\d{2}\.\d{2})\s+\d{2}:\d{2}\s*\*?/);
const date = dateMatch ? dateMatch[1].replace(/\./g, '-') : null;

// 定義 A/C Summary 標題的正則表達式 (星號和冒號可選，支援空格變化)
const acSummaryPattern = /\*?\s*A\/C\s*SUMMARY:?\s*\*?/i;

// 定義提取數值的輔助函數 (支援靈活的數值格式和冒號後空格)
const extractNumber = (fieldName) => {
  const pattern = new RegExp(acSummaryPattern.source + `[\\s\\S]*?${fieldName}:\\s*([-]?\\d{1,3}(?:,\\d{3})*(?:\\.\\d+)?)`, 'i');
  const match = text.match(pattern);
  return match ? parseFloat(match[1].replace(/,/g, '')) : null;
};

// 提取 A/C Summary 下的欄位
const balance = extractNumber('Balance');
const closedTradePL = extractNumber('Closed Trade P\/L');
const depositWithdrawal = extractNumber('Deposit\/Withdrawal');
const previousEquity = extractNumber('Previous Equity');
const equity = extractNumber('Equity');
const floatingPL = extractNumber('Floating P\/L');
const marginRequirements = extractNumber('Margin Requirements');
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
