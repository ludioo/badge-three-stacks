import { describe, it, expect, beforeEach } from 'vitest';
import { gameReducer } from './reducer';
import type { GameState } from './types';
import { createEmptyBoard } from './utils';

describe('gameReducer', () => {
  let initialState: GameState;

  beforeEach(() => {
    initialState = {
      board: createEmptyBoard(),
      score: 0,
      status: 'playing',
    };
  });

  describe('RESTART', () => {
    it('should reset game state and spawn 2 initial tiles (values 1, 2, or 3)', () => {
      const state: GameState = {
        board: [
          [3, 6, 12, 24],
          [6, 12, 24, 48],
          [12, 24, 48, 96],
          [24, 48, 96, 192],
        ],
        score: 1000,
        status: 'gameover',
      };

      const newState = gameReducer(state, { type: 'RESTART' });

      expect(newState.score).toBe(0);
      expect(newState.status).toBe('playing');

      let tileCount = 0;
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          if (newState.board[row][col] !== null) {
            tileCount++;
            expect([1, 2, 3]).toContain(newState.board[row][col]);
          }
        }
      }
      expect(tileCount).toBe(2);
    });
  });

  describe('SLIDE_LEFT', () => {
    it('should slide tiles left and merge 1+2 to 3', () => {
      const state: GameState = {
        board: [
          [null, 1, null, 2],
          [null, null, null, null],
          [null, null, null, null],
          [null, null, null, null],
        ],
        score: 0,
        status: 'playing',
      };

      const newState = gameReducer(state, { type: 'SLIDE_LEFT' });

      expect(newState.board[0][0]).toBe(3);
      expect(newState.score).toBeGreaterThan(0);
      expect(newState.status).toBe('playing');
    });

    it('should slide tiles left and merge 3+3 to 6', () => {
      const state: GameState = {
        board: [
          [null, 3, null, 3],
          [null, null, null, null],
          [null, null, null, null],
          [null, null, null, null],
        ],
        score: 0,
        status: 'playing',
      };

      const newState = gameReducer(state, { type: 'SLIDE_LEFT' });

      expect(newState.board[0][0]).toBe(6);
      expect(newState.score).toBe(6);
    });

    it('should not change state if no moves possible', () => {
      const state: GameState = {
        board: [
          [3, 6, 12, 24],
          [null, null, null, null],
          [null, null, null, null],
          [null, null, null, null],
        ],
        score: 100,
        status: 'playing',
      };

      const newState = gameReducer(state, { type: 'SLIDE_LEFT' });

      expect(newState.board).toEqual(state.board);
      expect(newState.score).toBe(100);
    });

    it('should not allow moves when game is over', () => {
      const state: GameState = {
        board: [
          [3, 6, 12, 24],
          [6, 12, 24, 48],
          [12, 24, 48, 96],
          [24, 48, 96, 192],
        ],
        score: 1000,
        status: 'gameover',
      };

      const newState = gameReducer(state, { type: 'SLIDE_LEFT' });

      expect(newState).toEqual(state);
    });

    it('should spawn new tile after valid move', () => {
      const state: GameState = {
        board: [
          [null, 3, null, null],
          [null, null, null, null],
          [null, null, null, null],
          [null, null, null, null],
        ],
        score: 0,
        status: 'playing',
      };

      const newState = gameReducer(state, { type: 'SLIDE_LEFT' });

      let tileCount = 0;
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          if (newState.board[row][col] !== null) {
            tileCount++;
          }
        }
      }
      expect(tileCount).toBe(2);
    });
  });

  describe('SLIDE_RIGHT', () => {
    it('should slide tiles right and merge 2+1 to 3', () => {
      const state: GameState = {
        board: [
          [1, null, null, 2],
          [null, null, null, null],
          [null, null, null, null],
          [null, null, null, null],
        ],
        score: 0,
        status: 'playing',
      };

      const newState = gameReducer(state, { type: 'SLIDE_RIGHT' });

      expect(newState.board[0][3]).toBe(3);
      expect(newState.score).toBe(3);
    });
  });

  describe('SLIDE_UP', () => {
    it('should slide tiles up and merge 1+2 to 3', () => {
      const state: GameState = {
        board: [
          [null, null, null, null],
          [1, null, null, null],
          [null, null, null, null],
          [2, null, null, null],
        ],
        score: 0,
        status: 'playing',
      };

      const newState = gameReducer(state, { type: 'SLIDE_UP' });

      expect(newState.board[0][0]).toBe(3);
      expect(newState.score).toBe(3);
    });
  });

  describe('SLIDE_DOWN', () => {
    it('should slide tiles down and merge 3+3 to 6', () => {
      const state: GameState = {
        board: [
          [3, null, null, null],
          [null, null, null, null],
          [null, null, null, null],
          [3, null, null, null],
        ],
        score: 0,
        status: 'playing',
      };

      const newState = gameReducer(state, { type: 'SLIDE_DOWN' });

      expect(newState.board[3][0]).toBe(6);
      expect(newState.score).toBe(6);
    });
  });

  describe('SPAWN_TILE', () => {
    it('should spawn tile at specified position', () => {
      const state: GameState = {
        board: createEmptyBoard(),
        score: 0,
        status: 'playing',
      };

      const newState = gameReducer(state, {
        type: 'SPAWN_TILE',
        row: 1,
        col: 2,
        value: 3,
      });

      expect(newState.board[1][2]).toBe(3);
    });

    it('should not spawn if cell is not empty', () => {
      const state: GameState = {
        board: [
          [1, null, null, null],
          [null, null, null, null],
          [null, null, null, null],
          [null, null, null, null],
        ],
        score: 0,
        status: 'playing',
      };

      const newState = gameReducer(state, {
        type: 'SPAWN_TILE',
        row: 0,
        col: 0,
        value: 3,
      });

      expect(newState.board[0][0]).toBe(1);
    });

    it('should not spawn if game is over', () => {
      const state: GameState = {
        board: createEmptyBoard(),
        score: 0,
        status: 'gameover',
      };

      const newState = gameReducer(state, {
        type: 'SPAWN_TILE',
        row: 1,
        col: 2,
        value: 3,
      });

      expect(newState).toEqual(state);
    });
  });

  describe('Game Over Detection', () => {
    it('should keep status playing when board full and no move changes state', () => {
      const state: GameState = {
        board: [
          [3, 6, 12, 24],
          [6, 12, 24, 48],
          [12, 24, 48, 96],
          [24, 48, 96, 192],
        ],
        score: 1000,
        status: 'playing',
      };

      const newState = gameReducer(state, { type: 'SLIDE_LEFT' });

      expect(newState.status).toBe('playing');
    });
  });
});
