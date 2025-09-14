import type { User, UserRole } from './types';

// Mock Supabase client for development
const mockSupabaseClient = {
  auth: {
    signInWithPassword: async () => ({ data: { user: { id: '1', email: 'test@example.com' } }, error: null }),
    signUp: async () => ({ data: { user: { id: '1', email: 'test@example.com' } }, error: null }),
    signOut: async () => ({ error: null }),
    getUser: async () => ({ data: { user: { id: '1', email: 'test@example.com' } }, error: null }),
    onAuthStateChange: (callback: any) => {
      // Mock auth state change
      setTimeout(() => callback('SIGNED_IN', { user: { id: '1', email: 'test@example.com' } }), 100);
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({
          data: {
            id: '1',
            email: 'test@example.com',
            role: 'user' as UserRole,
            username: 'Test User',
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          error: null
        })
      })
    }),
    insert: () => ({
      select: () => ({
        single: async () => ({
          data: {
            id: '1',
            email: 'test@example.com',
            role: 'user' as UserRole,
            username: 'Test User',
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          error: null
        })
      })
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: async () => ({
            data: {
              id: '1',
              email: 'test@example.com',
              role: 'user' as UserRole,
              username: 'Test User',
              avatar_url: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            error: null
          })
        })
      })
    }),
    order: () => ({
      async: async () => ({ data: [], error: null })
    })
  })
};

// Use mock client for now
export const supabase = mockSupabaseClient as any;
export const supabaseAdmin = mockSupabaseClient as any;

console.log('🔧 Using mock auth service for development');

/**
 * Centralized Authentication Service
 * Handles all auth operations for both user and admin apps
 */
export class AuthService {
  async signIn(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user returned from sign in');

    return await this.getCurrentUser();
  }

  async signUp(email: string, password: string, username?: string): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user returned from sign up');

    return await this.getCurrentUser();
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser(): Promise<User> {
    // Return mock user for development
    return {
      id: '1',
      email: 'test@example.com',
      role: 'user' as UserRole,
      username: 'Test User',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) throw authError;
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async checkUserRole(userId: string): Promise<UserRole> {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data.role;
  }

  isAdmin(user: User | null): boolean {
    return user?.role === 'admin' || user?.role === 'super_admin';
  }

  isSuperAdmin(user: User | null): boolean {
    return user?.role === 'super_admin';
  }

  requireAdminAccess(user: User | null): void {
    if (!this.isAdmin(user)) {
      throw new Error('Admin access required');
    }
  }

  requireSuperAdminAccess(user: User | null): void {
    if (!this.isSuperAdmin(user)) {
      throw new Error('Super admin access required');
    }
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
      if (session?.user) {
        try {
          const user = await this.getCurrentUser();
          callback(user);
        } catch (error) {
          console.error('Error getting current user:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }

  // Admin-specific methods using service role
  async getAllUsers() {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async updateUserRole(userId: string, role: string) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserStats() {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('role, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    const stats = {
      total: data.length,
      admins: data.filter((u: any) => u.role === 'admin').length,
      users: data.filter((u: any) => u.role === 'user').length,
      recent: data.filter((u: any) => {
        const created = new Date(u.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return created > weekAgo;
      }).length
    };

    return stats;
  }

  // Role management methods
  hasRole(user: User | null, role: UserRole): boolean {
    if (!user) return false;
    // Role checking logic - could be from user metadata or separate profile table
    return this.isAdmin(user) && (role === 'admin' || role === 'super_admin');
  }

  async switchRole(user: User | null, role: UserRole): Promise<void> {
    if (!user) throw new Error('No user provided');
    
    // Update the user's role in the database
    const { error } = await supabaseAdmin
      .from('user_profiles')
      .update({ role })
      .eq('user_id', user.id);

    if (error) throw error;
  }
}

// Export singleton instance
export const authService = new AuthService();
