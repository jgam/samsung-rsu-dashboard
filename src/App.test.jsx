import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('shows the requested fictional grant, schedule, and empty transaction state', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'RSU overview' })).toBeInTheDocument();
    expect(screen.getAllByText('100,000').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Feb 20, 2027').length).toBeGreaterThan(0);
    expect(screen.getByText('No transactions yet')).toBeInTheDocument();
    expect(screen.getAllByText(/not financial or tax advice/i).length).toBeGreaterThan(0);
  });
  it('updates value cards when the mock share price changes', () => {
    render(<App />);
    fireEvent.change(screen.getByRole('slider', { name: 'Mock share price' }), { target: { value: 65 } });
    expect(screen.getAllByText('$6,500,000').length).toBeGreaterThan(0);
    expect(screen.getAllByText('$3,250,000').length).toBe(2);
  });
  it('shows controlled loading and error states', async () => {
    const user = userEvent.setup(); render(<App />);
    await user.click(screen.getByRole('button', { name: 'Preview loading' }));
    expect(screen.getByText('Loading fictional RSU data…')).toBeInTheDocument();
  });
  it('recovers from the error state', async () => {
    const user = userEvent.setup(); render(<App />);
    await user.click(screen.getByRole('button', { name: 'Preview error' }));
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(screen.getByRole('heading', { name: 'RSU overview' })).toBeInTheDocument();
  });
  it('activates sidebar navigation', async () => {
    const user = userEvent.setup(); render(<App />);
    await user.click(screen.getByRole('button', { name: 'Vesting' }));
    expect(screen.getByRole('button', { name: 'Vesting' })).toHaveClass('active');
  });
});
