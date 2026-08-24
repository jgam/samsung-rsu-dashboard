export type VestingStatus = 'Vested' | 'Upcoming'
export type VestingEvent = { date: string; quantity: number; status: VestingStatus }
export const award = { id: 'RSU-2024-001', employee: 'Alex Kim', grantDate: '2024-02-20', granted: 100000, vested: 50000, unvested: 50000, sold: 0, available: 50000, asOf: '2026-08-20', sharePrice: 42.5, type: 'Restricted Stock Units' } as const
export const schedule: VestingEvent[] = [
  { date: '2025-02-20', quantity: 25000, status: 'Vested' }, { date: '2026-02-20', quantity: 25000, status: 'Vested' }, { date: '2027-02-20', quantity: 25000, status: 'Upcoming' }, { date: '2028-02-20', quantity: 25000, status: 'Upcoming' },
]
export const transactions: never[] = []
