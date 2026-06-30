import './BadgeGallery.css';
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import type { MemberBadge, BadgeType } from '../hooks/useMemberBadges';

// ── Badge visual config ────────────────────────────────────────────────────────

const BADGE_COLORS: Record<BadgeType, string> = {
  FirstContribution: '#FFD700',
  CycleMaster: '#4CAF50',
  GroupFounder: '#2196F3',
  LoyalMember: '#9C27B0',
  PayoutReceived: '#FF5722',
  StreakKeeper: '#00BCD4',
};

const BADGE_EMOJIS: Record<BadgeType, string> = {
  FirstContribution: '🌟',
  CycleMaster: '🏆',
  GroupFounder: '👑',
  LoyalMember: '💎',
  PayoutReceived: '💰',
  StreakKeeper: '🔥',
};

// ── Props ──────────────────────────────────────────────────────────────────────

export interface BadgeGalleryProps {
  /** Array of badges to display. Pass an empty array to show the empty state. */
  badges: MemberBadge[];
  /** Called when the user clicks the share icon on a badge. */
  onShare?: (badge: MemberBadge) => void;
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function BadgeCard({
  badge,
  onShare,
  index,
}: {
  badge: MemberBadge;
  onShare?: (badge: MemberBadge) => void;
  index: number;
}) {
  const color = BADGE_COLORS[badge.type];
  const emoji = BADGE_EMOJIS[badge.type];
  const formattedDate = badge.earnedDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <Card
      className="badge-card badge-card-animated"
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        animationDelay: `${index * 60}ms`,
      }}
      role="article"
      aria-label={`${badge.title} badge, earned ${formattedDate}`}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, position: 'relative' }}>
        {/* Share button */}
        {onShare && (
          <Tooltip title={`Share ${badge.title} badge`} placement="top">
            <IconButton
              className="badge-share-btn"
              size="small"
              onClick={() => onShare(badge)}
              aria-label={`Share ${badge.title} badge`}
              sx={{ color: 'text.secondary' }}
            >
              <ShareIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        <Stack spacing={1}>
          {/* Artwork */}
          <Box
            className="badge-artwork"
            sx={{ bgcolor: `${color}22` }}
            role="img"
            aria-label={`${badge.type} badge icon`}
          >
            <span aria-hidden="true">{emoji}</span>
          </Box>

          {/* Title */}
          <Typography variant="subtitle2" fontWeight="bold" sx={{ lineHeight: 1.3 }}>
            {badge.title}
          </Typography>

          {/* Description */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ lineHeight: 1.4, display: 'block' }}
          >
            {badge.description}
          </Typography>

          {/* Footer row: type chip + date */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={0.5}>
            <Chip
              label={badge.type.replace(/([A-Z])/g, ' $1').trim()}
              size="small"
              className="badge-type-chip"
              sx={{
                bgcolor: `${color}22`,
                color,
                fontWeight: 600,
                border: `1px solid ${color}44`,
              }}
            />
            <Typography variant="caption" color="text.secondary" aria-label={`Earned ${formattedDate}`}>
              {formattedDate}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Box
      className="badge-empty-state"
      role="status"
      aria-label="No badges earned yet"
    >
      <Box className="badge-empty-icon" aria-hidden="true">🏅</Box>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        No badges yet
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320 }}>
        Earn badges by completing contribution cycles and reaching milestones in your savings groups.
      </Typography>
    </Box>
  );
}

// ── BadgeGallery ──────────────────────────────────────────────────────────────

/**
 * Displays a responsive grid of soulbound membership/completion badges.
 * Shows an empty state when the member has not yet earned any badges.
 */
export function BadgeGallery({ badges, onShare }: BadgeGalleryProps) {
  if (badges.length === 0) {
    return <EmptyState />;
  }

  return (
    <Box
      className="badge-gallery-grid"
      role="list"
      aria-label={`${badges.length} earned badge${badges.length !== 1 ? 's' : ''}`}
    >
      {badges.map((badge, index) => (
        <Box key={badge.id} role="listitem">
          <BadgeCard badge={badge} onShare={onShare} index={index} />
        </Box>
      ))}
    </Box>
  );
}

export default BadgeGallery;
