import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Heart, MessageCircle, MessageSquare, Share } from 'lucide-react-native';

interface SocialActionsProps {
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isLiked?: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  style?: any;
}

const formatCount = (count: number) => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

export const SocialActions: React.FC<SocialActionsProps> = ({
  likeCount,
  commentCount,
  shareCount,
  isLiked = false,
  onLike,
  onComment,
  onShare,
  style
}) => {
  return (
    <View style={[styles.socialActions, style]}>
      <TouchableOpacity style={styles.socialAction} onPress={onLike}>
        <Heart 
          size={35} 
          color={isLiked ? "#FF004F" : "white"} 
          fill={isLiked ? "#FF004F" : "transparent"}
        />
        <Text style={styles.socialCount}>{formatCount(likeCount)}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.socialAction} onPress={onComment}>
        <MessageCircle size={35} color="white" />
        <Text style={styles.socialCount}>{commentCount}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.socialAction} onPress={onComment}>
        <MessageSquare size={35} color="white" />
        <Text style={styles.socialCount}>{shareCount}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.socialAction} onPress={onShare}>
        <Share size={35} color="white" />
        <Text style={styles.socialCount}>Share</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  socialActions: {
    position: 'absolute',
    right: 20,
    top: 200,
    alignItems: 'center',
    gap: 20,
  },
  socialAction: {
    alignItems: 'center',
    gap: 4,
  },
  socialCount: {
    color: 'white',
    fontSize: 13,
    fontFamily: 'ABeeZee',
    fontWeight: '400',
    textShadowColor: 'rgba(0, 0, 0, 0.30)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
});