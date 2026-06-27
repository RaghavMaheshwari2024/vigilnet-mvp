/**
 * Formats a number or string value to USD currency format.
 */
export const formatCurrency = (value: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0 : value;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
};

/**
 * Formats an ISO timestamp or date string to readable visual dates.
 */
export const formatDateTime = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
};
