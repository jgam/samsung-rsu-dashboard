export type VestingStatus = 'vested' | 'upcoming'

export interface VestingEvent { date: string; quantity: number; status: VestingStatus }
export interface Transaction { date: string; type: string; quantity: number; price: number }
export interface StockPlan { employee: string; awardId: string; awardType: string; grantDate: string; asOfDate: string; granted: number; vested: number; unvested: number; sold: number; available: number; sharePrice: number; schedule: VestingEvent[]; transactions: Transaction[] }
export type StockPlanLoader = () => Promise<StockPlan>

// Deliberately fictional, local demonstration data. Replace this module with an API adapter later.
export const stockPlan: StockPlan = {
  employee: 'Alex Kim', awardId: 'RSU-2024-001', awardType: 'Restricted Stock Units', grantDate: '2024-02-20', asOfDate: '2026-08-20',
  granted: 100_000, vested: 50_000, unvested: 50_000, sold: 0, available: 50_000, sharePrice: 42.5, transactions: [],
  schedule: [
    { date: '2025-02-20', quantity: 25_000, status: 'vested' }, { date: '2026-02-20', quantity: 25_000, status: 'vested' },
    { date: '2027-02-20', quantity: 25_000, status: 'upcoming' }, { date: '2028-02-20', quantity: 25_000, status: 'upcoming' },
  ],
}

// This adapter is deliberately local. An API-backed loader can replace it without changing UI components.
export const loadMockStockPlan: StockPlanLoader = async () => stockPlan
