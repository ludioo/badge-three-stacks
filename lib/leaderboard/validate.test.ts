/**
 * Unit tests for leaderboard API validation (parseAddress, parseScore, parseLimitOffset).
 * Keeps route handlers thin; validation at boundary per backend rules.
 */
import { describe, expect, it } from 'vitest'
import { parseAddress, parseScore, parseLimitOffset } from '@/lib/leaderboard/validate'

describe('parseAddress', () => {
  it('returns value for valid Stacks mainnet address', () => {
    const addr = 'SP3ABC1234567890ABCDEFGHJKLMNPQRSTVVWXYZ0'
    const result = parseAddress(addr)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value).toBe(addr)
  })

  it('returns value for valid testnet address', () => {
    const addr = 'ST1PQHQKV0RJXZF1QWBG18YR7Q1E3YXB6A0'
    const result = parseAddress(addr)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value).toBe(addr)
  })

  it('trims whitespace', () => {
    const result = parseAddress('  ST1PQHQKV0RJXZF1QWBG18YR7Q1E3YXB6A0  ')
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value).toBe('ST1PQHQKV0RJXZF1QWBG18YR7Q1E3YXB6A0')
  })

  it('returns error for empty string', () => {
    const result = parseAddress('')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.message).toBe('Address is required')
  })

  it('returns error for whitespace-only', () => {
    const result = parseAddress('   ')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.message).toBe('Address is required')
  })

  it('returns error for invalid format (too short)', () => {
    const result = parseAddress('ST123')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.message).toBe('Invalid Stacks address format')
  })

  it('returns error for invalid prefix', () => {
    const result = parseAddress('XX1PQHQKV0RJXZF1QWBG18YR7Q1E3YXB6A0')
    expect(result.ok).toBe(false)
  })

  it('returns error for null-like input', () => {
    const result = parseAddress(null as unknown as string)
    expect(result.ok).toBe(false)
  })
})

describe('parseScore', () => {
  it('returns value for valid non-negative integer', () => {
    const zero = parseScore(0)
    expect(zero.ok).toBe(true)
    if (zero.ok) expect(zero.value).toBe(0)
    const r = parseScore(1024)
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.value).toBe(1024)
  })

  it('accepts string number', () => {
    const r = parseScore('2048')
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.value).toBe(2048)
  })

  it('returns error for negative number', () => {
    const result = parseScore(-1)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.message).toBe('Score must be a non-negative integer')
  })

  it('returns error for NaN', () => {
    const result = parseScore(NaN)
    expect(result.ok).toBe(false)
  })

  it('returns error for non-integer', () => {
    const result = parseScore(3.14)
    expect(result.ok).toBe(false)
  })

  it('returns error for invalid type', () => {
    const result = parseScore({} as unknown as number)
    expect(result.ok).toBe(false)
  })
})

describe('parseLimitOffset', () => {
  it('returns default limit and offset when null', () => {
    const { limit, offset } = parseLimitOffset(null, null)
    expect(limit).toBe(50)
    expect(offset).toBe(0)
  })

  it('clamps limit between 1 and 100', () => {
    expect(parseLimitOffset('0', null).limit).toBe(1)
    expect(parseLimitOffset('1', null).limit).toBe(1)
    expect(parseLimitOffset('100', null).limit).toBe(100)
    expect(parseLimitOffset('200', null).limit).toBe(100)
  })

  it('parses valid limit and offset', () => {
    const { limit, offset } = parseLimitOffset('10', '5')
    expect(limit).toBe(10)
    expect(offset).toBe(5)
  })

  it('uses 0 for invalid offset', () => {
    const { offset } = parseLimitOffset(null, 'invalid')
    expect(offset).toBe(0)
  })
})
