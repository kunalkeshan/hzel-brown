import { describe, it, expect } from 'vitest'
import { formatCurrency } from './numbers'

describe('formatCurrency', () => {
  it('should format simple numbers with rupee symbol', () => {
    expect(formatCurrency(100)).toBe('₹100.00')
  })

  it('should format numbers with thousands separator', () => {
    expect(formatCurrency(1234.56)).toBe('₹1,234.56')
  })

  it('should format large numbers with Indian numbering system', () => {
    // Indian numbering: 1,00,000 (1 lakh)
    expect(formatCurrency(100000)).toBe('₹1,00,000.00')
  })

  it('should handle zero correctly', () => {
    expect(formatCurrency(0)).toBe('₹0.00')
  })

  it('should round decimals to 2 places', () => {
    expect(formatCurrency(99.999)).toBe('₹100.00')
    expect(formatCurrency(10.123)).toBe('₹10.12')
  })

  it('should format negative numbers', () => {
    expect(formatCurrency(-50)).toBe('-₹50.00')
  })
})
