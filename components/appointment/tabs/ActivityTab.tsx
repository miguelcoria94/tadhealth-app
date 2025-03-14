import React from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  Pressable,
  ScrollView
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { useActivity } from '@/hooks/useActivity';
import { Activity } from '@/types/appointment';
import { formatDate } from '@/utils/formatters';

interface ActivityTabProps {
  initialActivities?: Activity[];
}

export function ActivityTab({ initialActivities = [] }: ActivityTabProps) {
  const { 
    activities, 
    newComment, 
    setNewComment, 
    isAddingComment, 
    handleAddComment 
  } = useActivity(initialActivities);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}
    >
      {/* Add Comment */}
      <ThemedView variant="elevated" style={styles.addCommentCard}>
        <ThemedText type="subtitle">Add Comment</ThemedText>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          placeholderTextColor={Colors.light.textGray[300]}
          value={newComment}
          onChangeText={setNewComment}
          multiline
          numberOfLines={4}
        />
        <Pressable 
          style={[
            styles.saveButton,
            !newComment.trim() && styles.disabledButton
          ]}
          onPress={handleAddComment}
          disabled={!newComment.trim() || isAddingComment}
        >
          {isAddingComment ? (
            <ActivityIndicator color={Colors.light.background} />
          ) : (
            <>
              <Feather name="save" size={20} color={Colors.light.background} />
              <ThemedText style={styles.buttonText}>Save</ThemedText>
            </>
          )}
        </Pressable>
      </ThemedView>

      {/* Activity/Comments List */}
      <ScrollView>
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <ThemedView key={index} variant="elevated" style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <ThemedText type="subtitle">{activity.author}</ThemedText>
                <ThemedText style={styles.activityDate}>
                  {formatDate(activity.timestamp)} {new Date(activity.timestamp).toLocaleTimeString()}
                </ThemedText>
              </View>
              <ThemedText style={styles.activityComment}>{activity.comment}</ThemedText>
            </ThemedView>
          ))
        ) : (
          <ThemedView variant="elevated" style={styles.emptyStateCard}>
            <ThemedText style={styles.emptyStateText}>No activity recorded yet.</ThemedText>
          </ThemedView>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  addCommentCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  commentInput: {
    backgroundColor: Colors.light.textGray[500] + '10',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    marginVertical: 12,
    fontSize: 16,
    color: Colors.light.textGray[100],
  },
  saveButton: {
    backgroundColor: Colors.light.green[200],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
  },
  activityCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityDate: {
    fontSize: 12,
    color: Colors.light.textGray[300],
  },
  activityComment: {
    fontSize: 16,
    color: Colors.light.textGray[100],
    lineHeight: 22,
  },
  emptyStateCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  emptyStateText: {
    color: Colors.light.textGray[300],
    padding: 16,
    fontSize: 16,
    textAlign: 'center',
  },
}); 