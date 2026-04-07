/**
 * Utility functions for date handling in the app
 */

/**
 * Extract publication year from various date formats
 * Handles: ISO strings (YYYY-MM-DD), timestamps, Date objects, null values
 * Fallback: "Date non spécifiée" when unavailable
 */
export const getPublicationYear = (dateValue: string | Date | number | null | undefined): string => {
  if (!dateValue) return 'Date non spécifiée';

  try {
    // Case 1: String in ISO format (YYYY-MM-DD)
    if (typeof dateValue === 'string') {
      if (dateValue.includes('-')) {
        const year = dateValue.split('-')[0];
        // Validate it's a reasonable year
        const yearNum = parseInt(year, 10);
        if (yearNum > 1000 && yearNum < 3000) {
          return year;
        }
      }
      // Try parsing as date
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        return date.getFullYear().toString();
      }
    }

    // Case 2: Timestamp (number)
    if (typeof dateValue === 'number') {
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        return date.getFullYear().toString();
      }
    }

    // Case 3: Date object
    if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
      return dateValue.getFullYear().toString();
    }
  } catch (e) {
    console.warn('Error parsing publication year:', dateValue, e);
  }

  return 'Date non spécifiée';
};

/**
 * Format a date for display (French locale)
 * Input: ISO string, Date object, or timestamp
 * Output: "15 mars 2024" format
 */
export const formatDateFR = (dateValue: string | Date | number | null | undefined): string => {
  if (!dateValue) return '-';

  try {
    let date: Date;
    
    if (typeof dateValue === 'string') {
      date = new Date(dateValue);
    } else if (typeof dateValue === 'number') {
      date = new Date(dateValue);
    } else if (dateValue instanceof Date) {
      date = dateValue;
    } else {
      return '-';
    }

    if (isNaN(date.getTime())) return '-';

    // Format: "15 mars 2024"
    const intl = new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return intl.format(date);
  } catch (e) {
    console.warn('Error formatting date:', dateValue, e);
    return '-';
  }
};

/**
 * Calculate days until return date
 * Returns: positive number = days remaining, negative = overdue
 */
export const getDaysUntilReturn = (returnDate: string | Date | null): number | null => {
  if (!returnDate) return null;

  try {
    const date = typeof returnDate === 'string' ? new Date(returnDate) : returnDate;
    if (isNaN(date.getTime())) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    const diffTime = date.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch (e) {
    console.warn('Error calculating days until return:', returnDate, e);
    return null;
  }
};
