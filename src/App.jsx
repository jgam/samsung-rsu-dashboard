import { useState } from 'react';
import { employee, grant, transactions, vestingSchedule } from './data/rsuData';
import { calculateSummary, formatCurrency, formatDate, formatNumber, formatSharePrice, getVestingEvents } from './lib/rsu';

const navItems = ['Overview', 'Grants', 'Vesting', 'Transactions'];
const metricLabels = [
  ['Granted', 'granted'], ['Vested', 'vested'], ['Unvested', 'unvested'], ['Available', 'available'], ['Sold', 'sold'],
];

function MetricCard({ label, value, detail, tone = 'plain' }) {
  return <article className={`metric-card ${tone}`}><span>{label}</span><strong>{formatNumber(value)}</strong><small>{detail}</small></article>;
}

function EmptyTransactions() {
  return <div className="empty-state"><span aria-hidden="true">↗</span><div><strong>No transactions yet</strong><p>Alex has not sold any shares in this demonstration scenario.</p></div></div>;
}

function Schedule({ schedule }) {
  return <section className="panel schedule-panel" aria-labelledby="schedule-title">
    <div className="section-heading"><div><p className="eyebrow">Grant details</p><h2 id="schedule-title">Vesting schedule</h2></div><span className="term">4 years · 25% annually</span></div>
    <div className="schedule-list">
      {schedule.map((event) => <div className="schedule-item" key={event.date}>
        <span className={`status-dot ${event.status.toLowerCase()}`} aria-hidden="true" />
        <time dateTime={event.date}>{formatDate(event.date)}</time><b>{formatNumber(event.quantity)} RSUs</b><span className={`status ${event.status.toLowerCase()}`}>{event.status}</span>
      </div>)}
    </div>
  </section>;
}

export default function App() {
  const [sharePrice, setSharePrice] = useState(42.5);
  const [activeNav, setActiveNav] = useState('Overview');
  const [view, setView] = useState('ready');
  const summary = calculateSummary(grant, sharePrice);
  const events = getVestingEvents(vestingSchedule);

  if (view === 'loading') return <main className="state-screen" aria-live="polite"><div className="loader" /><p>Loading fictional RSU data…</p></main>;
  if (view === 'error') return <main className="state-screen" role="alert"><h1>We couldn’t load your RSU overview.</h1><button onClick={() => setView('ready')}>Try again</button></main>;

  return <div className="app-shell">
    <aside className="sidebar"><a className="brand" href="#overview" aria-label="Vestwise home"><i>⌁</i>Vestwise</a>
      <nav aria-label="Dashboard"><div>{navItems.map((item) => <button key={item} className={activeNav === item ? 'active' : ''} onClick={() => setActiveNav(item)}>{item}</button>)}</div></nav>
      <div className="demo-badge"><span>✓</span> Demo data only<br />Not financial or tax advice.</div>
    </aside>
    <main className="content" id="overview">
      <header><div><p className="eyebrow">Employee equity</p><h1>RSU overview</h1><p className="subtitle">{employee.name} · fictional employee profile</p></div><div className="header-actions"><button className="quiet-button" onClick={() => setView('loading')}>Preview loading</button><button className="quiet-button" onClick={() => setView('error')}>Preview error</button><div className="avatar" aria-label="Alex Kim">AK</div></div></header>
      <section className="hero-card"><div><p>RESTRICTED STOCK UNITS</p><h2>{formatNumber(summary.granted)} <span>RSUs</span></h2><strong>{formatNumber(summary.vested)} vested</strong></div><div className="hero-event"><span>Next vesting</span><b>{formatDate(events.next.date)}</b><small>{formatNumber(events.next.quantity)} RSUs</small></div></section>
      <section className="metrics" aria-label="RSU quantities">{metricLabels.map(([label, key]) => <MetricCard key={key} label={label} value={summary[key]} detail={key === 'sold' ? 'No sales' : `${Math.round((summary[key] / summary.granted) * 100)}% of grant`} tone={key === 'vested' ? 'mint' : key === 'unvested' ? 'blue' : 'plain'} />)}</section>
      <section className="dashboard-grid">
        <article className="panel value-panel"><div className="section-heading"><div><p className="eyebrow">Illustrative price</p><h2>Estimated value</h2></div><strong>{formatCurrency(summary.totalValue)}</strong></div>
          <label htmlFor="share-price">Mock share price <output>{formatSharePrice(sharePrice)}</output></label><input id="share-price" aria-label="Mock share price" type="range" min="20" max="65" step="0.5" value={sharePrice} onChange={(event) => setSharePrice(Number(event.target.value))} />
          <div className="value-breakdown"><div><span className="legend mint-dot" />Vested<strong>{formatCurrency(summary.vestedValue)}</strong><small>{formatNumber(summary.vested)} RSUs</small></div><div><span className="legend blue-dot" />Unvested<strong>{formatCurrency(summary.unvestedValue)}</strong><small>{formatNumber(summary.unvested)} RSUs</small></div></div>
        </article>
        <article className="panel upcoming-panel"><p className="eyebrow">Upcoming vesting</p><h2>{formatDate(events.next.date)}</h2><strong>{formatNumber(events.next.quantity)} RSUs</strong><p>Final vesting: <b>{formatDate(events.final.date)}</b></p><div className="timeline"><span style={{ width: `${summary.progress}%` }} /></div><small>2.5 of 4 years complete</small></article>
      </section>
      <Schedule schedule={vestingSchedule} />
      <section className="panel grants-panel"><div className="section-heading"><div><p className="eyebrow">Portfolio</p><h2>Grants</h2></div><span className="status vested">Active</span></div><div className="grant-row"><div><b>{grant.id}</b><span>{grant.type}</span></div><div><span>Grant date</span><b>{formatDate(grant.grantDate)}</b></div><div><span>Current estimated value</span><b>{formatCurrency(summary.totalValue)}</b></div></div></section>
      <section className="panel transaction-panel"><div className="section-heading"><div><p className="eyebrow">Activity</p><h2>Transaction history</h2></div><span>{transactions.length} transactions</span></div>{transactions.length === 0 ? <EmptyTransactions /> : null}</section>
      <footer>All values are fictional demonstration data and are not financial or tax advice.</footer>
    </main>
  </div>;
}
