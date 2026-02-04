import { describe, it, expect } from 'vitest';
import { checkGameOver } from './checkGameOver';

describe('checkGameOver (Threes rules)', () => {
  it('should return false if there are empty cells', () => {
    const board = [
      [3, 6, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    expect(checkGameOver(board)).toBe(false);
  });

  it('should return false if adjacent mergeable tiles exist horizontally (3+3)', () => {
    const board = [
      [3, 3, 6, 12],
      [6, 12, 24, 48],
      [12, 24, 48, 96],
      [24, 48, 96, 192],
    ];
    expect(checkGameOver(board)).toBe(false);
  });

  it('should return false if adjacent mergeable tiles exist horizontally (1+2)', () => {
    const board = [
      [1, 2, 6, 12],
      [6, 12, 24, 48],
      [12, 24, 48, 96],
      [24, 48, 96, 192],
    ];
    expect(checkGameOver(board)).toBe(false);
  });

  it('should return false if adjacent mergeable tiles exist vertically', () => {
    const board = [
      [3, 6, 12, 24],
      [3, 12, 24, 48],
      [6, 24, 48, 96],
      [12, 48, 96, 192],
    ];
    expect(checkGameOver(board)).toBe(false);
  });

  it('should return true when board is full and no merges possible', () => {
    const board = [
      [3, 6, 12, 24],
      [6, 12, 24, 48],
      [12, 24, 48, 96],
      [24, 48, 96, 192],
    ];
    expect(checkGameOver(board)).toBe(true);
  });

  it('should return true for full board with no Threes merges (e.g. all 1s)', () => {
    // All 1s: 1+1 does not merge in Threes
    const board = [
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
    ];
    expect(checkGameOver(board)).toBe(true);
  });

  it('should return false if there is at least one empty cell', () => {
    const board = [
      [3, 6, 12, 24],
      [6, 12, 24, 48],
      [12, 24, 48, 96],
      [24, 48, 96, null],
    ];
    expect(checkGameOver(board)).toBe(false);
  });

  it('should detect horizontal merge possibility (3+3)', () => {
    const board = [
      [3, 3, 6, 12],
      [6, 12, 24, 48],
      [12, 24, 48, 96],
      [24, 48, 96, 192],
    ];
    expect(checkGameOver(board)).toBe(false);
  });

  it('should detect vertical merge possibility (1+2)', () => {
    const board = [
      [1, 6, 12, 24],
      [2, 12, 24, 48],
      [6, 24, 48, 96],
      [12, 48, 96, 192],
    ];
    expect(checkGameOver(board)).toBe(false);
  });
});
