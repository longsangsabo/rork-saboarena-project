import { createTRPCRouter, protectedProcedure, publicProcedure } from "../../create-context";
import { z } from "zod";

// Rank progression mapping for titles
const RANK_TITLES = {
  'K': 'Beginner', 'K+': 'Novice', 'I': 'Learner', 'I+': 'Dedicated',
  'H': 'Committed', 'H+': 'Developing', 'G': 'Intermediate', 'G+': 'Advancing',
  'F': 'Solid Player', 'F+': 'Competent', 'E': 'Skilled', 'E+': 'Proficient',
  'D': 'Experienced', 'D+': 'Advanced', 'C': 'Expert', 'C+': 'Specialist',
  'B': 'Master', 'B+': 'Elite', 'A': 'Champion', 'A+': 'Legend', 'Pro': 'Professional'
} as const;

export const leaderboardRouter = createTRPCRouter({
  // Global ELO Leaderboard
  getGlobalLeaderboard: publicProcedure
    .input(z.object({
      limit: z.number().optional().default(50),
      offset: z.number().optional().default(0),
      timeframe: z.enum(['all', 'month', 'week']).optional().default('all')
    }))
    .query(async ({ input, ctx }) => {
      // Base query for active players
      let query = ctx.supabase
        .from('users')
        .select('id, username, display_name, elo, rank, total_matches, wins, losses, current_streak, avatar_url, created_at, updated_at')
        .gte('total_matches', 5) // Minimum matches to appear on leaderboard
        .order('elo', { ascending: false })
        .range(input.offset, input.offset + input.limit - 1);

      // Apply timeframe filter if not 'all'
      if (input.timeframe !== 'all') {
        const days = input.timeframe === 'week' ? 7 : 30;
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        query = query.gte('updated_at', cutoff.toISOString());
      }

      const { data: players, error } = await query;

      if (error) {
        throw new Error('Failed to fetch leaderboard');
      }

      return (players || []).map((player, index) => ({
        position: input.offset + index + 1,
        id: player.id,
        username: player.username,
        displayName: player.display_name,
        elo: player.elo || 1200,
        rank: player.rank || 'K',
        rankTitle: RANK_TITLES[player.rank as keyof typeof RANK_TITLES] || 'Beginner',
        totalMatches: player.total_matches || 0,
        wins: player.wins || 0,
        losses: player.losses || 0,
        winRate: player.total_matches ? Math.round((player.wins || 0) / player.total_matches * 100) : 0,
        currentStreak: player.current_streak || 0,
        avatarUrl: player.avatar_url,
        joinedAt: player.created_at,
        lastActive: player.updated_at
      }));
    }),

  // Rank-specific leaderboard
  getRankLeaderboard: publicProcedure
    .input(z.object({
      rank: z.string(),
      limit: z.number().optional().default(20)
    }))
    .query(async ({ input, ctx }) => {
      const { data: players } = await ctx.supabase
        .from('users')
        .select('id, username, display_name, elo, rank, total_matches, wins, losses, current_streak, avatar_url')
        .eq('rank', input.rank)
        .gte('total_matches', 3)
        .order('elo', { ascending: false })
        .limit(input.limit);

      return (players || []).map((player, index) => ({
        position: index + 1,
        id: player.id,
        username: player.username,
        displayName: player.display_name,
        elo: player.elo || 1200,
        rank: player.rank || 'K',
        rankTitle: RANK_TITLES[player.rank as keyof typeof RANK_TITLES] || 'Beginner',
        totalMatches: player.total_matches || 0,
        wins: player.wins || 0,
        losses: player.losses || 0,
        winRate: player.total_matches ? Math.round((player.wins || 0) / player.total_matches * 100) : 0,
        currentStreak: player.current_streak || 0,
        avatarUrl: player.avatar_url
      }));
    }),

  // Get user's leaderboard position
  getUserPosition: protectedProcedure
    .input(z.object({
      scope: z.enum(['global', 'rank']).optional().default('global')
    }))
    .query(async ({ input, ctx }) => {
      const { data: user } = await ctx.supabase
        .from('users')
        .select('elo, rank, total_matches')
        .eq('id', ctx.user.id)
        .single();

      if (!user || (user.total_matches || 0) < 5) {
        return {
          position: null,
          eligible: false,
          reason: 'Need at least 5 matches to appear on leaderboard'
        };
      }

      let higherRankedCount = 0;

      if (input.scope === 'global') {
        const { count } = await ctx.supabase
          .from('users')
          .select('id', { count: 'exact' })
          .gt('elo', user.elo || 1200)
          .gte('total_matches', 5);
        
        higherRankedCount = count || 0;
      } else {
        const { count } = await ctx.supabase
          .from('users')
          .select('id', { count: 'exact' })
          .eq('rank', user.rank || 'K')
          .gt('elo', user.elo || 1200)
          .gte('total_matches', 3);
        
        higherRankedCount = count || 0;
      }

      return {
        position: higherRankedCount + 1,
        eligible: true,
        scope: input.scope,
        elo: user.elo || 1200,
        rank: user.rank || 'K'
      };
    }),

  // Top performers by category
  getTopPerformers: publicProcedure
    .input(z.object({
      category: z.enum(['winrate', 'streak', 'matches', 'recent']).optional().default('winrate'),
      limit: z.number().optional().default(10)
    }))
    .query(async ({ input, ctx }) => {
      let query = ctx.supabase
        .from('users')
        .select('id, username, display_name, elo, rank, total_matches, wins, losses, current_streak, best_streak, avatar_url, updated_at')
        .gte('total_matches', 10); // Higher minimum for top performers

      switch (input.category) {
        case 'winrate':
          // PostgreSQL function for win rate calculation would be ideal
          query = query.order('wins', { ascending: false });
          break;
        case 'streak':
          query = query.order('best_streak', { ascending: false });
          break;
        case 'matches':
          query = query.order('total_matches', { ascending: false });
          break;
        case 'recent':
          // Most active recently
          const recentDate = new Date();
          recentDate.setDate(recentDate.getDate() - 7);
          query = query
            .gte('updated_at', recentDate.toISOString())
            .order('updated_at', { ascending: false });
          break;
      }

      query = query.limit(input.limit);

      const { data: players } = await query;

      return (players || [])
        .map(player => ({
          id: player.id,
          username: player.username,
          displayName: player.display_name,
          elo: player.elo || 1200,
          rank: player.rank || 'K',
          rankTitle: RANK_TITLES[player.rank as keyof typeof RANK_TITLES] || 'Beginner',
          totalMatches: player.total_matches || 0,
          wins: player.wins || 0,
          losses: player.losses || 0,
          winRate: player.total_matches ? Math.round((player.wins || 0) / player.total_matches * 100) : 0,
          currentStreak: player.current_streak || 0,
          bestStreak: player.best_streak || 0,
          avatarUrl: player.avatar_url,
          lastActive: player.updated_at
        }))
        .filter(player => {
          // Additional filtering for win rate category
          if (input.category === 'winrate') {
            return player.winRate >= 60; // At least 60% win rate
          }
          return true;
        })
        .sort((a, b) => {
          // Client-side sorting for win rate (since we can't easily do it in SQL)
          if (input.category === 'winrate') {
            return b.winRate - a.winRate;
          }
          return 0;
        })
        .slice(0, input.limit)
        .map((player, index) => ({
          ...player,
          position: index + 1
        }));
    }),

  // Leaderboard statistics
  getLeaderboardStats: publicProcedure
    .query(async ({ ctx }) => {
      // Total players
      const { count: totalPlayers } = await ctx.supabase
        .from('users')
        .select('id', { count: 'exact' })
        .gte('total_matches', 1);

      // Active players (played in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: activePlayers } = await ctx.supabase
        .from('users')
        .select('id', { count: 'exact' })
        .gte('updated_at', thirtyDaysAgo.toISOString());

      // Top player
      const { data: topPlayer } = await ctx.supabase
        .from('users')
        .select('username, display_name, elo, rank')
        .gte('total_matches', 5)
        .order('elo', { ascending: false })
        .limit(1)
        .single();

      // Rank distribution
      const { data: rankDistribution } = await ctx.supabase
        .from('users')
        .select('rank')
        .gte('total_matches', 5);

      const rankCounts: Record<string, number> = {};
      (rankDistribution || []).forEach(player => {
        const rank = player.rank || 'K';
        rankCounts[rank] = (rankCounts[rank] || 0) + 1;
      });

      return {
        totalPlayers: totalPlayers || 0,
        activePlayers: activePlayers || 0,
        topPlayer: topPlayer ? {
          username: topPlayer.username,
          displayName: topPlayer.display_name,
          elo: topPlayer.elo || 1200,
          rank: topPlayer.rank || 'K',
          rankTitle: RANK_TITLES[topPlayer.rank as keyof typeof RANK_TITLES] || 'Beginner'
        } : null,
        rankDistribution: Object.entries(rankCounts).map(([rank, count]) => ({
          rank,
          title: RANK_TITLES[rank as keyof typeof RANK_TITLES] || rank,
          count
        })).sort((a, b) => b.count - a.count)
      };
    }),

  // Search players in leaderboard
  searchPlayers: publicProcedure
    .input(z.object({
      query: z.string().min(2),
      limit: z.number().optional().default(10)
    }))
    .query(async ({ input, ctx }) => {
      const { data: players } = await ctx.supabase
        .from('users')
        .select('id, username, display_name, elo, rank, total_matches, wins, losses, avatar_url')
        .or(`username.ilike.%${input.query}%,display_name.ilike.%${input.query}%`)
        .gte('total_matches', 1)
        .order('elo', { ascending: false })
        .limit(input.limit);

      return (players || []).map(player => ({
        id: player.id,
        username: player.username,
        displayName: player.display_name,
        elo: player.elo || 1200,
        rank: player.rank || 'K',
        rankTitle: RANK_TITLES[player.rank as keyof typeof RANK_TITLES] || 'Beginner',
        totalMatches: player.total_matches || 0,
        wins: player.wins || 0,
        losses: player.losses || 0,
        winRate: player.total_matches ? Math.round((player.wins || 0) / player.total_matches * 100) : 0,
        avatarUrl: player.avatar_url
      }));
    })
});