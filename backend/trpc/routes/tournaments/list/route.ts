import { z } from "zod";
import { publicProcedure, type Context } from "@/backend/trpc/create-context";

export const getTournaments = publicProcedure
  .input(z.object({ 
    status: z.enum(['all', 'registration_open', 'in_progress', 'completed']).optional().default('all'),
    limit: z.number().optional().default(10),
    club_id: z.string().optional()
  }))
  .query(async ({ input, ctx }: { input: { status: 'all' | 'registration_open' | 'in_progress' | 'completed'; limit: number; club_id?: string }; ctx: Context }) => {
    try {
      // Build query based on filters
      let query = ctx.supabase
        .from('tournaments')
        .select(`
          tournament_id,
          name,
          description,
          max_participants,
          entry_fee,
          total_prize,
          status,
          club_id,
          created_time,
          start_time,
          registration_deadline,
          clubs(name)
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
        .order('created_time', { ascending: false })
        .limit(input.limit);

      const { data: tournaments, error } = await query;

      console.log('🔍 Backend - Raw tournaments data:', {
        count: tournaments?.length || 0,
        error: error?.message || null,
        firstTournament: tournaments?.[0] || null
      });

      if (error) {
        console.error('Error fetching tournaments:', error);
        throw new Error('Failed to fetch tournaments');
      }

      // Get current participants count for each tournament
      const tournamentsWithParticipants = await Promise.all(
        (tournaments || []).map(async (tournament: any) => {
          const { count: participantCount } = await ctx.supabase
            .from('tournament_participants')
            .select('*', { count: 'exact', head: true })
            .eq('tournament_id', tournament.tournament_id);

          return {
            ...tournament,
            current_participants: participantCount || 0
          };
        })
      );

      // Transform data to match frontend expectations
      const transformedTournaments = tournamentsWithParticipants.map(tournament => ({
        id: tournament.tournament_id,
        title: tournament.name,
        description: tournament.description,
        image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
        prize_pool: tournament.total_prize || 0,
        entry_fee: tournament.entry_fee || 0,
        current_players: tournament.current_participants || 0,
        max_players: tournament.max_participants || 16,
        min_rank: 'K', // Default values since not in schema
        max_rank: 'S',
        location: tournament.clubs?.name ? `${tournament.clubs.name} - SABO Arena` : 'SABO Arena',
        club_name: tournament.clubs?.name || 'SABO Club',
        start_time: tournament.start_time || new Date().toISOString(),
        end_time: tournament.start_time || new Date().toISOString(), // Add end_time
        registration_deadline: tournament.registration_deadline,  
        status: tournament.status === 'registration_open' ? 'upcoming' : 
                tournament.status === 'in_progress' ? 'live' : 'completed',
        club_id: tournament.club_id,
        created_at: tournament.created_time
      }));

      console.log('🎯 Backend - Final response:', {
        count: transformedTournaments.length,
        sample: transformedTournaments[0] || null,
        allTournaments: transformedTournaments.map(t => ({ id: t.id, title: t.title, status: t.status, current_players: t.current_players }))
      });

      return {
        tournaments: transformedTournaments,
        total: transformedTournaments.length
      };

    } catch (error) {
      console.error('🚨 Backend - Tournament query error:', error);
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
  .mutation(async ({ input, ctx }: { input: { tournamentId: string }; ctx: Context }) => {
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