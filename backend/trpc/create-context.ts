import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { supabase, authService } from "../../packages/shared-auth/src";
import type { User } from "../../packages/shared-auth/src";

// Context creation function
export const createContext = async (opts: FetchCreateContextFnOptions) => {
  const authorization = opts.req.headers.get('authorization');
  let user: User | null = null;

  if (authorization?.startsWith('Bearer ')) {
    const token = authorization.substring(7);
    try {
      // Verify the JWT token with Supabase
      const { data: { user: authUser }, error } = await supabase.auth.getUser(token);
      if (!error && authUser) {
        user = await authService.getCurrentUser();
      }
    } catch (error) {
      // Token is invalid, but we don't throw error here
      // Let individual procedures decide if auth is required
      console.log('Invalid token provided:', error);
    }
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