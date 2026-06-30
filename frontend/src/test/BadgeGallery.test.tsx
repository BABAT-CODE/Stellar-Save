import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BadgeGallery } from '../components/BadgeGallery';
import type { MemberBadge } from '../hooks/useMemberBadges';

const mockBadges: MemberBadge[] = [
  {
    id: 'addr-FirstContribution',
    type: 'FirstContribution',
    title: 'First Contribution',
    description: 'Made your very first contribution to a savings group.',
    earnedDate: new Date('2025-01-15'),
    artworkUrl: '',
  },
  {
    id: 'addr-CycleMaster',
    type: 'CycleMaster',
    title: 'Cycle Master',
    description: 'Completed all contributions across a full cycle.',
    earnedDate: new Date('2025-04-01'),
    artworkUrl: '',
  },
];

describe('BadgeGallery', () => {
  it('renders badge cards for each badge provided', () => {
    render(<BadgeGallery badges={mockBadges} />);
    expect(screen.getByText('First Contribution')).toBeInTheDocument();
    expect(screen.getByText('Cycle Master')).toBeInTheDocument();
  });

  it('shows the empty state when badges array is empty', () => {
    render(<BadgeGallery badges={[]} />);
    expect(screen.getByText('No badges yet')).toBeInTheDocument();
    expect(
      screen.getByText(/Earn badges by completing contribution cycles/i),
    ).toBeInTheDocument();
  });

  it('does not render badge cards when empty', () => {
    render(<BadgeGallery badges={[]} />);
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });

  it('renders the correct number of badge articles', () => {
    render(<BadgeGallery badges={mockBadges} />);
    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(mockBadges.length);
  });

  it('calls onShare with the correct badge when share button is clicked', () => {
    const onShare = vi.fn();
    render(<BadgeGallery badges={mockBadges} onShare={onShare} />);

    const shareButtons = screen.getAllByRole('button', { name: /Share/i });
    fireEvent.click(shareButtons[0]);

    expect(onShare).toHaveBeenCalledTimes(1);
    expect(onShare).toHaveBeenCalledWith(mockBadges[0]);
  });

  it('calls onShare with the second badge when its share button is clicked', () => {
    const onShare = vi.fn();
    render(<BadgeGallery badges={mockBadges} onShare={onShare} />);

    const shareButtons = screen.getAllByRole('button', { name: /Share/i });
    fireEvent.click(shareButtons[1]);

    expect(onShare).toHaveBeenCalledWith(mockBadges[1]);
  });

  it('renders badge descriptions', () => {
    render(<BadgeGallery badges={mockBadges} />);
    expect(
      screen.getByText('Made your very first contribution to a savings group.'),
    ).toBeInTheDocument();
  });

  it('has correct accessible role on the gallery list', () => {
    render(<BadgeGallery badges={mockBadges} />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('each badge item is wrapped in a listitem role', () => {
    render(<BadgeGallery badges={mockBadges} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(mockBadges.length);
  });

  it('shows "No badges yet" status role for screen readers when empty', () => {
    render(<BadgeGallery badges={[]} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders badge icon regions with role=img', () => {
    render(<BadgeGallery badges={mockBadges} />);
    const imgRoles = screen.getAllByRole('img');
    // Each badge gets one icon img
    expect(imgRoles.length).toBeGreaterThanOrEqual(mockBadges.length);
  });

  it('renders earned date for each badge', () => {
    render(<BadgeGallery badges={mockBadges} />);
    // First badge earned Jan 2025
    expect(screen.getByText(/January 2025/i)).toBeInTheDocument();
    // Second badge earned Apr 2025
    expect(screen.getByText(/April 2025/i)).toBeInTheDocument();
  });
});
