import { useState, useCallback } from 'react';
import { trpc } from '@/lib/trpc';

interface OptimisticAction {
  type: 'like' | 'join' | 'challenge' | 'follow';
  entityId: string;
  previousValue?: any;
  newValue: any;
}

interface UseOptimisticUpdatesOptions {
  onSuccess?: (action: OptimisticAction) => void;
  onError?: (action: OptimisticAction, error: any) => void;
}

export function useOptimisticUpdates(options: UseOptimisticUpdatesOptions = {}) {
  const [pendingActions, setPendingActions] = useState<Map<string, OptimisticAction>>(new Map());
  const [optimisticData, setOptimisticData] = useState<Map<string, any>>(new Map());

  const utils = trpc.useUtils();

  // Generic optimistic update function
  const performOptimisticUpdate = useCallback(async (
    action: OptimisticAction,
    mutationFn: () => Promise<any>
  ) => {
    const actionKey = `${action.type}-${action.entityId}`;
    
    // Add to pending actions
    setPendingActions(prev => new Map(prev).set(actionKey, action));
    
    // Apply optimistic update immediately
    setOptimisticData(prev => new Map(prev).set(actionKey, action.newValue));

    try {
      // Perform the actual mutation
      const result = await mutationFn();
      
      // Remove from pending on success
      setPendingActions(prev => {
        const newMap = new Map(prev);
        newMap.delete(actionKey);
        return newMap;
      });

      // Keep optimistic data or update with server response
      if (result) {
        setOptimisticData(prev => new Map(prev).set(actionKey, result));
      }

      options.onSuccess?.(action);
    } catch (error) {
      // Rollback optimistic update on error
      setPendingActions(prev => {
        const newMap = new Map(prev);
        newMap.delete(actionKey);
        return newMap;
      });

      setOptimisticData(prev => {
        const newMap = new Map(prev);
        if (action.previousValue !== undefined) {
          newMap.set(actionKey, action.previousValue);
        } else {
          newMap.delete(actionKey);
        }
        return newMap;
      });

      options.onError?.(action, error);
      throw error;
    }
  }, [options, utils]);

  // Specific optimistic update functions
  const optimisticLike = useCallback(async (postId: string, currentLiked: boolean, currentCount: number) => {
    const likeMutation = trpc.social.toggleLike.useMutation({
      onSuccess: () => {
        // Invalidate and refetch feed data
        utils.social.getFeed.invalidate();
      }
    });

    const action: OptimisticAction = {
      type: 'like',
      entityId: postId,
      previousValue: { liked: currentLiked, count: currentCount },
      newValue: { liked: !currentLiked, count: currentLiked ? currentCount - 1 : currentCount + 1 }
    };

    return performOptimisticUpdate(action, () => likeMutation.mutateAsync({ postId }));
  }, [performOptimisticUpdate, utils]);

  const optimisticJoinChallenge = useCallback(async (challengeId: string, currentParticipants: number) => {
    const joinMutation = trpc.challenges.join.useMutation({
      onSuccess: () => {
        utils.challenges.list.invalidate();
      }
    });

    const action: OptimisticAction = {
      type: 'join',
      entityId: challengeId,
      previousValue: { participants: currentParticipants, joined: false },
      newValue: { participants: currentParticipants + 1, joined: true }
    };

    return performOptimisticUpdate(action, () => joinMutation.mutateAsync({ challengeId }));
  }, [performOptimisticUpdate, utils]);

  const optimisticJoinTournament = useCallback(async (tournamentId: string, currentParticipants: number) => {
    const joinMutation = trpc.tournaments.join.useMutation({
      onSuccess: () => {
        utils.tournaments.list.invalidate();
      }
    });

    const action: OptimisticAction = {
      type: 'join',
      entityId: tournamentId,
      previousValue: { participants: currentParticipants, joined: false },
      newValue: { participants: currentParticipants + 1, joined: true }
    };

    return performOptimisticUpdate(action, () => joinMutation.mutateAsync({ tournamentId }));
  }, [performOptimisticUpdate, utils]);

  const optimisticFollowUser = useCallback(async (userId: string, currentFollowing: boolean, currentFollowersCount: number) => {
    const followMutation = trpc.users.toggleFollow.useMutation({
      onSuccess: () => {
        utils.users.profile.invalidate();
        utils.social.getFeed.invalidate();
      }
    });

    const action: OptimisticAction = {
      type: 'follow',
      entityId: userId,
      previousValue: { following: currentFollowing, followersCount: currentFollowersCount },
      newValue: { 
        following: !currentFollowing, 
        followersCount: currentFollowing ? currentFollowersCount - 1 : currentFollowersCount + 1 
      }
    };

    return performOptimisticUpdate(action, () => followMutation.mutateAsync({ userId }));
  }, [performOptimisticUpdate, utils]);

  // Helper function to get optimistic value
  const getOptimisticValue = useCallback((type: string, entityId: string, defaultValue?: any) => {
    const actionKey = `${type}-${entityId}`;
    return optimisticData.get(actionKey) ?? defaultValue;
  }, [optimisticData]);

  // Helper function to check if action is pending
  const isPending = useCallback((type: string, entityId: string) => {
    const actionKey = `${type}-${entityId}`;
    return pendingActions.has(actionKey);
  }, [pendingActions]);

  return {
    // Optimistic action functions
    optimisticLike,
    optimisticJoinChallenge,
    optimisticJoinTournament,
    optimisticFollowUser,
    
    // Helper functions
    getOptimisticValue,
    isPending,
    
    // State
    pendingActionsCount: pendingActions.size,
  };
}

// Custom hook for like functionality with optimistic updates
export function useOptimisticLike(postId: string, initialLiked: boolean, initialCount: number) {
  const { optimisticLike, getOptimisticValue, isPending } = useOptimisticUpdates();
  
  const optimisticState = getOptimisticValue('like', postId, { liked: initialLiked, count: initialCount });
  const isLiking = isPending('like', postId);

  const toggleLike = useCallback(async () => {
    try {
      await optimisticLike(postId, optimisticState.liked, optimisticState.count);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  }, [optimisticLike, postId, optimisticState]);

  return {
    liked: optimisticState.liked,
    count: optimisticState.count,
    isLiking,
    toggleLike
  };
}

// Custom hook for join functionality with optimistic updates
export function useOptimisticJoin(entityId: string, entityType: 'challenge' | 'tournament', initialParticipants: number, initialJoined: boolean = false) {
  const { optimisticJoinChallenge, optimisticJoinTournament, getOptimisticValue, isPending } = useOptimisticUpdates();
  
  const optimisticState = getOptimisticValue('join', entityId, { 
    participants: initialParticipants, 
    joined: initialJoined 
  });
  const isJoining = isPending('join', entityId);

  const join = useCallback(async () => {
    if (optimisticState.joined) return; // Already joined
    
    try {
      if (entityType === 'challenge') {
        await optimisticJoinChallenge(entityId, optimisticState.participants);
      } else {
        await optimisticJoinTournament(entityId, optimisticState.participants);
      }
    } catch (error) {
      console.error(`Failed to join ${entityType}:`, error);
    }
  }, [entityType, entityId, optimisticState, optimisticJoinChallenge, optimisticJoinTournament]);

  return {
    participants: optimisticState.participants,
    joined: optimisticState.joined,
    isJoining,
    join
  };
}