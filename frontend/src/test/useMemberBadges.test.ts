import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useMemberBadges } from '../hooks/useMemberBadges';

describe('useMemberBadges', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns isLoading=true initially when an address is provided', () => {
    const { result } = renderHook(() =>
      useMemberBadges('ABCDEFGHIJKLMNOP1234567890123456789012345'),
    );
    expect(result.current.isLoading).toBe(true);
    expect(result.current.badges).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('returns badges for a wallet address starting with A–M', async () => {
    const address = 'ABCDEFGHIJKLMNOP1234567890123456789012345';
    const { result } = renderHook(() => useMemberBadges(address));

    // Fast-forward the async mock delay
    vi.runAllTimers();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.badges.length).toBeGreaterThan(0);
    // Each badge has the required fields
    const first = result.current.badges[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('type');
    expect(first).toHaveProperty('title');
    expect(first).toHaveProperty('description');
    expect(first).toHaveProperty('earnedDate');
    expect(first.earnedDate).toBeInstanceOf(Date);
  });

  it('returns an empty array for an address outside A–M range', async () => {
    // Address starting with 'Z' (outside A–M)
    const address = 'ZBCDEFGHIJKLMNOP1234567890123456789012345';
    const { result } = renderHook(() => useMemberBadges(address));

    vi.runAllTimers();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.badges).toEqual([]);
  });

  it('returns empty state with no error when address is undefined', async () => {
    const { result } = renderHook(() => useMemberBadges(undefined));

    // No timer needed – undefined short-circuits immediately
    expect(result.current.isLoading).toBe(false);
    expect(result.current.badges).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('clears badges and resets state when address becomes undefined', async () => {
    let address: string | undefined = 'ABCDEFGHIJKLMNOP1234567890123456789012345';
    const { result, rerender } = renderHook(() => useMemberBadges(address));

    vi.runAllTimers();
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.badges.length).toBeGreaterThan(0);

    // Change to undefined
    address = undefined;
    rerender();

    await waitFor(() => {
      expect(result.current.badges).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  it('badge IDs are unique within the result set', async () => {
    const address = 'ABCDEFGHIJKLMNOP1234567890123456789012345';
    const { result } = renderHook(() => useMemberBadges(address));

    vi.runAllTimers();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const ids = result.current.badges.map((b) => b.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('badge earnedDate values are in the past', async () => {
    const address = 'ABCDEFGHIJKLMNOP1234567890123456789012345';
    const { result } = renderHook(() => useMemberBadges(address));

    vi.runAllTimers();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const now = new Date();
    result.current.badges.forEach((badge) => {
      expect(badge.earnedDate.getTime()).toBeLessThanOrEqual(now.getTime());
    });
  });
});
