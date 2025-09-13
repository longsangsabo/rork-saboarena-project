import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PostContentProps {
  username: string;
  date: string;
  content: string;
  onPress?: () => void;
  style?: any;
}

export const PostContent: React.FC<PostContentProps> = ({
  username,
  date,
  content,
  onPress,
  style
}) => {
  return (
    <TouchableOpacity style={[styles.postContent, style]} onPress={onPress}>
      <Text style={styles.postUser}>{username} · {date}</Text>
      <Text style={styles.postText}>{content}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  postContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  postUser: {
    color: 'white',
    fontSize: 17,
    fontFamily: 'ABeeZee',
    fontWeight: '400',
    marginBottom: 4,
  },
  postText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'ABeeZee',
    fontWeight: '400',
    lineHeight: 19.5,
  },
});