import { createTRPCRouter, protectedProcedure } from "../../create-context";
import { z } from "zod";

// Rank progression system
const RANK_PROGRESSION = {
  'K': { nextRank: 'K+', eloRequired: 1100, title: 'Beginner', description: 'Welcome to SABO!' },
  'K+': { nextRank: 'I', eloRequired: 1200, title: 'Novice', description: 'Making progress!' },
  'I': { nextRank: 'I+', eloRequired: 1300, title: 'Learner', description: 'Keep practicing!' },
  'I+': { nextRank: 'H', eloRequired: 1400, title: 'Dedicated', description: 'Showing dedication!' },
  'H': { nextRank: 'H+', eloRequired: 1500, title: 'Committed', description: 'Great improvement!' },
  'H+': { nextRank: 'G', eloRequired: 1600, title: 'Developing', description: 'Skills developing well!' },
  'G': { nextRank: 'G+', eloRequired: 1700, title: 'Intermediate', description: 'Good foundation!' },
  'G+': { nextRank: 'F', eloRequired: 1800, title: 'Advancing', description: 'Making good progress!' },
  'F': { nextRank: 'F+', eloRequired: 1900, title: 'Solid Player', description: 'Solid performance!' },
  'F+': { nextRank: 'E', eloRequired: 2000, title: 'Competent', description: 'Competent player!' },
  'E': { nextRank: 'E+', eloRequired: 2100, title: 'Skilled', description: 'Skilled competitor!' },
  'E+': { nextRank: 'D', eloRequired: 2200, title: 'Proficient', description: 'Proficient player!' },
  'D': { nextRank: 'D+', eloRequired: 2300, title: 'Experienced', description: 'Experienced competitor!' },
  'D+': { nextRank: 'C', eloRequired: 2400, title: 'Advanced', description: 'Advanced skills!' },
  'C': { nextRank: 'C+', eloRequired: 2500, title: 'Expert', description: 'Expert level play!' },
  'C+': { nextRank: 'B', eloRequired: 2600, title: 'Specialist', description: 'Specialized skills!' },
  'B': { nextRank: 'B+', eloRequired: 2700, title: 'Master', description: 'Mastery achieved!' },
  'B+': { nextRank: 'A', eloRequired: 2800, title: 'Elite', description: 'Elite performance!' },
  'A': { nextRank: 'A+', eloRequired: 2900, title: 'Champion', description: 'Championship level!' },
  'A+': { nextRank: 'Pro', eloRequired: 3000, title: 'Legend', description: 'Legendary player!' },
  'Pro': { nextRank: null, eloRequired: 3000, title: 'Professional', description: 'Professional level!' }
} as const;

