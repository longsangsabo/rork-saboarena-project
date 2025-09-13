import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

export const getClubs = publicProcedure
  .input(z.object({ 
    location: z.string().optional(),
    limit: z.number().optional().default(10)
  }))
  .query(async ({ input }) => {
    const mockClubs = [
      {
        id: '1',
        name: 'SABO Billiards',
        username: '@sabobilliards',
        description: 'Premier billiards club in Vung Tau',
        avatar: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop',
        cover_image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
        location: '601A Nguyễn An Ninh - TP Vũng Tàu',
        member_count: 25,
        tournament_count: 15,
        prize_pool: 89900000,
        challenge_count: 37,
        rating: 4.8,
        is_verified: true,
        created_at: '2023-01-15T00:00:00Z'
      }
    ];

    return {
      clubs: mockClubs.slice(0, input.limit),
      total: mockClubs.length
    };
  });

export const getClubMembers = publicProcedure
  .input(z.object({ clubId: z.string() }))
  .query(async ({ input }) => {
    const mockMembers = [
      {
        id: '1',
        name: 'Anh Long Magic',
        rank: 'G',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        isOnline: true,
        joinDate: '04/09/2025',
        elo: 1485,
        matches: 37
      },
      {
        id: '2',
        name: 'SABO',
        rank: 'H',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        isOnline: false,
        joinDate: '04/09/2025',
        elo: 1200,
        matches: 25
      }
    ];

    return {
      members: mockMembers,
      total: mockMembers.length
    };
  });

export const joinClub = publicProcedure
  .input(z.object({ clubId: z.string() }))
  .mutation(async ({ input }) => {
    console.log('Joining club:', input.clubId);
    return {
      success: true,
      message: "Successfully joined club"
    };
  });