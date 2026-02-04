import { describe, it, expect } from 'vitest';
import { slideLeft, slideRight, slideUp, slideDown } from './slide';

describe('slideLeft', () => {
  it('should slide tiles to the left', () => {
    const board = [
      [null, 1, null, 3],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const result = slideLeft(board);
    expect(result.board[0]).toEqual([1, 3, null, null]);
    expect(result.changed).toBe(true);
  });

  it('should merge 1+2 when sliding left', () => {
    const board = [
      [1, 2, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const result = slideLeft(board);
    expect(result.board[0]).toEqual([3, null, null, null]);
    expect(result.score).toBe(3);
    expect(result.changed).toBe(true);
  });

  it('should merge 3+3 when sliding left', () => {
    const board = [
      [3, 3, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const result = slideLeft(board);
    expect(result.board[0]).toEqual([6, null, null, null]);
    expect(result.score).toBe(6);
    expect(result.changed).toBe(true);
  });

  it('should not change board if no moves possible', () => {
    const board = [
      [3, 6, 12, 24],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const result = slideLeft(board);
    expect(result.changed).toBe(false);
    expect(result.score).toBe(0);
  });

  it('should handle multiple merges in one row (3+3, 6+6)', () => {
    const board = [
      [3, 3, 6, 6],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const result = slideLeft(board);
    expect(result.board[0]).toEqual([6, 12, null, null]);
    expect(result.score).toBe(18);
  });
});

describe('slideRight', () => {
  it('should slide tiles to the right', () => {
    const board = [
      [1, null, null, 3],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const result = slideRight(board);
    expect(result.board[0]).toEqual([null, null, 1, 3]);
    expect(result.changed).toBe(true);
  });

  it('should merge 2+1 when sliding right', () => {
    const board = [
      [null, null, 2, 1],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const result = slideRight(board);
    expect(result.board[0]).toEqual([null, null, null, 3]);
    expect(result.score).toBe(3);
  });

  it('should merge 3+3 when sliding right', () => {
    const board = [
      [null, null, 3, 3],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const result = slideRight(board);
    expect(result.board[0]).toEqual([null, null, null, 6]);
    expect(result.score).toBe(6);
  });
});

describe('slideUp', () => {
  it('should slide tiles up', () => {
    const board = [
      [null, null, null, null],
      [1, null, null, null],
      [null, null, null, null],
      [3, null, null, null],
    ];
    const result = slideUp(board);
    expect(result.board[0][0]).toBe(1);
    expect(result.board[1][0]).toBe(3);
    expect(result.changed).toBe(true);
  });

  it('should merge 1+2 when sliding up', () => {
    const board = [
      [1, null, null, null],
      [2, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const result = slideUp(board);
    expect(result.board[0][0]).toBe(3);
    expect(result.board[1][0]).toBe(null);
    expect(result.score).toBe(3);
  });

  it('should merge 3+3 when sliding up', () => {
    const board = [
      [3, null, null, null],
      [3, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const result = slideUp(board);
    expect(result.board[0][0]).toBe(6);
    expect(result.board[1][0]).toBe(null);
    expect(result.score).toBe(6);
  });
});

describe('slideDown', () => {
  it('should slide tiles down', () => {
    const board = [
      [1, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [3, null, null, null],
    ];
    const result = slideDown(board);
    expect(result.board[2][0]).toBe(1);
    expect(result.board[3][0]).toBe(3);
    expect(result.changed).toBe(true);
  });

  it('should merge 2+1 when sliding down', () => {
    const board = [
      [null, null, null, null],
      [null, null, null, null],
      [2, null, null, null],
      [1, null, null, null],
    ];
    const result = slideDown(board);
    expect(result.board[2][0]).toBe(null);
    expect(result.board[3][0]).toBe(3);
    expect(result.score).toBe(3);
  });

  it('should merge 3+3 when sliding down', () => {
    const board = [
      [null, null, null, null],
      [null, null, null, null],
      [3, null, null, null],
      [3, null, null, null],
    ];
    const result = slideDown(board);
    expect(result.board[2][0]).toBe(null);
    expect(result.board[3][0]).toBe(6);
    expect(result.score).toBe(6);
  });
});
