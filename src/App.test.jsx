import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import App from './App';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('App component', () => {
  beforeEach(() => {
    localStorage.clear();
    cleanup();
  });

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
    expect(screen.getByPlaceholderText(/ابحث باسم المهنئ/i)).toBeInTheDocument();
  });

  it('persists love state into JSON in localStorage and restores it upon refresh/remount', () => {
    // Initial render
    const { unmount } = render(<App />);

    // Check love button on current wish (id: 1)
    const loveButton = screen.getByRole('button', { name: /أحببته/i });
    expect(loveButton).toBeInTheDocument();

    // Click love
    fireEvent.click(loveButton);

    // Verify it is saved in localStorage as valid JSON
    const storedJson = localStorage.getItem('wedding_wishes_likes_json');
    expect(storedJson).toBeTruthy();
    const parsed = JSON.parse(storedJson);
    expect(parsed[1]).toBe(true);

    // Button should now indicate unloving
    expect(screen.getByRole('button', { name: /إلغاء الإعجاب/i })).toBeInTheDocument();

    // Unmount and simulate page refresh by remounting App
    unmount();

    render(<App />);

    // Verify it restores the loved state from JSON
    expect(screen.getByRole('button', { name: /إلغاء الإعجاب/i })).toBeInTheDocument();
    expect(screen.getByText(/1 في المفضلة/i)).toBeInTheDocument();
  });

  it('filters wishes when clicking the favorites filter button', () => {
    // Pre-populate localStorage with love state for wish id: 2
    localStorage.setItem('wedding_wishes_likes_json', JSON.stringify({ 2: true }));

    render(<App />);

    // Click favorites toggle button
    const favButton = screen.getByRole('button', { name: /زر تصفية المفضلة/i });
    fireEvent.click(favButton);

    // Should only show 1 item now
    expect(screen.getByText(/1 \/ 1/)).toBeInTheDocument();
  });
});
