const text = inputData.text || '';
if (!text) throw new Error('inputData.text is missing');

// 提取 A/C Summary 區塊
const acSummaryPattern = /\*?\s*A\/C\s*SUMMARY:?\s*\*?(.*?)(?=\n|$)/is;
const acSummaryMatch = text.match(acSummaryPattern);
const acSummaryText = acSummaryMatch ? acSummaryMatch[1].trim() : '';

if (!acSummaryText) {
  throw new Error('A/C Summary section not found');
}

// 定義提取欄位數值的輔助函數（適用於大多數欄位）
const extractFieldValue = (fieldName) => {
  const pattern = new RegExp(`${fieldName}:\\s*([-]?\\d{1,3}(?:[\\s,]?\\d{3})*(?:\\.\\d+)?)`, 'i');
  const match = acSummaryText.match(pattern);
  if (!match) {
    console.log(`Failed to match field: ${fieldName}`);
    return null;
  }
  const value = match[1].replace(/[,\\s]/g, '');
  return parseFloat(value);
};

// 獨立提取 Margin Requirements（放寬規則）
const extractMarginRequirements = () => {
  const pattern = /Margin\s*Requirements:\s*([-]?\d*(?:\.\d+)?(?:[,\s]?\d*)*)/i;
  const match = acSummaryText.match(pattern);
  if (!match || !match[1].trim()) {
    throw new Error('Margin Requirements is missing or empty, which is not allowed');
  }
  const value = match[1].replace(/[,\\s]/g, '');
  return parseFloat(value);
};

// 提取 A/C Summary 下的欄位
const balance = extractFieldValue('Balance');
const closedTradePL = extractFieldValue('Closed Trade P/L');
const depositWithdrawal = extractFieldValue('Deposit/Withdrawal');
const previousEquity = extractFieldValue('Previous Equity');
const equity = extractFieldValue('Equity');
const floatingPL = extractFieldValue('Floating P/L');
const marginRequirements = extractMarginRequirements(); // 獨立處理
const availableMargin = extractFieldValue('Available Margin');

// 輸出結果
const output = {
  balance,
  closedTradePL,
  depositWithdrawal,
  previousEquity,
  equity,
  floatingPL,
  marginRequirements,
  availableMargin
};

console.log('Extraction Results:', output);
return output;
