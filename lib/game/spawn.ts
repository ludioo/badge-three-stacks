import type { Tile } from './types';
import { SPAWN_WEIGHTS } from './constants';
import { getSpawnValue } from './rules/spawnRule';
import { getEmptyCells } from './utils';

/**
 * Spawn a new tile (1, 2, or 3) in a random empty cell using Threes spawn weights.
 * Returns new board with spawned tile, or original board if no empty cells.
 */
export function spawnTile(board: Tile[][]): Tile[][] {
  const emptyCells = getEmptyCells(board);

  if (emptyCells.length === 0) {
    return board;
  }

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const { row, col } = emptyCells[randomIndex];

  const value = getSpawnValue(SPAWN_WEIGHTS);

  const newBoard = board.map((rowArr, r) =>
    rowArr.map((cell, c) => (r === row && c === col ? value : cell))
  );

  return newBoard;
}
