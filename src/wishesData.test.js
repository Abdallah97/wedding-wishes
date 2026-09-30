import { describe, it, expect } from 'vitest';
import { wishesData } from './wishesData';

describe('wishesData dataset', () => {
  it('is a non-empty array of wish objects', () => {
    expect(Array.isArray(wishesData)).toBe(true);
    expect(wishesData.length).toBeGreaterThan(0);
  });

  it('contains valid wish items with required properties', () => {
    wishesData.forEach((item) => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('message');
      expect(typeof item.id).toBe('number');
      expect(typeof item.name).toBe('string');
      expect(typeof item.message).toBe('string');
      expect(item.name.trim().length).toBeGreaterThan(0);
      expect(item.message.trim().length).toBeGreaterThan(0);
    });
  });

  it('has unique IDs for every entry', () => {
    const ids = wishesData.map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
