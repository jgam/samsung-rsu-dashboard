export const formatNumber = (value) => new Intl.NumberFormat('en-US').format(value);
export const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
export const formatSharePrice = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(value);
export const formatDate = (date) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`));

export function calculateSummary(grant, sharePrice) {
  const unvested = grant.granted - grant.vested;
  const available = grant.vested - grant.sold;
  return {
    ...grant,
    unvested,
    available,
    vestedValue: grant.vested * sharePrice,
    unvestedValue: unvested * sharePrice,
    totalValue: grant.granted * sharePrice,
    progress: (grant.vested / grant.granted) * 100,
  };
}

export function getVestingEvents(schedule) {
  const upcoming = schedule.filter((event) => event.status === 'Upcoming');
  return { next: upcoming[0] ?? null, final: upcoming.at(-1) ?? null };
}
