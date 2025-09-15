import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure } from "@/backend/trpc/create-context";
import { authService } from "../../../../lib/shared-auth/src";

// Login endpoint
export const login = publicProcedure
  .input(z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters")
  }))
  .mutation(async ({ input }) => {
    try {
      const user = await authService.signIn(input.email, input.password);
      return {
        success: true,
        user,
        message: "Login successful"
      };
    } catch (error) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: error instanceof Error ? error.message : 'Login failed',
      });
    }
  });

// Register endpoint
export const register = publicProcedure
  .input(z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    username: z.string().min(3, "Username must be at least 3 characters").optional()
  }))
  .mutation(async ({ input }) => {
    try {
      const user = await authService.signUp(input.email, input.password, input.username);
      return {
        success: true,
        user,
        message: "Registration successful"
      };
    } catch (error) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error instanceof Error ? error.message : 'Registration failed',
      });
    }
  });

// Logout endpoint
export const logout = publicProcedure
  .mutation(async () => {
    try {
      await authService.signOut();
      return {
        success: true,
        message: "Logout successful"
      };
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error instanceof Error ? error.message : 'Logout failed',
      });
    }
  });

// Get current user profile
export const getCurrentUser = publicProcedure
  .query(async ({ ctx }) => {
    if (!ctx.user) {
      return { user: null };
    }
    
    try {
      const user = await authService.getCurrentUser();
      return { user };
    } catch (error) {
      return { user: null };
    }
  });