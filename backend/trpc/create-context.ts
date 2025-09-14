import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { createClient } from '@supabase/supabase-js';
import type { User } from "../../lib/shared-auth/src";

// Supabase configuration
const supabaseUrl = 'https://skzirkhzwhyqmnfyytcl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNremlya2h6d2h5cW1uZnl5dGNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NDM3MzUsImV4cCI6MjA3MzMxOTczNX0._0Ic0SL4FZVMennTXmOzIp2KBOCwRagpbRXaWhZJI24';

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
  // For development, always return mock user
  const user = mockUser;

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
      message: 'You must be logged in to access this resource',
    });
  }
  return opts.next({
    ctx: {
      ...ctx,
      user: ctx.user, // user is now guaranteed to be non-null
    },
  });
});