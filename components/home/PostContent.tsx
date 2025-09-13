import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface PostContentProps {
  user: string;
  date: string;
  text: string;
  onPress?: () => void;
}

export const PostContent: React.FC<PostContentProps> = ({
  user,
  date,
  text,
  onPress
}) => {
  return (
    <TouchableOpacity style={styles.postContent} onPress={onPress}>
      <Text style={styles.postUser}>{user} · {date}</Text>
      <Text style={styles.postText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  postContent: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
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

export default PostContent;