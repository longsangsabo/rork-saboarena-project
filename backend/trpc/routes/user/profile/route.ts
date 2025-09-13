import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

export const getUserProfile = publicProcedure
  .input(z.object({ userId: z.string().optional() }))
  .query(async ({ input }) => {
    // Mock user profile data
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
  });

export const updateUserProfile = publicProcedure
  .input(z.object({
    displayName: z.string().optional(),
    bio: z.string().optional(),
    avatar: z.string().optional()
  }))
  .mutation(async ({ input }) => {
    console.log('Updating user profile:', input);
    return {
      success: true,
      message: "Profile updated successfully"
    };
  });