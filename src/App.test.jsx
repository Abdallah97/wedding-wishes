import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Mock canvas-confetti change
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('App component', () => {
  it('renders the header and primary wedding wishes container', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/يُمنـى/i);
    expect(heading).toHaveTextContent(/عبدُ الله/i);
  });

  it('renders carousel navigation controls', () => {
    render(<App />);
    const prevButton = screen.getByRole('button', { name: /السابق/i });
    const nextButton = screen.getByRole('button', { name: /التالي/i });
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('navigates through wishes when next button is clicked', () => {
    render(<App />);
    const nextButton = screen.getByRole('button', { name: /التالي/i });
    expect(screen.getByText(/1 \//)).toBeInTheDocument();
    fireEvent.click(nextButton);
    expect(screen.getByText(/2 \//)).toBeInTheDocument();
  });

  it('allows switching to grid view', () => {
    render(<App />);
    const gridBtn = screen.getByRole('button', { name: /شبكة/i });
    expect(gridBtn).toBeInTheDocument();
    fireEvent.click(gridBtn);
    // In grid view, multiple wish cards or author names are rendered
    expect(screen.getByPlaceholderText(/ابحث باسم المهنئ/i)).toBeInTheDocument();
  });
});
