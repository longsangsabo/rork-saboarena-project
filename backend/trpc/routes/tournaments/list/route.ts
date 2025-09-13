import { z } from "zod";
import { publicProcedure } from "../../create-context";

export const getTournaments = publicProcedure
  .input(z.object({ 
    status: z.enum(['all', 'registration_open', 'in_progress', 'completed']).optional().default('all'),
    limit: z.number().optional().default(10),
    club_id: z.string().optional()
  }))
  .query(async ({ input, ctx }) => {
    try {
      // Build query based on filters
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
          club_id,
          created_at,
          start_time,
          end_time,
          clubs!inner(name, location, image_url),
          tournament_participants(count)
        `);

      // Apply status filter
      if (input.status !== 'all') {
        query = query.eq('status', input.status);
      }

      // Apply club filter
      if (input.club_id) {
        query = query.eq('club_id', input.club_id);
      }

      // Apply limit and ordering
      query = query
        .order('created_at', { ascending: false })
        .limit(input.limit);

      const { data: tournaments, error } = await query;

      if (error) {
        console.error('Error fetching tournaments:', error);
        throw new Error('Failed to fetch tournaments');
      }

      // Transform data to match frontend expectations
      const transformedTournaments = tournaments?.map(tournament => ({
        id: tournament.id,
        title: tournament.name,
        description: tournament.description,
        image_url: tournament.clubs?.image_url || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
        prize_pool: tournament.prize_pool,
        entry_fee: tournament.entry_fee,
        current_players: tournament.tournament_participants?.[0]?.count || 0,
        max_players: tournament.max_participants,
        location: tournament.clubs?.location || 'Unknown location',
        club_name: tournament.clubs?.name || 'Unknown club',
        start_time: tournament.start_time,
        end_time: tournament.end_time,  
        status: tournament.status,
        club_id: tournament.club_id,
        created_at: tournament.created_at
      })) || [];

      return {
        tournaments: transformedTournaments,
        total: transformedTournaments.length
      };

    } catch (error) {
      console.error('Tournament query error:', error);
      // Fallback to mock data in case of error
      const mockTournaments = [
        {
          id: '1',
          title: 'SABO POOL 8 BALL Championship',
          description: 'Giải đấu bi-a 8 bi hàng tuần với giải thưởng hấp dẫn',
          image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
          prize_pool: 10000000,
          entry_fee: 300000,
          current_players: 8,
          max_players: 16,
          location: '601A Nguyễn An Ninh - TP Vũng Tàu',
          club_name: 'SABO Club',
          start_time: '2024-09-07T19:00:00Z',
          end_time: '2024-09-07T23:00:00Z',
          status: 'registration_open' as const,
          club_id: '1',
          created_at: '2024-09-01T00:00:00Z'
        }
      ];

      return {
        tournaments: mockTournaments.slice(0, input.limit),
        total: mockTournaments.length
      };
    }
  });

export const joinTournament = publicProcedure
  .input(z.object({ 
    tournamentId: z.string() 
  }))
  .mutation(async ({ input, ctx }) => {
    try {
      // For now, we'll allow anonymous joins, but in production should require auth
      const userId = ctx.user?.id || 'anonymous-user';

      // First, check if tournament exists and is open for registration
      const { data: tournament, error: tournamentError } = await ctx.supabase
        .from('tournaments')
        .select('id, name, status, max_participants')
        .eq('id', input.tournamentId)
        .single();

      if (tournamentError || !tournament) {
        throw new Error('Tournament not found');
      }

      if (tournament.status !== 'registration_open') {
        throw new Error('Tournament registration is not open');
      }

      // Check if user is already registered
      const { data: existingRegistration } = await ctx.supabase
        .from('tournament_participants')
        .select('id')
        .eq('tournament_id', input.tournamentId)
        .eq('user_id', userId)
        .single();

      if (existingRegistration) {
        return {
          success: false,
          message: "You are already registered for this tournament"
        };
      }

      // Check if tournament is full
      const { count: currentParticipants } = await ctx.supabase
        .from('tournament_participants')
        .select('*', { count: 'exact', head: true })
        .eq('tournament_id', input.tournamentId);

      if (currentParticipants && currentParticipants >= tournament.max_participants) {
        return {
          success: false,
          message: "Tournament is full"
        };
      }

      // Register user for tournament
      const { error: insertError } = await ctx.supabase
        .from('tournament_participants')
        .insert({
          tournament_id: input.tournamentId,
          user_id: userId,
          registration_date: new Date().toISOString(),
          payment_status: 'pending' // In real app, would handle payment
        });

      if (insertError) {
        console.error('Error joining tournament:', insertError);
        throw new Error('Failed to join tournament');
      }

      return {
        success: true,
        message: `Successfully joined ${tournament.name}`
      };

    } catch (error) {
      console.error('Join tournament error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to join tournament'
      };
    }
  });