export const progressionRouter = createTRPCRouter({
  // Get current rank progression info
  getRankProgress: protectedProcedure
    .query(async ({ ctx }) => {
      const { data: user } = await ctx.supabase
        .from('users')
        .select('elo, rank, total_matches, wins, losses, current_streak, best_streak')
        .eq('id', ctx.user.id)
        .single();

      if (!user) {
        throw new Error('User not found');
      }

      const currentRank = user.rank || 'K';
      const rankInfo = RANK_PROGRESSION[currentRank as keyof typeof RANK_PROGRESSION];
      
      let nextRankInfo = null;
      if (rankInfo.nextRank) {
        nextRankInfo = RANK_PROGRESSION[rankInfo.nextRank as keyof typeof RANK_PROGRESSION];
      }

      const progressToNext = nextRankInfo ? 
        Math.min(100, Math.max(0, ((user.elo || 1200) - rankInfo.eloRequired) / (nextRankInfo.eloRequired - rankInfo.eloRequired) * 100)) 
        : 100;

      return {
        currentRank: {
          rank: currentRank,
          title: rankInfo.title,
          description: rankInfo.description,
          eloRequired: rankInfo.eloRequired
        },
        nextRank: nextRankInfo ? {
          rank: rankInfo.nextRank,
          title: nextRankInfo.title,
          description: nextRankInfo.description,
          eloRequired: nextRankInfo.eloRequired
        } : null,
        currentElo: user.elo || 1200,
        progressPercentage: Math.round(progressToNext),
        eloNeeded: nextRankInfo ? Math.max(0, nextRankInfo.eloRequired - (user.elo || 1200)) : 0,
        stats: {
          totalMatches: user.total_matches || 0,
          wins: user.wins || 0,
          losses: user.losses || 0,
          winRate: user.total_matches ? Math.round((user.wins || 0) / user.total_matches * 100) : 0,
          currentStreak: user.current_streak || 0,
          bestStreak: user.best_streak || 0
        }
      };
    }),

  // Get rank achievements/milestones
  getRankAchievements: protectedProcedure
    .query(async ({ ctx }) => {
      // Get user's rank history (simplified - would need rank_history table)
      const { data: user } = await ctx.supabase
        .from('users')
        .select('rank, created_at')
        .eq('id', ctx.user.id)
        .single();

      if (!user) {
        throw new Error('User not found');
      }

      const currentRank = user.rank || 'K';
      const achievements = [];

      // Generate achievements based on current rank
      for (const [rank, info] of Object.entries(RANK_PROGRESSION)) {
        if (rank === 'Pro' && currentRank === 'Pro') {
          achievements.push({
            rank,
            title: info.title,
            description: info.description,
            achieved: true,
            achievedAt: user.created_at,
            isLatest: true
          });
        } else if (info.eloRequired <= (RANK_PROGRESSION[currentRank as keyof typeof RANK_PROGRESSION]?.eloRequired || 1200)) {
          achievements.push({
            rank,
            title: info.title,
            description: info.description,
            achieved: true,
            achievedAt: user.created_at,
            isLatest: rank === currentRank
          });
        } else {
          achievements.push({
            rank,
            title: info.title,
            description: info.description,
            achieved: false,
            achievedAt: null,
            isLatest: false
          });
        }
      }

      return achievements;
    }),

  // Check for rank promotions (called after matches)
  checkRankPromotion: protectedProcedure
    .input(z.object({
      oldRank: z.string(),
      newRank: z.string(),
      newElo: z.number()
    }))
    .mutation(async ({ input, ctx }) => {
      if (input.oldRank === input.newRank) {
        return { promoted: false };
      }

      const oldRankInfo = RANK_PROGRESSION[input.oldRank as keyof typeof RANK_PROGRESSION];
      const newRankInfo = RANK_PROGRESSION[input.newRank as keyof typeof RANK_PROGRESSION];

      if (!oldRankInfo || !newRankInfo) {
        return { promoted: false };
      }

      // Record the promotion
      await ctx.supabase
        .from('rank_promotions')
        .insert({
          player_id: ctx.user.id,
          old_rank: input.oldRank,
          new_rank: input.newRank,
          elo_at_promotion: input.newElo,
          promoted_at: new Date().toISOString()
        });

      // Create notification
      await ctx.supabase
        .from('notifications')
        .insert({
          user_id: ctx.user.id,
          title: 'Rank Promotion!',
          message: `Congratulations! You've been promoted from ${oldRankInfo.title} (${input.oldRank}) to ${newRankInfo.title} (${input.newRank})!`,
          type: 'rank_promotion',
          data: {
            oldRank: input.oldRank,
            newRank: input.newRank,
            oldTitle: oldRankInfo.title,
            newTitle: newRankInfo.title,
            newElo: input.newElo
          }
        });

      return {
        promoted: true,
        promotion: {
          oldRank: input.oldRank,
          newRank: input.newRank,
          oldTitle: oldRankInfo.title,
          newTitle: newRankInfo.title,
          newElo: input.newElo
        }
      };
    }),

  // Get promotion history
  getPromotionHistory: protectedProcedure
    .query(async ({ ctx }) => {
      const { data: promotions } = await ctx.supabase
        .from('rank_promotions')
        .select('*')
        .eq('player_id', ctx.user.id)
        .order('promoted_at', { ascending: false });

      return (promotions || []).map(promotion => ({
        id: promotion.id,
        oldRank: promotion.old_rank,
        newRank: promotion.new_rank,
        oldTitle: RANK_PROGRESSION[promotion.old_rank as keyof typeof RANK_PROGRESSION]?.title || promotion.old_rank,
        newTitle: RANK_PROGRESSION[promotion.new_rank as keyof typeof RANK_PROGRESSION]?.title || promotion.new_rank,
        eloAtPromotion: promotion.elo_at_promotion,
        promotedAt: promotion.promoted_at
      }));
    }),

  // Get notifications
  getNotifications: protectedProcedure
    .input(z.object({
      limit: z.number().optional().default(20),
      unreadOnly: z.boolean().optional().default(false)
    }))
    .query(async ({ input, ctx }) => {
      let query = ctx.supabase
        .from('notifications')
        .select('*')
        .eq('user_id', ctx.user.id)
        .order('created_at', { ascending: false })
        .limit(input.limit);

      if (input.unreadOnly) {
        query = query.eq('read', false);
      }

      const { data: notifications } = await query;

      return notifications || [];
    }),

  // Mark notification as read
  markNotificationRead: protectedProcedure
    .input(z.object({
      notificationId: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      const { error } = await ctx.supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('id', input.notificationId)
        .eq('user_id', ctx.user.id);

      if (error) {
        throw new Error('Failed to mark notification as read');
      }

      return { success: true };
    }),

  // Get rank leaderboard preview
  getRankLeaderboard: protectedProcedure
    .input(z.object({
      rankFilter: z.string().optional(),
      limit: z.number().optional().default(10)
    }))
    .query(async ({ input, ctx }) => {
      let query = ctx.supabase
        .from('users')
        .select('id, username, display_name, elo, rank, total_matches, wins, losses, avatar_url')
        .order('elo', { ascending: false })
        .limit(input.limit);

      if (input.rankFilter) {
        query = query.eq('rank', input.rankFilter);
      }

      const { data: players } = await query;

      return (players || []).map((player, index) => ({
        position: index + 1,
        id: player.id,
        username: player.username,
        displayName: player.display_name,
        elo: player.elo || 1200,
        rank: player.rank || 'K',
        rankTitle: RANK_PROGRESSION[player.rank as keyof typeof RANK_PROGRESSION]?.title || 'Beginner',
        totalMatches: player.total_matches || 0,
        wins: player.wins || 0,
        losses: player.losses || 0,
        winRate: player.total_matches ? Math.round((player.wins || 0) / player.total_matches * 100) : 0,
        avatarUrl: player.avatar_url,
        isCurrentUser: player.id === ctx.user.id
      }));
    })
});