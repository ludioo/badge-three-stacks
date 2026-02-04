import { describe, it, expect } from 'vitest';
import { mergeTiles } from './merge';

describe('mergeTiles (Threes rules)', () => {
  it('should merge 1 + 2 to 3', () => {
    const tiles = [1, 2, null, null];
    const result = mergeTiles(tiles);
    expect(result.merged).toEqual([3, null, null, null]);
    expect(result.score).toBe(3);
  });

  it('should merge 2 + 1 to 3', () => {
    const tiles = [2, 1, null, null];
    const result = mergeTiles(tiles);
    expect(result.merged).toEqual([3, null, null, null]);
    expect(result.score).toBe(3);
  });

  it('should merge 3 + 3 to 6', () => {
    const tiles = [3, 3, null, null];
    const result = mergeTiles(tiles);
    expect(result.merged).toEqual([6, null, null, null]);
    expect(result.score).toBe(6);
  });

  it('should merge 6 + 6 to 12', () => {
    const tiles = [6, 6, null, null];
    const result = mergeTiles(tiles);
    expect(result.merged).toEqual([12, null, null, null]);
    expect(result.score).toBe(12);
  });

  it('should merge multiple pairs in one row', () => {
    const tiles = [3, 3, 6, 6];
    const result = mergeTiles(tiles);
    expect(result.merged).toEqual([6, 12, null, null]);
    expect(result.score).toBe(18);
  });

  it('should not merge 1 + 1', () => {
    const tiles = [1, 1, null, null];
    const result = mergeTiles(tiles);
    expect(result.merged).toEqual([1, 1, null, null]);
    expect(result.score).toBe(0);
  });

  it('should not merge 2 + 2', () => {
    const tiles = [2, 2, null, null];
    const result = mergeTiles(tiles);
    expect(result.merged).toEqual([2, 2, null, null]);
    expect(result.score).toBe(0);
  });

  it('should merge non-adjacent 1 and 2 after removing nulls', () => {
    const tiles = [1, null, 2, null];
    const result = mergeTiles(tiles);
    expect(result.merged).toEqual([3, null, null, null]);
    expect(result.score).toBe(3);
  });

  it('should handle all nulls', () => {
    const tiles = [null, null, null, null];
    const result = mergeTiles(tiles);
    expect(result.merged).toEqual([null, null, null, null]);
    expect(result.score).toBe(0);
  });

  it('should handle single tile', () => {
    const tiles = [3, null, null, null];
    const result = mergeTiles(tiles);
    expect(result.merged).toEqual([3, null, null, null]);
    expect(result.score).toBe(0);
  });

  it('should handle no merges (3, 6, 12, 24)', () => {
    const tiles = [3, 6, 12, 24];
    const result = mergeTiles(tiles);
    expect(result.merged).toEqual([3, 6, 12, 24]);
    expect(result.score).toBe(0);
  });

  it('should only merge once per pair (3, 3, 3, 3)', () => {
    const tiles = [3, 3, 3, 3];
    const result = mergeTiles(tiles);
    expect(result.merged).toEqual([6, 6, null, null]);
    expect(result.score).toBe(12);
  });
});
