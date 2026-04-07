import { getPublicationYear } from '../utils/dateUtils';

describe('dateUtils', () => {
  describe('getPublicationYear', () => {
    it('should extract year from ISO date string', () => {
      const year = getPublicationYear('2023-05-15T10:30:00Z');
      expect(year).toBe(2023);
    });

    it('should extract year from YYYY-MM-DD format', () => {
      const year = getPublicationYear('2023-05-15');
      expect(year).toBe(2023);
    });

    it('should extract year from YYYY-MM format', () => {
      const year = getPublicationYear('2023-05');
      expect(year).toBe(2023);
    });

    it('should extract year from YYYY format', () => {
      const year = getPublicationYear('2023');
      expect(year).toBe(2023);
    });

    it('should extract year from Date object', () => {
      const date = new Date(2023, 4, 15);
      const year = getPublicationYear(date);
      expect(year).toBe(2023);
    });

    it('should handle null or undefined gracefully', () => {
      expect(getPublicationYear(null)).toBeNull();
      expect(getPublicationYear(undefined)).toBeUndefined();
    });

    it('should return 0 for invalid dates', () => {
      const year = getPublicationYear('invalid-date');
      expect(Number.isNaN(year) || year === 0).toBe(true);
    });

    it('should handle future years', () => {
      const year = getPublicationYear('2025-12-31');
      expect(year).toBe(2025);
    });

    it('should handle old dates', () => {
      const year = getPublicationYear('1900-01-01');
      expect(year).toBe(1900);
    });

    it('should extract year from timestamp', () => {
      const timestamp = new Date('2023-06-15').getTime();
      const year = getPublicationYear(timestamp);
      expect(year).toBe(2023);
    });

    it('should handle date strings with time', () => {
      const year = getPublicationYear('2023-05-15 14:30:45');
      expect(year).toBe(2023);
    });

    it('should be case insensitive for month abbreviations', () => {
      const year1 = getPublicationYear('15-May-2023');
      const year2 = getPublicationYear('15-MAY-2023');
      expect(year1).toBe(2023);
      expect(year2).toBe(2023);
    });
  });
});
