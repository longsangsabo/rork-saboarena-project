import { SupabaseClient } from '@supabase/supabase-js';

export interface SocialFeedPost {
  id: string;
  type: 'match_result' | 'achievement' | 'challenge' | 'tournament_update';
  user: {
    id: string;
    name: string;
    avatar: string;
    rank: string;
  };
  content: string;
  timestamp: string;
  stats?: {
    likes: number;
    comments: number;
    shares: number;
    score?: string;
    opponent?: string;
    achievement?: string;
    challenge_type?: string;
    tournament_name?: string;
  };
  isLiked?: boolean;
  raw_data?: any;
}

export interface SocialStoryItem {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  type: 'live_match' | 'achievement' | 'highlight' | 'tournament';
  thumbnail?: string;
  isLive?: boolean;
  title: string;
}

export interface SocialInteraction {
  postId: string;
  userId: string;
  type: 'like' | 'comment' | 'share';
  content?: string;
  timestamp: Date;
}

/**
 * SABO Arena Social Feed Service
 * 
 * Manages social interactions, feed posts, and stories for mobile app
 * Extracted from useSocialFeed hook for mobile compatibility
 */
export class SocialFeedService {
  private supabase: SupabaseClient;
  
  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  /**
   * Fetch social feed data from multiple sources
   */
  async getFeedData(): Promise<{
    posts: SocialFeedPost[];
    stories: SocialStoryItem[];
    error?: string;
  }> {
    try {
      // Fetch recent completed matches
      const { data: matchData, error: matchError } = await this.supabase
        .from('matches')
        .select('*')
        .eq('status', 'completed')
        .not('winner_id', 'is', null)
        .order('created_at', { ascending: false })
        .limit(10);

      if (matchError) throw matchError;

      // Fetch player profiles
      const playerIds = new Set<string>();
      matchData?.forEach(match => {
        if (match.player1_id) playerIds.add(match.player1_id);
        if (match.player2_id) playerIds.add(match.player2_id);
      });

      const { data: profiles } = await this.supabase
        .from('profiles')
        .select('user_id, full_name, display_name, avatar_url')
        .in('user_id', Array.from(playerIds));

      const profileMap = (profiles || []).reduce((acc, profile) => {
        acc[profile.user_id] = profile;
        return acc;
      }, {} as Record<string, any>);

      // Merge match data with profiles
      const matches = matchData?.map(match => ({
        ...match,
        player1: profileMap[match.player1_id] || null,
        player2: profileMap[match.player2_id] || null,
      })) || [];

      // Fetch recent challenges
      const { data: challenges, error: challengeError } = await this.supabase
        .from('challenges')
        .select('*, challenger:profiles!challenger_id(full_name, display_name, avatar_url)')
        .in('status', ['pending', 'accepted'])
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch active tournaments
      const { data: tournaments, error: tournamentError } = await this.supabase
        .from('tournaments')
        .select('*')
        .in('status', ['registration_open', 'ongoing'])
        .order('created_at', { ascending: false })
        .limit(3);

      // Transform and combine data
      const allPosts: SocialFeedPost[] = [];

      if (matches) {
        allPosts.push(...matches.map(this.transformMatchToPost));
      }

      if (challenges) {
        allPosts.push(...challenges.map(this.transformChallengeToPost));
      }

      if (tournaments) {
        allPosts.push(...tournaments.map(this.transformTournamentToPost));
      }

      // Sort by timestamp
      allPosts.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      // Create stories
      const stories: SocialStoryItem[] = [];
      
      if (tournaments) {
        stories.push(...tournaments.map(this.transformTournamentToStory));
      }

      if (matches) {
        const recentMatches = matches.slice(0, 3);
        stories.push(...recentMatches.map(this.transformMatchToStory));
      }

      return { posts: allPosts, stories };

    } catch (error) {
      console.error('Error fetching social feed:', error);
      return { posts: [], stories: [], error: 'Failed to load social feed' };
    }
  }

  /**
   * Handle social interactions (like, comment, share)
   */
  async handleInteraction(interaction: SocialInteraction): Promise<{ success: boolean; error?: string }> {
    try {
      const { postId, userId, type, content } = interaction;

      switch (type) {
        case 'like':
          return await this.toggleLike(postId, userId);
        case 'comment':
          return await this.addComment(postId, userId, content || '');
        case 'share':
          return await this.sharePost(postId, userId);
        default:
          return { success: false, error: 'Invalid interaction type' };
      }
    } catch (error) {
      console.error('Error handling interaction:', error);
      return { success: false, error: 'Failed to process interaction' };
    }
  }

