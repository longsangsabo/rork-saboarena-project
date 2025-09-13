import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

export const getTournaments = publicProcedure
  .input(z.object({ 
    status: z.enum(['all', 'upcoming', 'live', 'completed']).optional().default('all'),
    limit: z.number().optional().default(10)
  }))
  .query(async ({ input }) => {
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
        min_rank: 'K',
        max_rank: 'I+',
        location: '601A Nguyễn An Ninh - TP Vũng Tàu',
        start_time: '2024-09-07T19:00:00Z',
        end_time: '2024-09-07T23:00:00Z',
        status: 'upcoming' as const,
        lives: 2,
        club_id: '1'
      },
      {
        id: '2',
        title: 'SABO Weekly Tournament',
        description: 'Giải đấu hàng tuần cho các tay cơ chuyên nghiệp',
        image_url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=200&fit=crop',
        prize_pool: 5000000,
        entry_fee: 200000,
        current_players: 12,
        max_players: 16,
        min_rank: 'G',
        max_rank: 'A+',
        location: 'SABO Billiards Club',
        start_time: '2024-09-08T18:00:00Z',
        end_time: '2024-09-08T22:00:00Z',
        status: 'live' as const,
        lives: 3,
        club_id: '1'
      }
    ];

    const filtered = input.status === 'all' 
      ? mockTournaments 
      : mockTournaments.filter(t => t.status === input.status);

    return {
      tournaments: filtered.slice(0, input.limit),
      total: filtered.length
    };
  });

export const joinTournament = publicProcedure
  .input(z.object({ tournamentId: z.string() }))
  .mutation(async ({ input }) => {
    console.log('Joining tournament:', input.tournamentId);
    return {
      success: true,
      message: "Successfully joined tournament"
    };
  });