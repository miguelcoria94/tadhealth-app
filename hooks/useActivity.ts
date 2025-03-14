import { useState, useCallback } from 'react';
import { Activity } from '@/types/appointment';
import { Alert } from 'react-native';

export function useActivity(initialActivities: Activity[] = []) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [newComment, setNewComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);

  const handleAddComment = useCallback(async () => {
    if (!newComment.trim()) return;

    setIsAddingComment(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const newActivity: Activity = {
        author: "Dr. Sarah Wilson",  // This would come from auth context in a real app
        comment: newComment,
        timestamp: new Date().toISOString()
      };

      setActivities(prev => [newActivity, ...prev]);
      setNewComment('');
    } catch (error) {
      Alert.alert('Error', 'Failed to add comment. Please try again.');
    } finally {
      setIsAddingComment(false);
    }
  }, [newComment]);

  return {
    activities,
    newComment,
    setNewComment,
    isAddingComment,
    handleAddComment
  };
} 