  /**
   * Subscribe to real-time feed updates
   */
  subscribeToFeedUpdates(onUpdate: (posts: SocialFeedPost[]) => void) {
    const matchesChannel = this.supabase
      .channel('matches-feed')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'matches' },
        () => this.getFeedData().then(data => onUpdate(data.posts))
      )
      .subscribe();

    const challengesChannel = this.supabase
      .channel('challenges-feed')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'challenges' },
        () => this.getFeedData().then(data => onUpdate(data.posts))
      )
      .subscribe();

    const tournamentsChannel = this.supabase
      .channel('tournaments-feed')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'tournaments' },
        () => this.getFeedData().then(data => onUpdate(data.posts))
      )
      .subscribe();

    return () => {
      this.supabase.removeChannel(matchesChannel);
      this.supabase.removeChannel(challengesChannel);
      this.supabase.removeChannel(tournamentsChannel);
    };
  }

  // Private helper methods
  private transformMatchToPost = (match: any): SocialFeedPost => {
    const winner = match.winner_id === match.player1_id ? 
      {
        id: match.player1_id,
        name: match.player1?.full_name || match.player1?.display_name || 'Player 1',
        avatar: match.player1?.avatar_url
      } : 
      {
        id: match.player2_id,
        name: match.player2?.full_name || match.player2?.display_name || 'Player 2',
        avatar: match.player2?.avatar_url
      };

    const loser = match.winner_id === match.player1_id ?
      { name: match.player2?.full_name || match.player2?.display_name || 'Player 2' } :
      { name: match.player1?.full_name || match.player1?.display_name || 'Player 1' };

    return {
      id: `match_${match.id}`,
      type: 'match_result',
      user: {
        id: winner.id,
        name: winner.name,
        avatar: winner.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(winner.name)}&background=random&size=40`,
        rank: 'Expert',
      },
      content: `Vừa thắng ${loser.name} với tỷ số ${match.score_player1 || 0}-${match.score_player2 || 0}! 🎱`,
      timestamp: new Date(match.created_at).toLocaleDateString('vi-VN') + ' ' + 
                new Date(match.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      stats: {
        likes: Math.floor(Math.random() * 20) + 5,
        comments: Math.floor(Math.random() * 10) + 1,
        shares: Math.floor(Math.random() * 5) + 1,
        score: `${match.score_player1 || 0}-${match.score_player2 || 0}`,
        opponent: loser.name,
      },
      isLiked: false,
      raw_data: match,
    };
  };

  private transformChallengeToPost = (challenge: any): SocialFeedPost => {
    const challenger = challenge.challenger || {
      full_name: 'Unknown Player',
      display_name: 'Unknown',
      avatar_url: null,
    };

    return {
      id: `challenge_${challenge.id}`,
      type: 'challenge',
      user: {
        id: challenge.challenger_id,
        name: challenger.display_name || challenger.full_name || 'Unknown',
        avatar: challenger.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(challenger.full_name || 'U')}&background=random&size=40`,
        rank: 'Pro',
      },
      content: `Ai dám nhận thách đấu với tôi không? Đặt cược ${challenge.bet_points || 100} điểm! 🔥`,
      timestamp: new Date(challenge.created_at).toLocaleDateString('vi-VN') + ' ' +
                new Date(challenge.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      stats: {
        likes: Math.floor(Math.random() * 15) + 3,
        comments: Math.floor(Math.random() * 8) + 1,
        shares: Math.floor(Math.random() * 3) + 1,
        challenge_type: `Race to ${challenge.race_to || 5}`,
      },
      isLiked: false,
      raw_data: challenge,
    };
  };

  private transformTournamentToPost = (tournament: any): SocialFeedPost => {
    return {
      id: `tournament_${tournament.id}`,
      type: 'tournament_update',
      user: {
        id: 'system',
        name: 'SABO Arena',
        avatar: `https://ui-avatars.com/api/?name=SABO&background=0ea5e9&color=ffffff&size=40`,
        rank: 'System',
      },
      content: `${tournament.name} đang mở đăng ký! Phí tham gia ${tournament.entry_fee || 50000}đ. Hãy đăng ký ngay! 🎯`,
      timestamp: new Date(tournament.created_at).toLocaleDateString('vi-VN') + ' ' +
                new Date(tournament.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      stats: {
        likes: Math.floor(Math.random() * 30) + 10,
        comments: Math.floor(Math.random() * 15) + 5,
        shares: Math.floor(Math.random() * 8) + 2,
        tournament_name: tournament.name,
      },
      isLiked: false,
      raw_data: tournament,
    };
  };

  private transformTournamentToStory = (tournament: any): SocialStoryItem => {
    return {
      id: `story_tournament_${tournament.id}`,
      user: {
        name: 'SABO',
        avatar: `https://ui-avatars.com/api/?name=SABO&background=0ea5e9&color=ffffff&size=64`,
      },
      type: 'tournament',
      title: tournament.name?.substring(0, 15) + '...' || 'Tournament',
      isLive: tournament.status === 'ongoing',
    };
  };

  private transformMatchToStory = (match: any): SocialStoryItem => {
    const winner = match.winner_id === match.player1_id ? 
      { 
        name: match.player1?.full_name || match.player1?.display_name || 'Player 1',
        avatar: match.player1?.avatar_url 
      } : 
      { 
        name: match.player2?.full_name || match.player2?.display_name || 'Player 2',
        avatar: match.player2?.avatar_url 
      };

    return {
      id: `story_match_${match.id}`,
      user: {
        name: winner.name,
        avatar: winner.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(winner.name)}&background=random&size=64`,
      },
      type: 'achievement',
      title: 'Vừa thắng trận!',
      isLive: false,
    };
  };

  private async toggleLike(postId: string, userId: string): Promise<{ success: boolean; error?: string }> {
    // Implementation for like toggle
    // This would interact with a likes table in the database
    return { success: true };
  }

  private async addComment(postId: string, userId: string, content: string): Promise<{ success: boolean; error?: string }> {
    // Implementation for adding comments
    // This would interact with a comments table in the database
    return { success: true };
  }

  private async sharePost(postId: string, userId: string): Promise<{ success: boolean; error?: string }> {
    // Implementation for sharing posts
    return { success: true };
  }
}

export default SocialFeedService;