import { award, type VestingEvent } from '../data/equity'
export const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
export const number = (value: number) => new Intl.NumberFormat('en-US').format(value)
export const estimatedValue = (quantity: number, price: number) => quantity * price
export const scheduleTotals = (events: VestingEvent[]) => events.reduce((sum, event) => sum + event.quantity, 0)
export const remainingEvents = (events: VestingEvent[]) => events.filter((event) => event.status === 'Upcoming')
export const reconciles = () => award.vested + award.unvested === award.granted && award.available + award.sold === award.vested
