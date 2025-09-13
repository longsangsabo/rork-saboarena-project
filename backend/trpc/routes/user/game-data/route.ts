import { z } from "zod";
import { protectedProcedure } from "../../create-context";

// Get user game stats and profile data
export const getUserGameData = protectedProcedure
  .query(async ({ ctx }) => {
    // Mock game data - should come from database
    return {
      user_id: ctx.user.id,
      elo: 1485,
      spa_points: 320,
      rank: "Master",
      ranking_position: 89,
      total_matches: 37,
      wins: 25,
      losses: 12,
      win_rate: 67.6,
      current_streak: 5,
      best_streak: 12,
      tournaments_won: 3,
      tournaments_played: 8,
      challenges_won: 15,
      challenges_played: 22,
    };
  });

// Update user game stats (called after matches)
export const updateUserStats = protectedProcedure
  .input(z.object({
    matchResult: z.enum(['win', 'loss']),
    eloChange: z.number(),
    spaPointsEarned: z.number().optional()
  }))
  .mutation(async ({ ctx, input }) => {
    // Mock update - should update database
    console.log('Updating stats for user:', ctx.user.id, input);
    
    return {
      success: true,
      message: "Stats updated successfully",
      newElo: 1485 + input.eloChange,
      newSpaPoints: 320 + (input.spaPointsEarned || 0)
    };
  });