export const employee = { name: 'Alex Kim', fictional: true };

export const grant = {
  id: 'RSU-2024-001',
  type: 'Restricted Stock Units',
  grantDate: '2024-02-20',
  granted: 100000,
  vested: 50000,
  sold: 0,
  asOfDate: '2026-08-20',
};

export const vestingSchedule = [
  { date: '2025-02-20', quantity: 25000, status: 'Vested' },
  { date: '2026-02-20', quantity: 25000, status: 'Vested' },
  { date: '2027-02-20', quantity: 25000, status: 'Upcoming' },
  { date: '2028-02-20', quantity: 25000, status: 'Upcoming' },
];

export const transactions = [];
