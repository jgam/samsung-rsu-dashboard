import { describe, expect, it } from 'vitest'
import { loadMockStockPlan, stockPlan } from '../data/stockPlan'
import { estimatedValue, finalVesting, formatCurrency, formatDate, formatNumber, hasTransactions, nextVesting, totalsReconcile, vestingPercent } from './stockPlan'

describe('stock plan calculations', () => {
  it('calculates illustrative values from a changed mock share price', () => {
    expect(estimatedValue(stockPlan.vested, 42.5)).toBe(2_125_000)
    expect(estimatedValue(stockPlan.unvested, 50)).toBe(2_500_000)
    expect(formatCurrency(2_125_000)).toBe('$2,125,000')
  })
  it('reports the baseline totals and vesting progress', () => {
    expect(totalsReconcile(stockPlan)).toBe(true)
    expect(vestingPercent(stockPlan)).toBe(50)
    expect(formatNumber(stockPlan.granted)).toBe('100,000')
  })
  it('identifies schedule status, next event, and final event', () => {
    expect(nextVesting(stockPlan.schedule)).toMatchObject({ date: '2027-02-20', quantity: 25_000, status: 'upcoming' })
    expect(finalVesting(stockPlan.schedule)).toMatchObject({ date: '2028-02-20', quantity: 25_000, status: 'upcoming' })
    expect(formatDate('2027-02-20')).toBe('Feb 20, 2027')
  })
  it('handles a zero-grant plan and an empty transaction history', () => {
    expect(vestingPercent({ ...stockPlan, granted: 0 })).toBe(0)
    expect(hasTransactions(stockPlan)).toBe(false)
    expect(nextVesting([])).toBeUndefined()
    expect(finalVesting([])).toBeUndefined()
  })
  it('rejects totals that do not reconcile', () => {
    expect(totalsReconcile({ ...stockPlan, available: 49_999 })).toBe(false)
  })
  it('loads the local fictional data through a replaceable adapter', async () => {
    await expect(loadMockStockPlan()).resolves.toEqual(stockPlan)
  })
})
