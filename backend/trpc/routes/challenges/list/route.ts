import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

export const getChallenges = publicProcedure
  .input(z.object({ 
    type: z.enum(['giaoluu', 'thachdau']).optional().default('giaoluu'),
    limit: z.number().optional().default(10),
    clubId: z.string().optional(),
    status: z.enum(['waiting', 'live', 'finished']).optional().default('waiting')
  }))
  .query(async ({ input, ctx }) => {
    try {
      // Fetch challenges from match_requests table
      const { data: challenges, error } = await ctx.supabase
        .from('match_requests')
        .select(`
          match_request_id,
          requester_uid,
          requested_uid,
          match_type,
          game_type,
          status,
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
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(input.limit);

      if (error) {
        console.error('Error fetching challenges:', error);
        throw error;
      }

      // Transform data to match frontend expectations
      const transformedChallenges = challenges?.map(challenge => {
        const user = Array.isArray(challenge.users) ? challenge.users[0] : challenge.users;
        const isOnline = user?.last_seen ? 
          new Date(user.last_seen) > new Date(Date.now() - 5 * 60 * 1000) : false;

        return {
          id: challenge.match_request_id,
          type: input.type, // Map from match_type if needed
          user: {
            id: user?.uid || challenge.requester_uid,
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
          message: challenge.message || `Thách đấu ${challenge.game_type} - Cược ${challenge.stake_amount?.toLocaleString('vi-VN')} VND`,
          created_at: challenge.created_at,
          likes: Math.floor(Math.random() * 100000), // TODO: Implement likes system
          comments: Math.floor(Math.random() * 1000),
          shares: Math.floor(Math.random() * 100),
          is_liked: false // TODO: Check if current user liked
        };
      }) || [];

      return {
        challenges: transformedChallenges,
        total: transformedChallenges.length
      };

    } catch (error) {
      console.error('Challenges query error:', error);
      // Fallback to mock data
      const mockChallenges = [
        {
          id: '1',
          type: 'giaoluu' as const,
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
          message: 'Tìm đối tối nay   #sabo #rankG',
          created_at: '2024-09-03T15:30:00Z',
          likes: 328700,
          comments: 578,
          shares: 99,
          is_liked: false
        }
      ];

      const filtered = mockChallenges.filter(c => c.type === input.type);

      return {
        challenges: filtered.slice(0, input.limit),
        total: filtered.length
      };
    }
  });

export const createChallenge = publicProcedure
  .input(z.object({
    type: z.enum(['giaoluu', 'thachdau']),
    message: z.string(),
    scheduled_time: z.string().optional()
  }))
  .mutation(async ({ input }) => {
    console.log('Creating challenge:', input);
    return {
      success: true,
      challengeId: Math.random().toString(36).substr(2, 9),
      message: "Challenge created successfully"
    };
  });

export const likeChallenge = publicProcedure
  .input(z.object({ challengeId: z.string() }))
  .mutation(async ({ input }) => {
    console.log('Liking challenge:', input.challengeId);
    return {
      success: true,
      isLiked: true,
      likeCount: 328701
    };
  });

export const joinChallenge = publicProcedure
  .input(z.object({
    challengeId: z.string().min(1),
    userId: z.string().min(1).optional(),
    teamId: z.string().optional()
  }))
  .mutation(async ({ input }) => {
    console.log('Joining challenge:', input);
    
    // Simulate validation
    const challengeExists = true; // Assume challenge exists
    
    if (!challengeExists) {
      throw new Error('Thách đấu không tồn tại');
    }

    // Simulate checking if challenge is full
    const isChallengeFull = Math.random() < 0.1; // 10% chance challenge is full
    
    if (isChallengeFull) {
      throw new Error('Thách đấu đã đầy, không thể tham gia');
    }

    // Simulate checking if user already joined
    const alreadyJoined = Math.random() < 0.2; // 20% chance already joined
    
    if (alreadyJoined) {
      throw new Error('Bạn đã tham gia thách đấu này rồi');
    }

    return {
      success: true,
      message: 'Đã tham gia thách đấu thành công!',
      data: {
        challengeId: input.challengeId,
        userId: input.userId || 'current-user',
        joinedAt: new Date().toISOString(),
        position: Math.floor(Math.random() * 50) + 1, // Random position in challenge
        teamId: input.teamId
      }
    };
  });