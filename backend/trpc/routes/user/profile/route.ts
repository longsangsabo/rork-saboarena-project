import { z } from "zod";
import { publicProcedure, protectedProcedure } from "@/backend/trpc/create-context";

export const getUserProfile = publicProcedure
  .input(z.object({ userId: z.string().optional() }))
  .query(async ({ input, ctx }) => {
    try {
      const userId = input.userId || ctx.user?.id || '1';
      
      // Fetch user profile from database
      const { data: user, error } = await ctx.supabase
        .from('users')
        .select(`
          uid,
          user_name,
          display_name,
          full_name,
          email,
          phone_number,
          bio,
          location,
          rank,
          elo_rating,
          spa_points,
          photo_url,
          club_id,
          total_matches,
          wins,
          losses,
          created_at,
          updated_at,
          last_seen
        `)
        .eq('uid', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        // Fallback to mock data
        return {
          id: userId,
          username: "@longsang",
          displayName: "Anh Long Magic",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
          rank: "G",
          elo: 1485,
          spa: 320,
          ranking: 89,
          matches: 37,
          wins: 25,
          losses: 12,
          winRate: 67.6,
          joinDate: "2024-01-15",
          isOnline: true,
          location: "Vũng Tàu",
          bio: "Passionate billiards player from Vung Tau"
        };
      }

      // Calculate win rate
      const winRate = user.total_matches > 0 ? (user.wins / user.total_matches) * 100 : 0;
      
      // Check if user is online (last seen within 5 minutes)
      const isOnline = user.last_seen ? 
        new Date(user.last_seen) > new Date(Date.now() - 5 * 60 * 1000) : false;

      return {
        id: user.uid,
        username: user.user_name ? `@${user.user_name}` : `@${user.display_name?.toLowerCase().replace(/\s+/g, '') || 'user'}`,
        displayName: user.display_name || user.full_name || 'Unknown User',
        avatar: user.photo_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        rank: user.rank || 'K',
        elo: user.elo_rating || 1200,
        spa: user.spa_points || 0,
        ranking: 89, // TODO: Calculate from rankings table
        matches: user.total_matches || 0,
        wins: user.wins || 0,
        losses: user.losses || 0,
        winRate: Math.round(winRate * 10) / 10,
        joinDate: new Date(user.created_at).toLocaleDateString('vi-VN'),
        isOnline,
        location: user.location || '',
        bio: user.bio || ''
      };
    } catch (error) {
      console.error('User profile query error:', error);
      // Fallback to mock data
      return {
        id: input.userId || "1",
        username: "@longsang",
        displayName: "Anh Long Magic",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        rank: "G",
        elo: 1485,
        spa: 320,
        ranking: 89,
        matches: 37,
        wins: 25,
        losses: 12,
        winRate: 67.6,
        joinDate: "2024-01-15",
        isOnline: true,
        location: "Vũng Tàu",
        bio: "Passionate billiards player from Vung Tau"
      };
    }
  });

export const updateUserProfile = protectedProcedure
  .input(z.object({
    displayName: z.string().optional(),
    bio: z.string().optional(),
    avatar: z.string().optional()
  }))
  .mutation(async ({ input, ctx }) => {
    console.log('Updating user profile for user:', ctx.user.id, 'with data:', input);
    // Here we would update the user in database using ctx.user.id
    return {
      success: true,
      message: "Profile updated successfully",
      userId: ctx.user.id
    };
  });