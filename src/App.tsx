import { useState } from 'react'
import { stockPlan } from './data/stockPlan'
import { estimatedValue, finalVesting, formatCurrency, formatDate, formatNumber, hasTransactions, nextVesting, vestingPercent } from './lib/stockPlan'

const plan = stockPlan
const stats = [{ label: 'Granted', value: plan.granted }, { label: 'Vested', value: plan.vested }, { label: 'Unvested', value: plan.unvested }, { label: 'Available', value: plan.available }, { label: 'Sold', value: plan.sold }]

function App() {
  const [view, setView] = useState<'overview' | 'details'>('overview')
  const [price, setPrice] = useState(plan.sharePrice)
  const next = nextVesting(plan.schedule)
  const final = finalVesting(plan.schedule)
  const vestedValue = estimatedValue(plan.vested, price)
  const unvestedValue = estimatedValue(plan.unvested, price)

  return <div className="app-shell">
    <aside className="sidebar"><a className="brand" href="#overview">Equitywise</a><nav aria-label="Primary navigation"><button className={view === 'overview' ? 'active' : ''} onClick={() => setView('overview')}>Overview</button><button className={view === 'details' ? 'active' : ''} onClick={() => setView('details')}>Grant details</button><button disabled>Transactions</button></nav><div className="profile"><span>AK</span><div><strong>Alex Kim</strong><small>Demo employee</small></div></div></aside>
    <main><header><div><p>Welcome back, Alex</p><h1>{view === 'overview' ? 'Stock plan overview' : 'Grant details'}</h1></div><div className="disclaimer">Demo data · Not financial or tax advice</div></header>
      <section className="content" aria-live="polite">
        <div className="notice">This fictional demonstration does not use brokerage, employee, or live market data.</div>
        <section className="summary-grid" aria-label="Award summary"><article className="award-card"><div className="card-heading"><div><h2>{plan.awardId}</h2><p>{plan.awardType} · Granted {formatDate(plan.grantDate)}</p></div><button className="link-button" onClick={() => setView(view === 'overview' ? 'details' : 'overview')}>{view === 'overview' ? 'View award details' : 'Back to overview'} →</button></div><div className="stats">{stats.map((stat) => <div key={stat.label}><span>{stat.label}</span><strong>{formatNumber(stat.value)}</strong></div>)}</div></article>
          <article className="value-card"><span>Illustrative estimated value</span><p>{formatCurrency(vestedValue)}</p><small>Vested RSUs at ${price.toFixed(2)} mock share price</small><label>Adjust mock share price<input aria-label="Mock share price" type="number" min="0" step="0.5" value={price} onChange={(event) => setPrice(Number(event.target.value) || 0)} /></label></article></section>
        <section className="two-column"><article className="panel"><div className="panel-heading"><div><h2>Vesting progress</h2><p>{formatNumber(plan.vested)} of {formatNumber(plan.granted)} RSUs vested</p></div><strong>{vestingPercent(plan)}%</strong></div><div className="progress" aria-label={`${vestingPercent(plan)} percent vested`}><span style={{ width: `${vestingPercent(plan)}%` }} /></div><div className="value-breakdown"><div><span>Vested value</span><strong>{formatCurrency(vestedValue)}</strong></div><div><span>Unvested value</span><strong>{formatCurrency(unvestedValue)}</strong></div></div></article>
          <article className="next-card"><span>Next vesting</span><strong>{next ? `${formatNumber(next.quantity)} RSUs` : 'No upcoming events'}</strong><p>{next ? formatDate(next.date) : '—'}</p><small>Final event: {final ? formatDate(final.date) : '—'}</small></article></section>
        <section className="table-panel"><div className="panel-heading"><div><h2>Vesting schedule</h2><p>Four annual installments · 25% each</p></div><span className="as-of">As of {formatDate(plan.asOfDate)}</span></div><div className="table-wrap"><table><thead><tr><th>Date</th><th>Quantity</th><th>Status</th></tr></thead><tbody>{plan.schedule.map((event) => <tr key={event.date}><td>{formatDate(event.date)}</td><td>{formatNumber(event.quantity)} RSUs</td><td><span className={`status ${event.status}`}>{event.status}</span></td></tr>)}</tbody></table></div></section>
        <section className="history-panel"><h2>Transaction history</h2>{hasTransactions(plan) ? <p>Transactions are available.</p> : <div className="empty"><b>▱</b><h3>No transactions yet</h3><p>No sales have been recorded for this fictional award.</p></div>}</section>
      </section>
  </main></div>
}
export default App
