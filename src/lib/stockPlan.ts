import type { StockPlan, VestingEvent } from '../data/stockPlan'

export const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value)
export const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
export const formatDate = (date: string) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`))
export const estimatedValue = (quantity: number, sharePrice: number) => quantity * sharePrice
export const vestingPercent = (plan: StockPlan) => plan.granted === 0 ? 0 : (plan.vested / plan.granted) * 100
export const nextVesting = (schedule: VestingEvent[]) => schedule.find((event) => event.status === 'upcoming')
export const finalVesting = (schedule: VestingEvent[]) => schedule.filter((event) => event.status === 'upcoming').at(-1)
export const totalsReconcile = (plan: StockPlan) => plan.granted === plan.vested + plan.unvested && plan.available === plan.vested - plan.sold
export const hasTransactions = (plan: StockPlan) => plan.transactions.length > 0
