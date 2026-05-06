function pad (n) {
  return String(n).padStart(2, '0')
}
function formatTime (ms) {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const centiseconds = Math.floor((ms % 1000) / 10)
  return `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`
}

function calculateElapsedMs (startTimestamp, nowTimestamp, pausedMs) {
  return nowTimestamp - startTimestamp - pausedMs
}

function recordLap (lapTimestamps, currentElapsedMs) {
  return [...lapTimestamps, currentElapsedMs]
}

function getLapDuration (lapTimestamps, index) {
  if (index === 0) return lapTimestamps[0]
  return lapTimestamps[index] - lapTimestamps[index - 1]
}

function parseCountdownMs (minutes, seconds) {
  const mins = parseInt(minutes, 10) || 0
  const secs = parseInt(seconds, 10) || 0
  return (mins * 60 + secs) * 1000
}

function getRemainingMs (totalMs, elapsedMs) {
  return Math.max(0, totalMs - elapsedMs)
}

function isCountdownComplete (remainingMs) {
  return remainingMs <= 0
}

function getBestLapIndex (lapTimestamps) {
  if (lapTimestamps.length === 0) return -1
  const splits = lapTimestamps.map((ts, i) => i === 0 ? ts : ts - lapTimestamps[i - 1])
  const min = Math.min(...splits)
  return splits.indexOf(min)
}

module.exports = { pad, formatTime, calculateElapsedMs, recordLap, getLapDuration, parseCountdownMs, getRemainingMs, isCountdownComplete, getBestLapIndex }
