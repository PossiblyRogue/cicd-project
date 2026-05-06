const { pad, formatTime, calculateElapsedMs, recordLap, getLapDuration, parseCountdownMs, getRemainingMs, isCountdownComplete, getBestLapIndex } = require('../src/utils')

describe('pad', () => {
  test('pads a single digit with a leading zero', () => {
    expect(pad(5)).toBe('05')
  })
  test('does not pad a two-digit number', () => {
    expect(pad(42)).toBe('42')
  })
  test('pads zero to two digits', () => {
    expect(pad(0)).toBe('00')
  })
})

describe('formatTime', () => {
  test('formats zero milliseconds', () => {
    expect(formatTime(0)).toBe('00:00.00')
  })
  test('formats exactly one second', () => {
    expect(formatTime(1000)).toBe('00:01.00')
  })
  test('formats exactly one minute', () => {
    expect(formatTime(60000)).toBe('01:00.00')
  })
  test('formats fractional seconds as centiseconds', () => {
    expect(formatTime(1500)).toBe('00:01.50')
  })
  test('formats minutes beyond 59', () => {
    expect(formatTime(3723000)).toBe('62:03.00')
  })
  test('formats 999 ms as 99 centiseconds', () => {
    expect(formatTime(999)).toBe('00:00.99')
  })
})

describe('calculateElapsedMs', () => {
  test('returns the difference when there is no paused time', () => {
    expect(calculateElapsedMs(1000, 3000, 0)).toBe(2000)
  })
  test('subtracts paused duration from elapsed time', () => {
    expect(calculateElapsedMs(0, 5000, 1000)).toBe(4000)
  })
  test('returns zero when all elapsed time was paused', () => {
    expect(calculateElapsedMs(0, 3000, 3000)).toBe(0)
  })
})

describe('recordLap', () => {
  test('adds an elapsed time to an empty array', () => {
    expect(recordLap([], 5000)).toEqual([5000])
  })
  test('appends to an existing array of timestamps', () => {
    expect(recordLap([5000], 8000)).toEqual([5000, 8000])
  })
  test('does not mutate the original array', () => {
    const original = [5000]
    recordLap(original, 8000)
    expect(original).toEqual([5000])
  })
})

describe('getLapDuration', () => {
  test('first lap duration equals its own timestamp', () => {
    expect(getLapDuration([5000], 0)).toBe(5000)
  })
  test('second lap duration is the difference from the first', () => {
    expect(getLapDuration([5000, 8000], 1)).toBe(3000)
  })
  test('third lap duration is the difference from the second', () => {
    expect(getLapDuration([5000, 8000, 11500], 2)).toBe(3500)
  })
})

describe('parseCountdownMs', () => {
  test('converts minutes and seconds to milliseconds', () => {
    expect(parseCountdownMs(1, 30)).toBe(90000)
  })
  test('handles minutes with no seconds', () => {
    expect(parseCountdownMs(5, 0)).toBe(300000)
  })
  test('handles seconds with no minutes', () => {
    expect(parseCountdownMs(0, 45)).toBe(45000)
  })
  test('returns 0 for non-numeric string inputs', () => {
    expect(parseCountdownMs('abc', 'xyz')).toBe(0)
  })
  test('returns 0 when both inputs are zero', () => {
    expect(parseCountdownMs(0, 0)).toBe(0)
  })
})

describe('getRemainingMs', () => {
  test('returns the remaining time when elapsed is less than total', () => {
    expect(getRemainingMs(10000, 3000)).toBe(7000)
  })
  test('returns 0 when elapsed equals total', () => {
    expect(getRemainingMs(5000, 5000)).toBe(0)
  })
  test('clamps to 0 when elapsed exceeds total', () => {
    expect(getRemainingMs(5000, 6000)).toBe(0)
  })
})

describe('isCountdownComplete', () => {
  test('returns true when remaining time is zero', () => {
    expect(isCountdownComplete(0)).toBe(true)
  })
  test('returns false when remaining time is positive', () => {
    expect(isCountdownComplete(1000)).toBe(false)
  })
  test('returns true when remaining time is negative', () => {
    expect(isCountdownComplete(-1)).toBe(true)
  })
})

describe('getBestLapIndex', () => {
  test('returns -1 for an empty lap array', () => {
    expect(getBestLapIndex([])).toBe(-1)
  })
  test('returns 0 for a single lap', () => {
    expect(getBestLapIndex([5000])).toBe(0)
  })
  test('identifies the fastest lap by split time', () => {
    expect(getBestLapIndex([5000, 8000, 10000])).toBe(2)
  })
  test('returns the first occurrence when two laps share the best split', () => {
    expect(getBestLapIndex([3000, 6000, 9000])).toBe(0)
  })
  test('correctly picks the last lap as best', () => {
    expect(getBestLapIndex([5000, 12000, 13500])).toBe(2)
  })
})
