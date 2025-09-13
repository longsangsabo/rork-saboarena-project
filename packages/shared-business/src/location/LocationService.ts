import { SupabaseClient } from '@supabase/supabase-js';

export interface ClubLocation {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distance?: number; // in kilometers
  stats: {
    members: number;
    tournaments: number;
    prize_pool: number;
    challenges: number;
  };
  images: string[];
  facilities: string[];
  operating_hours: {
    open: string;
    close: string;
    is_24h: boolean;
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  rating: number;
  reviews_count: number;
}

export interface LocationSearchFilters {
  radius?: number; // in kilometers
  max_distance?: number;
  min_rating?: number;
  has_tournaments?: boolean;
  operating_now?: boolean;
  facilities?: string[];
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  accuracy?: number;
}

/**
 * SABO Arena Location Service
 * 
 * Manages location-based features for club discovery and nearby services
 * Based on mobile UI requirements from screenshots
 */
export class LocationService {
  private supabase: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  /**
   * Find clubs near user location
   */
  async findNearbyClubs(
    userLocation: UserLocation,
    filters?: LocationSearchFilters
  ): Promise<{
    data: ClubLocation[];
    error?: string;
  }> {
    try {
      const radius = filters?.radius || 50; // Default 50km radius

      // Use PostGIS function to find nearby clubs
      const { data: clubs, error } = await this.supabase
        .rpc('find_nearby_clubs', {
          user_lat: userLocation.latitude,
          user_lng: userLocation.longitude,
          search_radius: radius * 1000, // Convert to meters
        });

      if (error) throw error;

      // Get club stats
      const clubIds = clubs?.map(club => club.id) || [];
      const clubStats = await this.getClubsStats(clubIds);

      // Transform and enrich data
      const enrichedClubs: ClubLocation[] = (clubs || []).map(club => {
        const stats = clubStats[club.id] || {
          members: 0,
          tournaments: 0,
          prize_pool: 0,
          challenges: 0,
        };

        return {
          id: club.id,
          name: club.name || 'SABO Billiards',
          address: club.address || '601A Nguyễn An Ninh - TP Vũng Tàu',
          coordinates: {
            latitude: club.latitude || 0,
            longitude: club.longitude || 0,
          },
          distance: club.distance_km || 0,
          stats,
          images: club.images || ['/api/placeholder/400/300'],
          facilities: club.facilities || ['8-Ball Table', '9-Ball Table', 'Air Conditioning', 'Parking'],
          operating_hours: {
            open: club.open_time || '08:00',
            close: club.close_time || '23:00',
            is_24h: club.is_24h || false,
          },
          contact: {
            phone: club.phone,
            email: club.email,
            website: club.website,
          },
          rating: club.rating || 4.5,
          reviews_count: club.reviews_count || 0,
        };
      });

      // Apply additional filters
      let filteredClubs = enrichedClubs;

      if (filters?.max_distance) {
        filteredClubs = filteredClubs.filter(club => 
          (club.distance || 0) <= filters.max_distance!
        );
      }

      if (filters?.min_rating) {
        filteredClubs = filteredClubs.filter(club => 
          club.rating >= filters.min_rating!
        );
      }

      if (filters?.has_tournaments) {
        filteredClubs = filteredClubs.filter(club => 
          club.stats.tournaments > 0
        );
      }

      if (filters?.operating_now) {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        filteredClubs = filteredClubs.filter(club => {
          if (club.operating_hours.is_24h) return true;
          
          const openTime = this.parseTimeToMinutes(club.operating_hours.open);
          const closeTime = this.parseTimeToMinutes(club.operating_hours.close);
          
          return currentTime >= openTime && currentTime <= closeTime;
        });
      }

      // Sort by distance
      filteredClubs.sort((a, b) => (a.distance || 0) - (b.distance || 0));

      return { data: filteredClubs };

    } catch (error) {
      console.error('Error finding nearby clubs:', error);
      return { data: [], error: 'Failed to find nearby clubs' };
    }
  }

  /**
   * Get detailed club information
   */
  async getClubDetails(clubId: string): Promise<{
    data: ClubLocation | null;
    error?: string;
  }> {
    try {
      const { data: club, error } = await this.supabase
        .from('clubs')
        .select('*')
        .eq('id', clubId)
        .single();

      if (error) throw error;
      if (!club) return { data: null, error: 'Club not found' };

      // Get club stats
      const stats = await this.getClubStats(clubId);

      const clubLocation: ClubLocation = {
        id: club.id,
        name: club.name,
        address: club.address,
        coordinates: {
          latitude: club.latitude || 0,
          longitude: club.longitude || 0,
        },
        stats,
        images: club.images || [],
        facilities: club.facilities || [],
        operating_hours: {
          open: club.open_time || '08:00',
          close: club.close_time || '23:00',
          is_24h: club.is_24h || false,
        },
        contact: {
          phone: club.phone,
          email: club.email,
          website: club.website,
        },
        rating: club.rating || 0,
        reviews_count: club.reviews_count || 0,
      };

      return { data: clubLocation };

    } catch (error) {
      console.error('Error fetching club details:', error);
      return { data: null, error: 'Failed to load club details' };
    }
  }

