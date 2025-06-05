/**
 * Formats a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - The currency code (default: 'USD')
 * @param {string} locale - The locale to use for formatting (default: 'en-US')
 * @returns {string} - The formatted currency string
 */
export const formatPrice = (amount, currencyCode = 'USD', locale = 'en-US') => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '';
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Formats a price with a discount
 * @param {number} originalPrice - The original price
 * @param {number} discountedPrice - The discounted price
 * @param {string} currencyCode - The currency code (default: 'USD')
 * @returns {object} - Object containing formatted prices and discount percentage
 */
export const formatDiscount = (originalPrice, discountedPrice, currencyCode = 'USD') => {
  if (!originalPrice || !discountedPrice) {
    return {
      original: formatPrice(originalPrice, currencyCode),
      discounted: formatPrice(discountedPrice, currencyCode),
      percentage: '0%'
    };
  }
  
  const discountPercentage = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  
  return {
    original: formatPrice(originalPrice, currencyCode),
    discounted: formatPrice(discountedPrice, currencyCode),
    percentage: `${discountPercentage}%`
  };
};

/**
 * Formats a price range
 * @param {number} minPrice - The minimum price
 * @param {number} maxPrice - The maximum price
 * @param {string} currencyCode - The currency code (default: 'USD')
 * @returns {string} - The formatted price range
 */
export const formatPriceRange = (minPrice, maxPrice, currencyCode = 'USD') => {
  return `${formatPrice(minPrice, currencyCode)} - ${formatPrice(maxPrice, currencyCode)}`;
};