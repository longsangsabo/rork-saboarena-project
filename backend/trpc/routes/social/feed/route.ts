import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

export const getFeed = publicProcedure
  .input(z.object({ 
    type: z.enum(['nearby', 'following']).optional().default('nearby'),
    limit: z.number().optional().default(10)
  }))
  .query(async ({ input, ctx }) => {
    try {
      // Fetch social feed from activities/posts table
      // For now, we'll use match_requests as social posts
      const { data: posts, error } = await ctx.supabase
        .from('match_requests')
        .select(`
          match_request_id,
          requester_uid,
          match_type,
          game_type,
          message,
          stake_amount,
          created_at,
          users!match_requests_requester_uid_fkey(
            uid,
            user_name,
            display_name,
            photo_url,
            rank,
            elo_rating,
            last_seen
          )
        `)
        .order('created_at', { ascending: false })
        .limit(input.limit);

      if (error) {
        console.error('Error fetching social feed:', error);
        throw error;
      }

      // Transform data to match frontend expectations
      const transformedFeed = posts?.map(post => {
        const user = Array.isArray(post.users) ? post.users[0] : post.users;
        const isOnline = user?.last_seen ? 
          new Date(user.last_seen) > new Date(Date.now() - 5 * 60 * 1000) : false;

        return {
          id: post.match_request_id,
          type: 'challenge' as const,
          user: {
            id: user?.uid || post.requester_uid,
            username: user?.user_name ? `@${user.user_name}` : '@user',
            displayName: user?.display_name || 'Unknown User',
            avatar: user?.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
            rank: user?.rank || 'K',
            elo: user?.elo_rating || 1200,
            isOnline
          },
          club: {
            id: '1',
            name: 'SABO Billiards',
            location: 'Vũng Tàu',
            avatar: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=50&h=50&fit=crop'
          },
          content: {
            message: post.message || `Thách đấu ${post.game_type} - Cược ${post.stake_amount?.toLocaleString('vi-VN')} VND #sabo #${user?.rank || 'K'}`,
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
          },
          interactions: {
            likes: Math.floor(Math.random() * 100000),
            comments: Math.floor(Math.random() * 1000),
            shares: Math.floor(Math.random() * 100),
            is_liked: false,
            is_bookmarked: false
          },
          created_at: post.created_at
        };
      }) || [];

      return {
        feed: transformedFeed,
        total: transformedFeed.length,
        hasMore: transformedFeed.length >= input.limit
      };

    } catch (error) {
      console.error('Social feed query error:', error);
      // Fallback to mock data
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
    }
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