import { z } from "zod";
import { publicProcedure, protectedProcedure } from "../../create-context";

// Create club tournament
export const createClubTournament = protectedProcedure
  .input(z.object({
    clubId: z.string(),
    name: z.string().min(5, "Tournament name must be at least 5 characters"),
    description: z.string(),
    maxParticipants: z.number().min(4).max(32),
    entryFee: z.number().min(0),
    prizePool: z.number().min(0),
    startTime: z.string(),
    endTime: z.string()
  }))
  .mutation(async ({ input, ctx }) => {
    try {
      // Check if user has permission to create tournaments for this club
      const { data: membership } = await ctx.supabase
        .from('club_memberships')
        .select('role')
        .eq('club_id', input.clubId)
        .eq('user_id', ctx.user.id)
        .eq('status', 'active')
        .single();

      if (!membership || !['admin', 'moderator'].includes(membership.role)) {
        throw new Error('You do not have permission to create tournaments for this club');
      }

      // Create tournament
      const { data: tournament, error } = await ctx.supabase
        .from('tournaments')
        .insert({
          name: input.name,
          description: input.description,
          max_participants: input.maxParticipants,
          entry_fee: input.entryFee,
          prize_pool: input.prizePool,
          start_time: input.startTime,
          end_time: input.endTime,
          club_id: input.clubId,
          status: 'registration_open',
          created_by: ctx.user.id
        })
        .select()
        .single();

      if (error) {
        throw new Error('Failed to create tournament');
      }

      return {
        success: true,
        tournament,
        message: 'Tournament created successfully'
      };
    } catch (error) {
      console.error('Create club tournament error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create tournament'
      };
    }
  });

// Get club tournaments
export const getClubTournaments = publicProcedure
  .input(z.object({
    clubId: z.string(),
    status: z.enum(['all', 'registration_open', 'in_progress', 'completed']).optional().default('all'),
    limit: z.number().optional().default(10)
  }))
  .query(async ({ input, ctx }) => {
    try {
      let query = ctx.supabase
        .from('tournaments')
        .select(`
          id,
          name,
          description,
          max_participants,
          entry_fee,
          prize_pool,
          status,
          start_time,
          end_time,
          created_at,
          tournament_participants(count)
        `)
        .eq('club_id', input.clubId);

      if (input.status !== 'all') {
        query = query.eq('status', input.status);
      }

      query = query
        .order('created_at', { ascending: false })
        .limit(input.limit);

      const { data: tournaments, error } = await query;

      if (error) {
        throw new Error('Failed to get club tournaments');
      }

      const transformedTournaments = tournaments?.map(tournament => ({
        id: tournament.id,
        title: tournament.name,
        description: tournament.description,
        prize_pool: tournament.prize_pool,
        entry_fee: tournament.entry_fee,
        current_players: tournament.tournament_participants?.[0]?.count || 0,
        max_players: tournament.max_participants,
        start_time: tournament.start_time,
        end_time: tournament.end_time,
        status: tournament.status,
        created_at: tournament.created_at
      })) || [];

      return {
        tournaments: transformedTournaments,
        total: transformedTournaments.length
      };
    } catch (error) {
      console.error('Get club tournaments error:', error);
      throw new Error('Failed to get club tournaments');
    }
  });