import { describe, it, expect } from 'vitest';
import { spawnTile } from './spawn';
import { getEmptyCells } from './utils';

describe('spawnTile', () => {
  it('should spawn a tile in an empty cell', () => {
    const board = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const result = spawnTile(board);

    let tileCount = 0;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (result[row][col] !== null) {
          tileCount++;
          expect([1, 2, 3]).toContain(result[row][col]);
        }
      }
    }
    expect(tileCount).toBe(1);
  });

  it('should not spawn if board is full', () => {
    const board = [
      [3, 6, 12, 24],
      [6, 12, 24, 48],
      [12, 24, 48, 96],
      [24, 48, 96, 192],
    ];
    const result = spawnTile(board);
    expect(result).toEqual(board);
  });

  it('should spawn in random empty cell', () => {
    const board = [
      [1, null, null, null],
      [null, 2, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    const results: number[][] = [];
    for (let i = 0; i < 10; i++) {
      const result = spawnTile(board);
      const emptyBefore = getEmptyCells(board).length;
      const emptyAfter = getEmptyCells(result).length;
      expect(emptyAfter).toBe(emptyBefore - 1);
      results.push(result.flat().filter((x) => x !== null) as number[]);
    }

    const firstResult = results[0];
    const allSame = results.every(
      (r) =>
        r.length === firstResult.length &&
        r.every((val, idx) => val === firstResult[idx])
    );
    expect(allSame).toBe(false);
  });

  it('should spawn only 1, 2, or 3', () => {
    const board = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    const spawnedValues: number[] = [];
    for (let i = 0; i < 100; i++) {
      const result = spawnTile(board);
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          if (result[row][col] !== null) {
            spawnedValues.push(result[row][col]);
          }
        }
      }
    }

    spawnedValues.forEach((val) => {
      expect([1, 2, 3]).toContain(val);
    });
  });
});
