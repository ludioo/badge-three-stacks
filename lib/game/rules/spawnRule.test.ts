import { describe, it, expect, vi } from 'vitest';
import { getSpawnValue, DEFAULT_SPAWN_WEIGHTS } from './spawnRule';

describe('getSpawnValue', () => {
  it('should return 1 when random is below weight 1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    expect(getSpawnValue()).toBe(1);
    vi.restoreAllMocks();
  });

  it('should return 2 when random is in [0.4, 0.8)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(getSpawnValue()).toBe(2);
    vi.restoreAllMocks();
  });

  it('should return 3 when random is >= 0.8', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9);
    expect(getSpawnValue()).toBe(3);
    vi.restoreAllMocks();
  });

  it('should return only 1, 2, or 3 with custom weights', () => {
    const weights = { 1: 1, 2: 0, 3: 0 };
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(getSpawnValue(weights)).toBe(1);
    vi.restoreAllMocks();
  });

  it('should respect custom weights', () => {
    const weights = { 1: 0, 2: 0, 3: 1 };
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(getSpawnValue(weights)).toBe(3);
    vi.restoreAllMocks();
  });
});

describe('DEFAULT_SPAWN_WEIGHTS', () => {
  it('should sum to 1', () => {
    const sum = DEFAULT_SPAWN_WEIGHTS[1] + DEFAULT_SPAWN_WEIGHTS[2] + DEFAULT_SPAWN_WEIGHTS[3];
    expect(sum).toBe(1);
  });
});
