import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { createClient } from '@supabase/supabase-js';
import type { User } from "@/lib/shared-auth/src";

// Rate limiting configuration (will be implemented in middleware)
// const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
// const RATE_LIMIT_MAX_REQUESTS = 100; // Max requests per window
// const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Supabase configuration - using environment variables for security
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY');
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Mock user for development
const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  role: 'user',
  username: 'Test User',
  avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Context creation function
export const createContext = async (opts: FetchCreateContextFnOptions) => {
  let user: User | null = null;
  
  try {
    // Extract JWT token from Authorization header
    const authHeader = opts.req.headers.get('authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      // Verify JWT token with Supabase
      const { data: { user: authUser }, error } = await supabase.auth.getUser(token);
      
      if (error) {
        console.warn('Authentication error:', error.message);
      } else if (authUser) {
        // Map Supabase user to our User interface
        user = {
          id: authUser.id,
          email: authUser.email || '',
          role: 'user', // Default role, should be fetched from user profile
          username: authUser.user_metadata?.username || authUser.email?.split('@')[0] || 'Unknown',
          avatar_url: authUser.user_metadata?.avatar_url || null,
          created_at: authUser.created_at,
          updated_at: authUser.updated_at || authUser.created_at
        };
      }
    }
    
    // In development mode, fall back to mock user if no auth provided
    if (!user && process.env.NODE_ENV === 'development') {
      console.warn('No authentication provided, using mock user for development');
      user = mockUser;
    }
  } catch (error) {
    console.error('Error in createContext:', error);
  }

  return {
    req: opts.req,
    user,
    supabase,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

// Initialize tRPC
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const router = t.router;
export const publicProcedure = t.procedure;

// Protected procedure that requires authentication
export const protectedProcedure = t.procedure.use(async (opts) => {
  const { ctx } = opts;
  
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Authentication required. Please log in to access this resource.',
    });
  }
  
  // Additional validation for user data integrity
  if (!ctx.user.id || !ctx.user.email) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid user session. Please log in again.',
    });
  }
  
  return opts.next({
    ctx: {
      ...ctx,
      user: ctx.user, // user is now guaranteed to be non-null and valid
    },
  });
});

// Admin procedure that requires admin role
export const adminProcedure = protectedProcedure.use(async (opts) => {
  const { ctx } = opts;
  
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Admin access required for this operation.',
    });
  }
  
  return opts.next({ ctx });
});