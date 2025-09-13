import { z } from "zod";
import { publicProcedure, protectedProcedure } from "../../create-context";

// Get tournament details with participants
export const getTournamentDetails = publicProcedure
  .input(z.object({ 
    tournamentId: z.string() 
  }))
  .query(async ({ input, ctx }) => {
    try {
      const { data: tournament, error } = await ctx.supabase
        .from('tournaments')
        .select(`
          *,
          clubs(name, location, image_url),
          tournament_participants(
            user_id,
            registration_date,
            seed_position,
            payment_status,
            users(username, avatar_url, elo, rank)
          ),
          tournament_matches(
            round_number,
            match_number,
            player1_id,
            player2_id,
            winner_id,
            player1_score,
            player2_score,
            status,
            scheduled_time
          )
        `)
        .eq('id', input.tournamentId)
        .single();

      if (error) {
        throw new Error('Tournament not found');
      }

      return tournament;
    } catch (error) {
      console.error('Get tournament details error:', error);
      throw new Error('Failed to get tournament details');
    }
  });

// Update tournament status (admin only)
export const updateTournamentStatus = protectedProcedure
  .input(z.object({
    tournamentId: z.string(),
    status: z.enum(['registration_open', 'in_progress', 'completed', 'cancelled']),
    reason: z.string().optional()
  }))
  .mutation(async ({ input, ctx }) => {
    try {
      // In production, check if user has admin permissions
      // For now, any authenticated user can update
      
      const { error } = await ctx.supabase
        .from('tournaments')
        .update({
          status: input.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', input.tournamentId);

      if (error) {
        throw new Error('Failed to update tournament status');
      }

      // If tournament is starting, generate brackets
      if (input.status === 'in_progress') {
        await generateTournamentBrackets(ctx.supabase, input.tournamentId);
      }

      return {
        success: true,
        message: `Tournament status updated to ${input.status}`
      };
    } catch (error) {
      console.error('Update tournament status error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update tournament status'
      };
    }
  });

// Helper function to generate tournament brackets
async function generateTournamentBrackets(supabase: any, tournamentId: string) {
  try {
    // Get all participants
    const { data: participants } = await supabase
      .from('tournament_participants')
      .select('user_id, seed_position')
      .eq('tournament_id', tournamentId)
      .order('seed_position', { ascending: true });

    if (!participants || participants.length < 2) {
      throw new Error('Not enough participants to generate brackets');
    }

    // Generate first round matches
    const matches = [];
    for (let i = 0; i < participants.length; i += 2) {
      if (participants[i + 1]) {
        matches.push({
          tournament_id: tournamentId,
          round_number: 1,
          match_number: Math.floor(i / 2) + 1,
          player1_id: participants[i].user_id,
          player2_id: participants[i + 1].user_id,
          status: 'scheduled'
        });
      }
    }

    // Insert matches
    const { error } = await supabase
      .from('tournament_matches')
      .insert(matches);

    if (error) {
      console.error('Error generating brackets:', error);
    }
  } catch (error) {
    console.error('Generate brackets error:', error);
  }
}