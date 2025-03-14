// Utility functions for formatting data

/**
 * Format a date string to a readable format
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format a time string to a readable format
 */
export const formatTime = (timeString: string): string => {
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
};

/**
 * Get color for priority level
 */
export const getPriorityColor = (priority: string, colors: any) => {
  switch (priority.toLowerCase()) {
    case 'high': return colors.light.pink[100];
    case 'medium': return colors.light.orange[100];
    case 'low': return colors.light.mint[100];
    default: return colors.light.textGray[300];
  }
};

/**
 * Get color for status
 */
export const getStatusColor = (status: string, colors: any) => {
  switch (status.toLowerCase()) {
    case 'completed': return colors.light.success;
    case 'pending': return colors.light.warning;
    case 'missed': return colors.light.pink[100];
    default: return colors.light.textGray[300];
  }
}; 