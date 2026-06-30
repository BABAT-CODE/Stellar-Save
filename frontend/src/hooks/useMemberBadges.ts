import { useState, useEffect } from 'react';

// ── Badge type definitions ─────────────────────────────────────────────────────

export type BadgeType =
  | 'FirstContribution'
  | 'CycleMaster'
  | 'GroupFounder'
  | 'LoyalMember'
  | 'PayoutReceived'
  | 'StreakKeeper';

export interface MemberBadge {
  /** Unique badge identifier */
  id: string;
  /** Semantic type used for rendering artwork and colour */
  type: BadgeType;
  /** Human-readable title */
  title: string;
  /** Short description of how the badge was earned */
  description: string;
  /** When the badge was earned */
  earnedDate: Date;
  /** URL or data-URI for the badge artwork (emoji-based SVG fallback used in gallery) */
  artworkUrl: string;
}

// ── Badge catalogue ───────────────────────────────────────────────────────────

const BADGE_CATALOGUE: Record<BadgeType, { title: string; description: string }> = {
  FirstContribution: {
    title: 'First Contribution',
    description: 'Made your very first contribution to a savings group.',
  },
  CycleMaster: {
    title: 'Cycle Master',
    description: 'Completed all contributions across a full cycle without missing one.',
  },
  GroupFounder: {
    title: 'Group Founder',
    description: 'Created and launched a savings group with active members.',
  },
  LoyalMember: {
    title: 'Loyal Member',
    description: 'Stayed active in a group for 6 or more consecutive cycles.',
  },
  PayoutReceived: {
    title: 'Payout Received',
    description: 'Successfully received a full pool payout as the cycle recipient.',
  },
  StreakKeeper: {
    title: 'Streak Keeper',
    description: 'Maintained a contribution streak of 10 or more cycles.',
  },
};

// ── Mock data layer ────────────────────────────────────────────────────────────
//
// Replace with a real call to the Soroban contract's `get_member_badges` view:
//
//   const client = new StellarSaveContractClient({ contractId, networkPassphrase, rpcUrl });
//   const rawBadges = await client.get_member_badges({ wallet: address });
//
// The mock returns badges for addresses whose first character is A–M (lower or
// upper) and an empty array for all others, making both UI states easy to test.

function mockBadgesForAddress(address: string): MemberBadge[] {
  if (!address) return [];

  const firstChar = address[0].toUpperCase();
  const hasBadges = firstChar >= 'A' && firstChar <= 'M';
  if (!hasBadges) return [];

  // Seed deterministic dates based on the address characters
  const seed = address.charCodeAt(0) % 12; // 0–11 for month offset

  const makeBadge = (type: BadgeType, monthsAgo: number): MemberBadge => {
    const cat = BADGE_CATALOGUE[type];
    const earned = new Date();
    earned.setMonth(earned.getMonth() - monthsAgo);
    return {
      id: `${address}-${type}`,
      type,
      title: cat.title,
      description: cat.description,
      earnedDate: earned,
      artworkUrl: '', // gallery uses emoji artwork; a real impl would return an IPFS/Arweave URI
    };
  };

  const badges: MemberBadge[] = [
    makeBadge('FirstContribution', 6 + seed),
    makeBadge('CycleMaster', 3 + (seed % 3)),
  ];

  // Give extra badges to addresses starting with A–F
  if (firstChar <= 'F') {
    badges.push(makeBadge('PayoutReceived', 1 + (seed % 2)));
  }

  // Give GroupFounder to A–C
  if (firstChar <= 'C') {
    badges.push(makeBadge('GroupFounder', seed));
  }

  return badges;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export interface UseMemberBadgesResult {
  badges: MemberBadge[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Fetches the soulbound completion/membership badges for a given wallet address.
 *
 * Currently backed by a mock; swap `mockBadgesForAddress` for a real
 * `contractClient.get_member_badges({ wallet: address })` call when the
 * contract view is deployed.
 */
export function useMemberBadges(address: string | undefined): UseMemberBadgesResult {
  const [badges, setBadges] = useState<MemberBadge[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setBadges([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate async contract call latency
    const timer = setTimeout(() => {
      try {
        const result = mockBadgesForAddress(address);
        setBadges(result);
      } catch {
        setError('Failed to load member badges.');
        setBadges([]);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [address]);

  return { badges, isLoading, error };
}
