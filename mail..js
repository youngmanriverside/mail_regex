const text = inputData.text || '';
if (!text) throw new Error('inputData.text is missing');

// 提取 A/C No
// 修正：使冒號可選，周圍的星號和空白都可選且彈性
const accountNoMatch = text.match(/A\/C No:?\s*\*?(\d+)\*?\s*/i); // 採用更彈性的 regex
const accountNo = accountNoMatch ? accountNoMatch[1] : null;

// 提取 Date
// 維持您目前已有的 regex，它已經處理了可選的前後星號
const dateMatch = text.match(/\*?\s*(\d{4}\.\d{2}\.\d{2})\s+\d{2}:\d{2}\s*\*?/);
const date = dateMatch ? dateMatch[1].replace(/\./g, '-') : null;

// -- A/C Summary 欄位提取 --
// 定義一個通用的 A/C Summary 開頭模式，考慮前後的可選星號和冒號
// 這個模式將用於錨定 A/C Summary 區塊的開始
const acSummaryHeaderPattern = /\*?A\/C Summary:?\s*\*?/;

// 提取 Balance
// 使用通用的開頭模式 + [\s\S]* 來尋找欄位，欄位名稱後的冒號可選，數值前後空白彈性
const balanceMatch = text.match(new RegExp(acSummaryHeaderPattern.source + '[\\s\\S]*Balance:?\\s*([-]?[\d., ]+)\\s*', 'i')); // 採用更彈性的 regex
const balance = balanceMatch ? parseFloat(balanceMatch[1].replace(/,/g, '').replace(/ /g, '')) : null;

// 提取 Closed Trade P/L
// 使用通用的開頭模式 + [\s\S]* 來尋找欄位
const closedTradePLMatch = text.match(new RegExp(acSummaryHeaderPattern.source + '[\\s\\S]*Closed Trade P\/L:?\\s*([-]?[\d., ]+)\\s*', 'i')); // 採用更彈性的 regex
const closedTradePL = closedTradePLMatch ? parseFloat(closedTradePLMatch[1].replace(/,/g, '').replace(/ /g, '')) : null;

// 提取 Deposit/Withdrawal
// 使用通用的開頭模式 + [\s\S]* 來尋找欄位
const depositWithdrawalMatch = text.match(new RegExp(acSummaryHeaderPattern.source + '[\\s\\S]*Deposit\/Withdrawal:?\\s*([-]?[\d., ]+)\\s*', 'i')); // 採用更彈性的 regex
const depositWithdrawal = depositWithdrawalMatch ? parseFloat(depositWithdrawalMatch[1].replace(/,/g, '').replace(/ /g, '')) : null;

// 提取 Previous Equity
// 使用通用的開頭模式 + [\s\S]* 來尋找欄位
const previousEquityMatch = text.match(new RegExp(acSummaryHeaderPattern.source + '[\\s\\S]*Previous Equity:?\\s*([-]?[\d., ]+)\\s*', 'i')); // 採用更彈性的 regex
const previousEquity = previousEquityMatch ? parseFloat(previousEquityMatch[1].replace(/,/g, '').replace(/ /g, '')) : null;

// 提取 Equity
// 使用通用的開頭模式 + [\s\S]* 來尋找欄位
const equityMatch = text.match(new RegExp(acSummaryHeaderPattern.source + '[\\s\\S]*Equity:?\\s*([-]?[\d., ]+)\\s*', 'i')); // 採用更彈性的 regex
const equity = equityMatch ? parseFloat(equityMatch[1].replace(/,/g, '').replace(/ /g, '')) : null;

// 提取 Floating P/L
// 使用通用的開頭模式 + [\s\S]* 來尋找欄位
const floatingPLMatch = text.match(new RegExp(acSummaryHeaderPattern.source + '[\\s\\S]*Floating P\/L:?\\s*([-]?[\d., ]+)\\s*', 'i')); // 採用更彈性的 regex
const floatingPL = floatingPLMatch ? parseFloat(floatingPLMatch[1].replace(/,/g, '').replace(/ /g, '')) : null;

// 提取 Margin Requirements
// 使用通用的開頭模式 + [\s\S]* 來尋找欄位
const marginRequirementsMatch = text.match(new RegExp(acSummaryHeaderPattern.source + '[\\s\\S]*Margin Requirements:?\\s*([-]?[\d., ]+)\\s*', 'i')); // 採用更彈性的 regex
const marginRequirements = marginRequirementsMatch ? parseFloat(marginRequirementsMatch[1].replace(/,/g, '').replace(/ /g, '')) : null;

// 提取 Available Margin
// 使用通用的開頭模式 + [\s\S]* 來尋找欄位
const availableMarginMatch = text.match(new RegExp(acSummaryHeaderPattern.source + '[\\s\\S]*Available Margin:?\\s*([-]?[\d., ]+)\\s*', 'i')); // 採用更彈性的 regex
const availableMargin = availableMarginMatch ? parseFloat(availableMarginMatch[1].replace(/,/g, '').replace(/ /g, '')) : null;


// 調適日誌 (維持基本)
console.log('--- Extraction Results ---');
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
console.log('-------------------------');


// 驗證數據完整性 (維持基本，但這是關鍵，建議保留以便及早發現問題)
// 如果某些欄位允許為 null (例如當報告中沒有該項時)，您需要調整這個判斷條件
if (
    !accountNo || // 通常 A/C No 不應為 null
    !date ||     // 通常 Date 不應為 null
    balance === null ||
    closedTradePL === null ||
    depositWithdrawal === null ||
    previousEquity === null ||
    equity === null ||
    floatingPL === null ||
    marginRequirements === null ||
    availableMargin === null
) {
    // 仍然拋出錯誤，包含哪些欄位是 null，便於排錯
    throw new Error(
        `Missing fields: A/C No=${accountNo}, Date=${date}, Balance=${balance}, ` +
        `Closed Trade P/L=${closedTradePL}, Deposit/Withdrawal=${depositWithdrawal}, ` +
        `Previous Equity=${previousEquity}, Equity=${equity}, Floating P/L=${floatingPL}, ` +
        `Margin Requirements=${marginRequirements}, Available Margin=${availableMargin}`
    );
}

// 輸出結果 (這部分保持不變)
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