import { createTRPCRouter, protectedProcedure } from "../../create-context";
import { z } from "zod";
import { progressionRouter } from "./progression/route";
import { leaderboardRouter } from "./leaderboard/route";

const DEFAULT_ELO = 1200;
const ELO_K_FACTOR = 32;

function getRankByElo(elo: number): string {
  if (elo >= 3000) return 'Pro';
  if (elo >= 2900) return 'A+';
  if (elo >= 2800) return 'A';
  if (elo >= 2700) return 'B+';
  if (elo >= 2600) return 'B';
  if (elo >= 2500) return 'C+';
  if (elo >= 2400) return 'C';
  if (elo >= 2300) return 'D+';
  if (elo >= 2200) return 'D';
  if (elo >= 2100) return 'E+';
  if (elo >= 2000) return 'E';
  if (elo >= 1900) return 'F+';
  if (elo >= 1800) return 'F';
  if (elo >= 1700) return 'G+';
  if (elo >= 1600) return 'G';
  if (elo >= 1500) return 'H+';
  if (elo >= 1400) return 'H';
  if (elo >= 1300) return 'I+';
  if (elo >= 1200) return 'I';
  if (elo >= 1100) return 'K+';
  return 'K';
}

export const rankingRouter = createTRPCRouter({
  // Progression system
  progression: progressionRouter,
  
  // Leaderboard system
  leaderboard: leaderboardRouter,
  
  // ELO-related procedures
  calculateElo: protectedProcedure
    .input(z.object({
      opponentId: z.string(),
      result: z.enum(['win', 'loss', 'draw'])
    }))
    .query(async ({ input, ctx }) => {
      const { data: currentPlayer } = await ctx.supabase
        .from('users')
        .select('elo')
        .eq('id', ctx.user.id)
        .single();
        
      const { data: opponent } = await ctx.supabase
        .from('users')
        .select('elo')
        .eq('id', input.opponentId)
        .single();
        
      const playerElo = currentPlayer?.elo || DEFAULT_ELO;
      const opponentElo = opponent?.elo || DEFAULT_ELO;
      
      const expectedScore = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
      let actualScore: number;
      
      switch (input.result) {
        case 'win': actualScore = 1; break;
        case 'loss': actualScore = 0; break;
        case 'draw': actualScore = 0.5; break;
      }
      
      const eloChange = Math.round(ELO_K_FACTOR * (actualScore - expectedScore));
      const newElo = playerElo + eloChange;
      
      return {
        currentElo: playerElo,
        expectedScore,
        actualScore,
        eloChange,
        newElo,
        newRank: getRankByElo(newElo)
      };
    }),

  // SPA Points procedures
  awardSpaPoints: protectedProcedure
    .input(z.object({
      points: z.number().positive(),
      sourceType: z.string(),
      sourceId: z.string().optional(),
      description: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      // Get/create wallet
      let { data: wallet } = await ctx.supabase
        .from('wallets')
        .select('*')
        .eq('user_id', ctx.user.id)
        .single();

      if (!wallet) {
        const { data: newWallet } = await ctx.supabase
          .from('wallets')
          .insert({
            user_id: ctx.user.id,
            points_balance: input.points,
            total_earned: input.points,
            total_spent: 0,
            wallet_balance: 0
          })
          .select()
          .single();
        wallet = newWallet;
      } else {
        await ctx.supabase
          .from('wallets')
          .update({
            points_balance: wallet.points_balance + input.points,
            total_earned: wallet.total_earned + input.points,
            updated_at: new Date().toISOString()
          })
          .eq('id', wallet.id);
      }

      // Log points
      await ctx.supabase
        .from('spa_points_log')
        .insert({
          player_id: ctx.user.id,
          source_type: input.sourceType,
          source_id: input.sourceId,
          points_earned: input.points,
          description: input.description
        });

      return { success: true, newBalance: (wallet?.points_balance || 0) + input.points };
    }),

  // Main match processing procedure  
  processMatchResult: protectedProcedure
    .input(z.object({
      opponentId: z.string(),
      result: z.enum(['win', 'loss', 'draw']),
      matchType: z.enum(['challenge', 'tournament', 'friendly', 'ranking_match']).optional().default('challenge'),
      scorePlayer: z.number().optional(),
      scoreOpponent: z.number().optional(),
      matchDuration: z.number().optional(),
      challengeId: z.string().optional(),
      tournamentId: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Get current player and opponent data
        const { data: currentPlayer } = await ctx.supabase
          .from('users')
          .select('id, elo, rank, total_matches, wins, losses, current_streak, best_streak')
          .eq('id', ctx.user.id)
          .single();

        const { data: opponent } = await ctx.supabase
          .from('users')
          .select('id, elo, rank, total_matches, wins, losses')
          .eq('id', input.opponentId)
          .single();

        if (!currentPlayer || !opponent) {
          throw new Error('Player or opponent not found');
        }

        // Calculate ELO changes
        const playerElo = currentPlayer.elo || DEFAULT_ELO;
        const opponentElo = opponent.elo || DEFAULT_ELO;
        
        const expectedScore = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
        let actualScore: number;
        
        switch (input.result) {
          case 'win': actualScore = 1; break;
          case 'loss': actualScore = 0; break;
          case 'draw': actualScore = 0.5; break;
        }
        
        const playerEloChange = Math.round(ELO_K_FACTOR * (actualScore - expectedScore));
        const opponentEloChange = -playerEloChange;

        const newPlayerElo = playerElo + playerEloChange;
        const newOpponentElo = opponentElo + opponentEloChange;

        // Calculate new ranks
        const newPlayerRank = getRankByElo(newPlayerElo);
        const newOpponentRank = getRankByElo(newOpponentElo);

        // Calculate streak updates
        let newPlayerStreak = currentPlayer.current_streak || 0;
        let newBestStreak = currentPlayer.best_streak || 0;
        
        if (input.result === 'win') {
          newPlayerStreak = newPlayerStreak >= 0 ? newPlayerStreak + 1 : 1;
        } else if (input.result === 'loss') {
          newPlayerStreak = newPlayerStreak <= 0 ? newPlayerStreak - 1 : -1;
        }
        
        if (Math.abs(newPlayerStreak) > Math.abs(newBestStreak)) {
          newBestStreak = newPlayerStreak;
        }

        // Calculate match statistics
        const playerWins = input.result === 'win' ? (currentPlayer.wins || 0) + 1 : (currentPlayer.wins || 0);
        const playerLosses = input.result === 'loss' ? (currentPlayer.losses || 0) + 1 : (currentPlayer.losses || 0);
        const playerMatches = (currentPlayer.total_matches || 0) + 1;

        const opponentWins = input.result === 'loss' ? (opponent.wins || 0) + 1 : (opponent.wins || 0);
        const opponentLosses = input.result === 'win' ? (opponent.losses || 0) + 1 : (opponent.losses || 0);
        const opponentMatches = (opponent.total_matches || 0) + 1;

        // Calculate SPA points earned
        let spaPointsEarned = 0;
        switch (input.result) {
          case 'win':
            spaPointsEarned = input.matchType === 'tournament' ? 100 : 
                             input.matchType === 'challenge' ? 50 : 25;
            break;
          case 'loss':
            spaPointsEarned = 10; // Participation points
            break;
          case 'draw':
            spaPointsEarned = 15;
            break;
        }

        // Bonus points for rank up
        const rankUp = newPlayerRank !== currentPlayer.rank;
        if (rankUp) {
          spaPointsEarned += 200;
        }

        // Update player stats
        await ctx.supabase
          .from('users')
          .update({
            elo: newPlayerElo,
            rank: newPlayerRank,
            total_matches: playerMatches,
            wins: playerWins,
            losses: playerLosses,
            current_streak: newPlayerStreak,
            best_streak: newBestStreak,
            updated_at: new Date().toISOString()
          })
          .eq('id', ctx.user.id);

        // Update opponent stats
        await ctx.supabase
          .from('users')
          .update({
            elo: newOpponentElo,
            rank: newOpponentRank,
            total_matches: opponentMatches,
            wins: opponentWins,
            losses: opponentLosses,
            updated_at: new Date().toISOString()
          })
          .eq('id', input.opponentId);

        // Record ELO history
        await ctx.supabase
          .from('elo_history')
          .insert([
            {
              player_id: ctx.user.id,
              old_elo: playerElo,
              new_elo: newPlayerElo,
              elo_change: playerEloChange,
              opponent_id: input.opponentId,
              match_result: input.result,
              match_type: input.matchType
            },
            {
              player_id: input.opponentId,
              old_elo: opponentElo,
              new_elo: newOpponentElo,
              elo_change: opponentEloChange,
              opponent_id: ctx.user.id,
              match_result: input.result === 'win' ? 'loss' : input.result === 'loss' ? 'win' : 'draw',
              match_type: input.matchType
            }
          ]);

        // Award SPA points if earned
        if (spaPointsEarned > 0) {
          let { data: wallet } = await ctx.supabase
            .from('wallets')
            .select('*')
            .eq('user_id', ctx.user.id)
            .single();

          if (!wallet) {
            await ctx.supabase
              .from('wallets')
              .insert({
                user_id: ctx.user.id,
                points_balance: spaPointsEarned,
                total_earned: spaPointsEarned,
                total_spent: 0,
                wallet_balance: 0
              });
          } else {
            await ctx.supabase
              .from('wallets')
              .update({
                points_balance: wallet.points_balance + spaPointsEarned,
                total_earned: wallet.total_earned + spaPointsEarned,
                updated_at: new Date().toISOString()
              })
              .eq('id', wallet.id);
          }

          // Log SPA points
          await ctx.supabase
            .from('spa_points_log')
            .insert({
              player_id: ctx.user.id,
              source_type: input.matchType,
              source_id: input.challengeId || input.tournamentId,
              points_earned: spaPointsEarned,
              description: `Match ${input.result} vs opponent (${input.matchType})`
            });
        }

        // Record match details
        await ctx.supabase
          .from('match_history')
          .insert({
            player1_id: ctx.user.id,
            player2_id: input.opponentId,
            winner_id: input.result === 'win' ? ctx.user.id : input.result === 'loss' ? input.opponentId : null,
            player1_score: input.scorePlayer,
            player2_score: input.scoreOpponent,
            match_type: input.matchType,
            match_duration: input.matchDuration,
            challenge_id: input.challengeId,
            tournament_id: input.tournamentId,
            elo_change_player1: playerEloChange,
            elo_change_player2: opponentEloChange
          });

        return {
          success: true,
          player: {
            oldElo: playerElo,
            newElo: newPlayerElo,
            eloChange: playerEloChange,
            oldRank: currentPlayer.rank,
            newRank: newPlayerRank,
            rankUp: rankUp,
            wins: playerWins,
            losses: playerLosses,
            totalMatches: playerMatches,
            currentStreak: newPlayerStreak,
            spaPointsEarned: spaPointsEarned
          },
          opponent: {
            oldElo: opponentElo,
            newElo: newOpponentElo,
            eloChange: opponentEloChange,
            oldRank: opponent.rank,
            newRank: newOpponentRank
          }
        };

      } catch (error) {
        console.error('Process match result error:', error);
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to process match result'
        };
      }
    })
});