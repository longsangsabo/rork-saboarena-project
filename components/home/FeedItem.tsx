import React from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { Heart, Clock, Share, MessageCircle, Users } from 'lucide-react-native';
import { useTheme } from '@/providers/ThemeProvider';
import { RankBadge } from '@/components/shared';
import { useOptimisticLike, useOptimisticJoin } from '@/hooks/useOptimisticUpdates';

interface FeedItemProps {
  item: {
    id: string;
    user: {
      id: string;
      name: string;
      avatar: string;
      rank: string;
    };
    content: {
      text: string;
      backgroundImage: string;
      timestamp: string;
    };
    stats: {
      playNow: number;
      schedule: number;
      shares: number;
      likes?: number;
      liked?: boolean;
    };
    club: {
      name: string;
      location: string;
      avatar: string;
      members: number;
    };
  };
  screenHeight: number;
  formatCount: (count: number) => string;
}

export function FeedItem({ item, screenHeight, formatCount }: FeedItemProps) {
  const theme = useTheme();
  
  // Optimistic like functionality
  const { liked, count: likeCount, isLiking, toggleLike } = useOptimisticLike(
    item.id,
    item.stats.liked || false,
    item.stats.likes || Math.floor(Math.random() * 1000) // Random likes for demo
  );

  // Optimistic join functionality for "Lên xe ngay" action
  const { participants, joined, isJoining, join } = useOptimisticJoin(
    item.id,
    'challenge', // Treat play now as a challenge
    item.stats.playNow,
    false
  );

  return (
    <View key={item.id} style={{ height: screenHeight }}>
      <ImageBackground 
        source={{ uri: item.content.backgroundImage }}
        style={{ flex: 1 }}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          padding: 20,
          justifyContent: 'space-between'
        }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Image
              source={{ uri: item.user.avatar }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                  {item.user.name}
                </Text>
                <RankBadge rank={item.user.rank} size="sm" />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                  {item.club.name} • {item.club.location}
                </Text>
                <Clock size={12} color="rgba(255,255,255,0.8)" />
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                  {item.content.timestamp}
                </Text>
              </View>
            </View>
          </View>

          {/* Content */}
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{
              color: 'white',
              fontSize: 16,
              textAlign: 'center',
              lineHeight: 24
            }}>
              {item.content.text}
            </Text>
          </View>

          {/* Actions & Stats */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            {/* Left side - Club info */}
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Image
                  source={{ uri: item.club.avatar }}
                  style={{ width: 32, height: 32, borderRadius: 16 }}
                />
                <View>
                  <Text style={{ color: 'white', fontSize: 12, fontWeight: '500' }}>
                    {item.club.name}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Users size={10} color="rgba(255,255,255,0.8)" />
                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10 }}>
                      {item.club.members} thành viên
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Right side - Action buttons */}
            <View style={{ alignItems: 'center', gap: 16 }}>
              {/* Like button with optimistic updates */}
              <TouchableOpacity 
                style={{ alignItems: 'center' }}
                onPress={toggleLike}
                disabled={isLiking}
              >
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: isLiking ? 0.7 : 1
                }}>
                  <Heart 
                    size={24} 
                    color={liked ? "#ef4444" : "white"} 
                    fill={liked ? "#ef4444" : "none"}
                  />
                </View>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 11, textAlign: 'center' }}>
                  {formatCount(likeCount)}
                </Text>
              </TouchableOpacity>

              {/* Play Now button with optimistic updates */}
              <TouchableOpacity 
                style={{ alignItems: 'center' }}
                onPress={join}
                disabled={isJoining || joined}
              >
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: joined ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255,255,255,0.2)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: isJoining ? 0.7 : 1
                }}>
                  <Users size={24} color={joined ? "#22c55e" : "white"} />
                </View>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 11, textAlign: 'center' }}>
                  {joined ? 'Đã tham gia' : 'Lên xe'}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 11, textAlign: 'center' }}>
                  {formatCount(participants)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={{ alignItems: 'center' }}>
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Clock size={24} color="white" />
                </View>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 11, textAlign: 'center' }}>
                  Hẹn giờ
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 11, textAlign: 'center' }}>
                  {formatCount(item.stats.schedule)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={{ alignItems: 'center' }}>
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Share size={24} color="white" />
                </View>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 11, textAlign: 'center' }}>
                  Chia sẻ
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 11, textAlign: 'center' }}>
                  {formatCount(item.stats.shares)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={{ alignItems: 'center' }}>
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <MessageCircle size={24} color="white" />
                </View>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 11, textAlign: 'center' }}>
                  Nhắn tin
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}