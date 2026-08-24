import { describe, expect, it } from 'vitest';
import { grant, vestingSchedule } from '../data/rsuData';
import { calculateSummary, formatCurrency, formatDate, formatNumber, formatSharePrice, getVestingEvents } from './rsu';

describe('RSU calculations', () => {
  it('reconciles baseline quantities and market values', () => {
    expect(calculateSummary(grant, 42.5)).toMatchObject({ unvested: 50000, available: 50000, vestedValue: 2125000, unvestedValue: 2125000, totalValue: 4250000, progress: 50 });
  });
  it('updates every estimated value when the share price changes', () => {
    expect(calculateSummary(grant, 50)).toMatchObject({ vestedValue: 2500000, unvestedValue: 2500000, totalValue: 5000000 });
  });
  it('finds the next and final upcoming vesting events', () => {
    expect(getVestingEvents(vestingSchedule)).toEqual({ next: vestingSchedule[2], final: vestingSchedule[3] });
  });
  it('handles a completed vesting schedule', () => { expect(getVestingEvents([])).toEqual({ next: null, final: null }); });
  it('formats quantities, currency, share prices, and dates for display', () => {
    expect(formatNumber(100000)).toBe('100,000'); expect(formatCurrency(2125000)).toBe('$2,125,000'); expect(formatSharePrice(42.5)).toBe('$42.50'); expect(formatDate('2027-02-20')).toBe('Feb 20, 2027');
  });
});
