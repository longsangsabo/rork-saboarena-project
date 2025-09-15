import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

export const getClubs = publicProcedure
  .input(z.object({ 
    city: z.string().optional(),
    district: z.string().optional(),
    limit: z.number().optional().default(10),
    status: z.enum(['all', 'active', 'inactive']).optional().default('active')
  }))
  .query(async ({ input, ctx }) => {
    try {
      // Build query with joins to get club stats
      let query = ctx.supabase
        .from('clubs')
        .select(`
          id,
          name,
          address,
          city,
          district,
          phone,
          status,
          table_count,
          is_sabo_partner,
          created_at,
          club_profiles(description, verification_status),
          club_stats(
            total_members,
            monthly_revenue,
            average_rating,
            popular_time_slots
          )
        `);

      // Apply filters
      if (input.status !== 'all') {
        query = query.eq('status', input.status);
      }
      
      if (input.city) {
        query = query.eq('city', input.city);
      }
      
      if (input.district) {
        query = query.eq('district', input.district);
      }

      // Apply limit and ordering
      query = query
        .order('created_at', { ascending: false })
        .limit(input.limit);

      const { data: clubs, error } = await query;

      if (error) {
        console.error('Error fetching clubs:', error);
        throw new Error('Failed to fetch clubs');
      }

      // Transform data to match frontend expectations
      const transformedClubs = clubs?.map(club => ({
        id: club.id,
        name: club.name,
        username: `@${club.name.toLowerCase().replace(/\s+/g, '')}`,
        description: club.club_profiles?.[0]?.description || 'Billiards club',
        avatar: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop',
        cover_image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
        location: `${club.address}, ${club.district}, ${club.city}`,
        member_count: club.club_stats?.[0]?.total_members || 0,
        tournament_count: 0, // Will be calculated from tournaments table
        prize_pool: club.club_stats?.[0]?.monthly_revenue || 0,
        challenge_count: 0, // Will be calculated from challenges table
        rating: club.club_stats?.[0]?.average_rating || 4.0,
        is_verified: club.club_profiles?.[0]?.verification_status === 'approved',
        is_sabo_partner: club.is_sabo_partner,
        table_count: club.table_count,
        status: club.status,
        created_at: club.created_at
      })) || [];

      return {
        clubs: transformedClubs,
        total: transformedClubs.length
      };

    } catch (error) {
      console.error('Club query error:', error);
      // Fallback to mock data
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
          is_sabo_partner: true,
          table_count: 12,
          status: 'active',
          created_at: '2023-01-15T00:00:00Z'
        }
      ];

      return {
        clubs: mockClubs.slice(0, input.limit),
        total: mockClubs.length
      };
    }
  });

export const getClubMembers = publicProcedure
  .input(z.object({ 
    clubId: z.string(),
    limit: z.number().optional().default(20)
  }))
  .query(async ({ input, ctx }) => {
    try {
      // Get club members through club_memberships table
      const { data: memberships, error } = await ctx.supabase
        .from('club_memberships')
        .select(`
          user_id,
          joined_date,
          role,
          status,
          users(
            id,
            username,
            avatar_url,
            elo,
            rank,
            total_matches,
            last_seen
          )
        `)
        .eq('club_id', input.clubId)
        .eq('status', 'active')
        .order('joined_date', { ascending: false })
        .limit(input.limit);

      if (error) {
        console.error('Error fetching club members:', error);
        throw new Error('Failed to fetch club members');
      }

      // Transform data
      const transformedMembers = memberships?.map((membership: any) => {
        const user = Array.isArray(membership.users) ? membership.users[0] : membership.users;
        return {
          id: user?.id || membership.user_id,
          name: user?.username || 'Unknown User',
          rank: user?.rank || 'K',
          avatar: user?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          isOnline: user?.last_seen ? 
            new Date(user.last_seen) > new Date(Date.now() - 5 * 60 * 1000) : false,
          joinDate: new Date(membership.joined_date).toLocaleDateString('vi-VN'),
          elo: user?.elo || 1200,
          matches: user?.total_matches || 0,
          role: membership.role
        };
      }) || [];

      return {
        members: transformedMembers,
        total: transformedMembers.length
      };

    } catch (error) {
      console.error('Club members query error:', error);
      // Fallback to mock data
      const mockMembers = [
        {
          id: '1',
          name: 'Anh Long Magic',
          rank: 'G',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          isOnline: true,
          joinDate: '04/09/2025',
          elo: 1485,
          matches: 37,
          role: 'member'
        }
      ];

      return {
        members: mockMembers,
        total: mockMembers.length
      };
    }
  });

export const joinClub = publicProcedure
  .input(z.object({ 
    clubId: z.string() 
  }))
  .mutation(async ({ input, ctx }) => {
    try {
      // For now allow anonymous joins, in production should require auth
      const userId = ctx.user?.id || 'anonymous-user';

      // Check if club exists
      const { data: club, error: clubError } = await ctx.supabase
        .from('clubs')
        .select('id, name, status')
        .eq('id', input.clubId)
        .single();

      if (clubError || !club) {
        throw new Error('Club not found');
      }

      if (club.status !== 'active') {
        throw new Error('Club is not accepting new members');
      }

      // Check if user is already a member
      const { data: existingMembership } = await ctx.supabase
        .from('club_memberships')
        .select('id')
        .eq('club_id', input.clubId)
        .eq('user_id', userId)
        .single();

      if (existingMembership) {
        return {
          success: false,
          message: "You are already a member of this club"
        };
      }

      // Add user to club
      const { error: insertError } = await ctx.supabase
        .from('club_memberships')
        .insert({
          club_id: input.clubId,
          user_id: userId,
          joined_date: new Date().toISOString(),
          role: 'member',
          status: 'active'
        });

      if (insertError) {
        console.error('Error joining club:', insertError);
        throw new Error('Failed to join club');
      }

      return {
        success: true,
        message: `Successfully joined ${club.name}`
      };

    } catch (error) {
      console.error('Join club error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to join club'
      };
    }
  });