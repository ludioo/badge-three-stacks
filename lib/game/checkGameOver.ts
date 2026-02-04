import type { Tile } from './types';
import { BOARD_SIZE } from './constants';
import { getEmptyCells } from './utils';
import { canMerge } from './rules/mergeRule';

/**
 * Check if game is over (Threes rules).
 * Game over when:
 * - No empty cells AND
 * - No adjacent tiles that can merge (canMerge)
 */
export function checkGameOver(board: Tile[][]): boolean {
  const emptyCells = getEmptyCells(board);
  if (emptyCells.length > 0) {
    return false;
  }

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE - 1; col++) {
      const a = board[row][col];
      const b = board[row][col + 1];
      if (a !== null && b !== null && canMerge(a, b)) {
        return false;
      }
    }
  }

  for (let row = 0; row < BOARD_SIZE - 1; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const a = board[row][col];
      const b = board[row + 1][col];
      if (a !== null && b !== null && canMerge(a, b)) {
        return false;
      }
    }
  }

  return true;
}
