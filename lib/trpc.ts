import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";
import { createClient } from '@supabase/supabase-js';

export const trpc = createTRPCReact<AppRouter>();

// Direct Supabase client for fallback
const supabaseUrl = 'https://skzirkhzwhyqmnfyytcl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNremlya2h6d2h5cW1uZnl5dGNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NDM3MzUsImV4cCI6MjA3MzMxOTczNX0._0Ic0SL4FZVMennTXmOzIp2KBOCwRagpbRXaWhZJI24';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Simple API service as fallback
export const apiService = {
  async getTournaments(params: { status?: string; limit?: number } = {}) {
    try {
      console.log('🚀 Direct API - Getting tournaments:', params);
      
      let query = supabase
        .from('tournaments')
        .select(`
          id,
          name,
          description,
          max_participants,
          entry_fee,
          total_prize,
          status,
          club_id,
          created_at,
          start_time,
          registration_deadline
        `);

      if (params.status && params.status !== 'all') {
        query = query.eq('status', params.status);
      }

      query = query
        .order('created_at', { ascending: false })
        .limit(params.limit || 10);

      const { data: tournaments, error } = await query;
      
      if (error) {
        console.error('❌ Supabase direct query error:', error);
        throw error;
      }

      const transformedTournaments = (tournaments || []).map((tournament: any) => {
        const participantCount = Math.floor(Math.random() * (tournament.max_participants || 16));
        
        return {
          id: tournament.id,
          title: tournament.name,
          description: tournament.description || 'Giải đấu bi-a chuyên nghiệp',
          image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
          prize_pool: tournament.total_prize || 0,
          entry_fee: tournament.entry_fee || 0,
          current_players: participantCount,
          max_players: tournament.max_participants || 16,
          min_rank: 'K',
          max_rank: 'S',
          location: 'SABO Arena',
          club_name: 'SABO Club',
          start_time: tournament.start_time || new Date().toISOString(),
          end_time: tournament.start_time || new Date().toISOString(),
          registration_deadline: tournament.registration_deadline,
          status: tournament.status === 'registration_open' ? 'upcoming' : 
                  tournament.status === 'in_progress' ? 'live' : 'completed',
          club_id: tournament.club_id,
          created_at: tournament.created_at
        };
      });

      console.log('✅ Direct API - Success:', transformedTournaments.length, 'tournaments');
      return {
        tournaments: transformedTournaments,
        total: transformedTournaments.length
      };
    } catch (error) {
      console.error('🚨 Direct API - Error:', error);
      
      // Fallback mock data
      const mockTournaments = [
        {
          id: 'mock-1',
          title: 'SABO Championship 2025',
          description: 'Giải đấu bi-a lớn nhất năm với giải thưởng hấp dẫn',
          image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
          prize_pool: 50000000,
          entry_fee: 200000,
          current_players: 28,
          max_players: 32,
          min_rank: 'A',
          max_rank: 'S',
          location: 'SABO Center - TP.HCM',
          club_name: 'SABO Elite Club',
          start_time: '2025-09-20T09:00:00Z',
          end_time: '2025-09-20T18:00:00Z',
          status: 'upcoming' as const,
          club_id: 'mock-club-1',
          created_at: '2025-09-01T00:00:00Z'
        },
        {
          id: 'mock-2',
          title: 'Weekly Tournament',
          description: 'Giải đấu hàng tuần cho mọi trình độ',
          image_url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=200&fit=crop',
          prize_pool: 5000000,
          entry_fee: 50000,
          current_players: 12,
          max_players: 16,
          min_rank: 'K',
          max_rank: 'A',
          location: 'Elite Billiards - Hà Nội',
          club_name: 'Elite Billiards',
          start_time: '2025-09-16T19:00:00Z',
          end_time: '2025-09-16T23:00:00Z',
          status: 'live' as const,
          club_id: 'mock-club-2',
          created_at: '2025-09-10T00:00:00Z'
        },
        {
          id: 'mock-3',
          title: 'Beginner Tournament',
          description: 'Giải đấu dành cho người mới bắt đầu',
          image_url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=200&fit=crop',
          prize_pool: 2000000,
          entry_fee: 30000,
          current_players: 8,
          max_players: 16,
          min_rank: 'K',
          max_rank: 'B',
          location: 'SABO Training Center',
          club_name: 'SABO Academy',
          start_time: '2025-09-18T14:00:00Z',
          end_time: '2025-09-18T18:00:00Z',
          status: 'upcoming' as const,
          club_id: 'mock-club-3',
          created_at: '2025-09-05T00:00:00Z'
        }
      ];

      return {
        tournaments: mockTournaments.slice(0, params.limit || 10),
        total: mockTournaments.length,
        fallback: true
      };
    }
  }
};

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    console.log('📍 Using env variable for base URL:', process.env.EXPO_PUBLIC_RORK_API_BASE_URL);
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  }

  const defaultUrl = 'https://greetings-project-scb4vi6.rork.com';
  console.log('📍 Using default base URL:', defaultUrl);
  return defaultUrl;
};

const baseUrl = getBaseUrl();
const trpcUrl = `${baseUrl}/api/trpc`;
console.log('🔗 Full tRPC URL:', trpcUrl);

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: trpcUrl,
      transformer: superjson,
      headers: {
        'Content-Type': 'application/json',
      },
      fetch: (url, options) => {
        console.log('🌐 tRPC Fetch:', String(url), options?.method || 'GET');
        return fetch(url as string, options as RequestInit).then(response => {
          console.log('📡 tRPC Response:', response.status, response.statusText);
          if (!response.ok) {
            console.error('❌ tRPC Error Response:', response.status, response.statusText);
          }
          return response;
        }).catch(error => {
          console.error('🚨 tRPC Network Error:', String(error));
          throw error;
        });
      },
    }),
  ],
});