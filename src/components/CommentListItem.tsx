import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

import {Comment} from '../utils/types';

type Props = {
  comment: Comment;
};

const CommentListItem = ({comment}: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.value}>{comment.value}</Text>

      <View style={styles.userAndTimestampContainer}>
        <Text style={styles.user}>
          @ {comment.user.name.split(' ').join('_')}
        </Text>

        <Text style={styles.timestamp}>
          | {comment.createdAt.toDate().toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
};

export default CommentListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    rowGap: 5,
  },
  value: {
    color: 'black',
  },
  userAndTimestampContainer: {
    flexDirection: 'row',
    columnGap: 5,
  },
  user: {
    color: 'gray',
  },
  timestamp: {
    color: 'gray',
  },
});