  /**
   * Search clubs by name or location
   */
  async searchClubs(
    query: string,
    userLocation?: UserLocation,
    filters?: LocationSearchFilters
  ): Promise<{
    data: ClubLocation[];
    error?: string;
  }> {
    try {
      let searchQuery = this.supabase
        .from('clubs')
        .select('*')
        .or(`name.ilike.%${query}%,address.ilike.%${query}%,city.ilike.%${query}%`);

      const { data: clubs, error } = await searchQuery;

      if (error) throw error;

      // If user location provided, calculate distances
      let enrichedClubs = clubs || [];
      
      if (userLocation) {
        enrichedClubs = enrichedClubs.map(club => ({
          ...club,
          distance: this.calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            club.latitude || 0,
            club.longitude || 0
          ),
        }));

        // Sort by distance
        enrichedClubs.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      }

      // Get stats for all clubs
      const clubIds = enrichedClubs.map(club => club.id);
      const clubStats = await this.getClubsStats(clubIds);

      // Transform to ClubLocation format
      const clubLocations: ClubLocation[] = enrichedClubs.map(club => {
        const stats = clubStats[club.id] || {
          members: 0,
          tournaments: 0,
          prize_pool: 0,
          challenges: 0,
        };

        return {
          id: club.id,
          name: club.name,
          address: club.address,
          coordinates: {
            latitude: club.latitude || 0,
            longitude: club.longitude || 0,
          },
          distance: club.distance,
          stats,
          images: club.images || [],
          facilities: club.facilities || [],
          operating_hours: {
            open: club.open_time || '08:00',
            close: club.close_time || '23:00',
            is_24h: club.is_24h || false,
          },
          contact: {
            phone: club.phone,
            email: club.email,
            website: club.website,
          },
          rating: club.rating || 0,
          reviews_count: club.reviews_count || 0,
        };
      });

      return { data: clubLocations };

    } catch (error) {
      console.error('Error searching clubs:', error);
      return { data: [], error: 'Failed to search clubs' };
    }
  }

  /**
   * Join a club
   */
  async joinClub(clubId: string, userId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Check if already a member
      const { data: existingMembership } = await this.supabase
        .from('club_members')
        .select('id')
        .eq('club_id', clubId)
        .eq('user_id', userId)
        .single();

      if (existingMembership) {
        return { success: false, error: 'Already a member of this club' };
      }

      // Join club
      const { error } = await this.supabase
        .from('club_members')
        .insert({
          club_id: clubId,
          user_id: userId,
          joined_at: new Date().toISOString(),
          status: 'active',
        });

      if (error) throw error;

      return { success: true };

    } catch (error) {
      console.error('Error joining club:', error);
      return { success: false, error: 'Failed to join club' };
    }
  }

  /**
   * Get user's current location (to be used with device GPS)
   */
  async getCurrentLocation(): Promise<{
    data: UserLocation | null;
    error?: string;
  }> {
    try {
      // This would typically be called from the mobile app
      // with device location services
      return {
        data: null,
        error: 'Location service must be implemented in mobile app',
      };
    } catch (error) {
      return {
        data: null,
        error: 'Failed to get current location',
      };
    }
  }

  // Private helper methods
  private async getClubStats(clubId: string) {
    // Get members count
    const { count: membersCount } = await this.supabase
      .from('club_members')
      .select('*', { count: 'exact', head: true })
      .eq('club_id', clubId)
      .eq('status', 'active');

    // Get tournaments count
    const { count: tournamentsCount } = await this.supabase
      .from('tournaments')
      .select('*', { count: 'exact', head: true })
      .eq('club_id', clubId);

    // Get total prize pool
    const { data: tournaments } = await this.supabase
      .from('tournaments')
      .select('prize_pool')
      .eq('club_id', clubId);

    const totalPrizePool = tournaments?.reduce((sum, t) => sum + (t.prize_pool || 0), 0) || 0;

    // Get challenges count
    const { count: challengesCount } = await this.supabase
      .from('challenges')
      .select('*', { count: 'exact', head: true })
      .eq('club_id', clubId);

    return {
      members: membersCount || 0,
      tournaments: tournamentsCount || 0,
      prize_pool: totalPrizePool,
      challenges: challengesCount || 0,
    };
  }

  private async getClubsStats(clubIds: string[]) {
    const stats: Record<string, any> = {};

    for (const clubId of clubIds) {
      stats[clubId] = await this.getClubStats(clubId);
    }

    return stats;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private parseTimeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }
}

export default LocationService;