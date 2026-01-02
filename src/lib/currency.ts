// Currency configuration
export const CURRENCY = {
  code: 'ETB',
  symbol: 'Br',
  name: 'Ethiopian Birr',
  locale: 'en-ET',
};

/**
 * Format a number as currency in Ethiopian Birr
 */
export const formatCurrency = (amount: number): string => {
  return `${CURRENCY.symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Format a number as compact currency (e.g., 1.2K)
 */
export const formatCurrencyCompact = (amount: number): string => {
  if (amount >= 1000000) {
    return `${CURRENCY.symbol}${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${CURRENCY.symbol}${(amount / 1000).toFixed(1)}K`;
  }
  return formatCurrency(amount);
};
