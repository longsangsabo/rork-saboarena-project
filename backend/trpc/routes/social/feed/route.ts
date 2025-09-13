import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

export const getFeed = publicProcedure
  .input(z.object({ 
    type: z.enum(['nearby', 'following']).optional().default('nearby'),
    limit: z.number().optional().default(10)
  }))
  .query(async ({ input }) => {
    const mockFeedItems = [
      {
        id: '1',
        type: 'challenge' as const,
        user: {
          id: '1',
          username: '@longsang',
          displayName: 'Anh Long Magic',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
          rank: 'G',
          elo: 1485,
          isOnline: true
        },
        club: {
          id: '1',
          name: 'SABO Billiards',
          location: 'Vũng Tàu',
          avatar: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=50&h=50&fit=crop'
        },
        content: {
          message: 'Tìm đối tối nay   #sabo #rankG',
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
        },
        interactions: {
          likes: 328700,
          comments: 578,
          shares: 99,
          is_liked: false,
          is_bookmarked: false
        },
        created_at: '2024-09-03T15:30:00Z'
      }
    ];

    return {
      feed: mockFeedItems.slice(0, input.limit),
      total: mockFeedItems.length,
      hasMore: mockFeedItems.length > input.limit
    };
  });

export const interactWithPost = publicProcedure
  .input(z.object({
    postId: z.string(),
    action: z.enum(['like', 'unlike', 'bookmark', 'unbookmark', 'share'])
  }))
  .mutation(async ({ input }) => {
    console.log('Interacting with post:', input);
    
    const responses = {
      like: { isLiked: true, likeCount: 328701 },
      unlike: { isLiked: false, likeCount: 328699 },
      bookmark: { isBookmarked: true },
      unbookmark: { isBookmarked: false },
      share: { shareCount: 100 }
    };

    return {
      success: true,
      ...responses[input.action]
    };
  });