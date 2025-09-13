import { z } from "zod";
import { publicProcedure, protectedProcedure } from "../../create-context";

// Get club details with stats and tables
export const getClubDetails = publicProcedure
  .input(z.object({ 
    clubId: z.string() 
  }))
  .query(async ({ input, ctx }) => {
    try {
      const { data: club, error } = await ctx.supabase
        .from('clubs')
        .select(`
          *,
          club_profiles(description, verification_status),
          club_stats(
            total_members,
            monthly_revenue,
            average_rating,
            popular_time_slots
          ),
          club_tables(
            table_number,
            table_name,
            status,
            hourly_rate
          )
        `)
        .eq('id', input.clubId)
        .single();

      if (error) {
        throw new Error('Club not found');
      }

      return {
        ...club,
        tables: club.club_tables || [],
        stats: club.club_stats?.[0] || null,
        profile: club.club_profiles?.[0] || null
      };
    } catch (error) {
      console.error('Get club details error:', error);
      throw new Error('Failed to get club details');
    }
  });

// Get club leaderboard
export const getClubLeaderboard = publicProcedure
  .input(z.object({
    clubId: z.string(),
    period: z.enum(['weekly', 'monthly', 'all_time']).optional().default('monthly'),
    limit: z.number().optional().default(10)
  }))
  .query(async ({ input, ctx }) => {
    try {
      // Get club members with their stats
      const { data: members, error } = await ctx.supabase
        .from('club_memberships')
        .select(`
          user_id,
          users(
            id,
            username,
            avatar_url,
            elo,
            rank,
            total_matches,
            wins,
            losses
          )
        `)
        .eq('club_id', input.clubId)
        .eq('status', 'active')
        .order('users(elo)', { ascending: false })
        .limit(input.limit);

      if (error) {
        throw new Error('Failed to get leaderboard');
      }

      const leaderboard = members?.map((member, index) => ({
        position: index + 1,
        user_id: member.users?.id,
        username: member.users?.username,
        avatar_url: member.users?.avatar_url,
        elo: member.users?.elo || 1200,
        rank: member.users?.rank || 'K',
        total_matches: member.users?.total_matches || 0,
        wins: member.users?.wins || 0,
        losses: member.users?.losses || 0,
        win_rate: member.users?.total_matches > 0 
          ? Math.round((member.users.wins / member.users.total_matches) * 100) 
          : 0
      })) || [];

      return {
        leaderboard,
        period: input.period,
        total: leaderboard.length
      };
    } catch (error) {
      console.error('Get club leaderboard error:', error);
      throw new Error('Failed to get club leaderboard');
    }
  });

// Leave club
export const leaveClub = protectedProcedure
  .input(z.object({
    clubId: z.string()
  }))
  .mutation(async ({ input, ctx }) => {
    try {
      const { error } = await ctx.supabase
        .from('club_memberships')
        .update({ 
          status: 'inactive',
          left_date: new Date().toISOString()
        })
        .eq('club_id', input.clubId)
        .eq('user_id', ctx.user.id);

      if (error) {
        throw new Error('Failed to leave club');
      }

      return {
        success: true,
        message: 'Successfully left the club'
      };
    } catch (error) {
      console.error('Leave club error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to leave club'
      };
    }
  });

// Update club member role (admin only)
export const updateMemberRole = protectedProcedure
  .input(z.object({
    clubId: z.string(),
    userId: z.string(),
    role: z.enum(['member', 'moderator', 'admin'])
  }))
  .mutation(async ({ input, ctx }) => {
    try {
      // In production, check if current user has admin permissions for this club
      
      const { error } = await ctx.supabase
        .from('club_memberships')
        .update({ 
          role: input.role,
          updated_at: new Date().toISOString()
        })
        .eq('club_id', input.clubId)
        .eq('user_id', input.userId);

      if (error) {
        throw new Error('Failed to update member role');
      }

      return {
        success: true,
        message: `Member role updated to ${input.role}`
      };
    } catch (error) {
      console.error('Update member role error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update member role'
      };
    }
  });