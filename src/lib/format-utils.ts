export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'

  const abs = Math.abs(value)

  if (abs >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`
  }

  if (abs >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`
  }

  return value.toFixed(0)
}

export function formatDelta(
  value: number | null | undefined,
  options: {
    showSign?: boolean
    showPercent?: boolean
    decimals?: number
  } = {}
): string {
  if (value === null || value === undefined) return '—'

  const { showSign = true, showPercent = false, decimals = 1 } = options

  const sign = showSign && value > 0 ? '+' : ''
  const suffix = showPercent ? '%' : ''

  return `${sign}${value.toFixed(decimals)}${suffix}`
}

export function formatPercentage(value: number | null | undefined, decimals: number = 1): string {
  if (value === null || value === undefined) return '—'
  return `${value.toFixed(decimals)}%`
}

export function formatRatio(value: number | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined) return '—'
  return `${value.toFixed(decimals)}%`
}

export function formatDateShort(dateString: string | null | undefined): string {
  if (!dateString) return '—'

  const date = new Date(dateString)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${month}/${day}`
}

export function getDeltaColor(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'text-gray-500'
  if (value > 0) return 'text-green-600'
  if (value < 0) return 'text-red-600'
  return 'text-gray-500'
}

export function formatDeltaWithAbs(
  diff: number | null | undefined,
  pct: number | null | undefined
): string {
  if ((diff === null || diff === undefined) && (pct === null || pct === undefined)) {
    return '—'
  }

  const parts: string[] = []

  if (pct !== null && pct !== undefined) {
    const sign = pct > 0 ? '+' : ''
    parts.push(`${sign}${pct.toFixed(1)}%`)
  }

  if (diff !== null && diff !== undefined) {
    parts.push(`(${formatNumber(diff)})`)
  }

  return parts.join(' ')
}
