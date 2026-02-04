import { describe, it, expect } from 'vitest';
import { canMerge, getMergedValue } from './mergeRule';

describe('canMerge', () => {
  it('should allow 1 + 2', () => {
    expect(canMerge(1, 2)).toBe(true);
  });

  it('should allow 2 + 1', () => {
    expect(canMerge(2, 1)).toBe(true);
  });

  it('should allow 3 + 3', () => {
    expect(canMerge(3, 3)).toBe(true);
  });

  it('should allow 6 + 6', () => {
    expect(canMerge(6, 6)).toBe(true);
  });

  it('should allow 12 + 12', () => {
    expect(canMerge(12, 12)).toBe(true);
  });

  it('should not allow 1 + 1', () => {
    expect(canMerge(1, 1)).toBe(false);
  });

  it('should not allow 2 + 2', () => {
    expect(canMerge(2, 2)).toBe(false);
  });

  it('should not allow 1 + 3', () => {
    expect(canMerge(1, 3)).toBe(false);
  });

  it('should not allow 3 + 6', () => {
    expect(canMerge(3, 6)).toBe(false);
  });
});

describe('getMergedValue', () => {
  it('should return 3 for 1 + 2', () => {
    expect(getMergedValue(1, 2)).toBe(3);
  });

  it('should return 3 for 2 + 1', () => {
    expect(getMergedValue(2, 1)).toBe(3);
  });

  it('should return 6 for 3 + 3', () => {
    expect(getMergedValue(3, 3)).toBe(6);
  });

  it('should return 12 for 6 + 6', () => {
    expect(getMergedValue(6, 6)).toBe(12);
  });

  it('should return 24 for 12 + 12', () => {
    expect(getMergedValue(12, 12)).toBe(24);
  });
});
