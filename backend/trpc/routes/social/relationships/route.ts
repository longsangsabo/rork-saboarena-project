import { z } from "zod";
import { protectedProcedure } from "../../create-context";

// Follow a user
export const followUser = protectedProcedure
  .input(z.object({ 
    userId: z.string() 
  }))
  .mutation(async ({ input, ctx }) => {
    // Mock follow functionality
    console.log('Following user:', input.userId, 'by:', ctx.user.id);
    
    return {
      success: true,
      message: "Đã theo dõi thành công",
      isFollowing: true,
      followerCount: 123 // Mock count
    };
  });

// Unfollow a user
export const unfollowUser = protectedProcedure
  .input(z.object({ 
    userId: z.string() 
  }))
  .mutation(async ({ input, ctx }) => {
    // Mock unfollow functionality
    console.log('Unfollowing user:', input.userId, 'by:', ctx.user.id);
    
    return {
      success: true,
      message: "Đã bỏ theo dõi",
      isFollowing: false,
      followerCount: 122 // Mock count
    };
  });

// Get relationship status between users
export const getRelationshipStatus = protectedProcedure
  .input(z.object({ 
    userId: z.string() 
  }))
  .query(async ({ input, ctx }) => {
    // Mock relationship data
    return {
      isFollowing: false,
      isFollowedBy: false,
      isFriend: false,
      canMessage: true,
      canChallenge: true,
      mutualFriends: 5
    };
  });

// Get user's followers
export const getUserFollowers = protectedProcedure
  .input(z.object({ 
    userId: z.string().optional(),
    limit: z.number().optional().default(20),
    offset: z.number().optional().default(0)
  }))
  .query(async ({ input }) => {
    // Mock followers data
    const mockFollowers = [
      {
        id: "1",
        username: "player1",
        displayName: "Player One",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop",
        rank: "G",
        elo: 1500,
        isFollowing: true
      },
      {
        id: "2", 
        username: "player2",
        displayName: "Player Two",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b743?w=50&h=50&fit=crop",
        rank: "S",
        elo: 1800,
        isFollowing: false
      }
    ];

    return {
      followers: mockFollowers.slice(input.offset, input.offset + input.limit),
      total: mockFollowers.length,
      hasMore: mockFollowers.length > input.offset + input.limit
    };
  });

// Get who the user is following
export const getUserFollowing = protectedProcedure
  .input(z.object({ 
    userId: z.string().optional(),
    limit: z.number().optional().default(20),
    offset: z.number().optional().default(0)
  }))
  .query(async ({ input }) => {
    // Mock following data
    const mockFollowing = [
      {
        id: "3",
        username: "pro_player",
        displayName: "Pro Player",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop",
        rank: "G",
        elo: 2000,
        isFollowingBack: true
      }
    ];

    return {
      following: mockFollowing.slice(input.offset, input.offset + input.limit),
      total: mockFollowing.length,
      hasMore: mockFollowing.length > input.offset + input.limit
    };
  });