// constants
import { TaskPriority, TaskStatus } from './constants';

export const getStatusIcon = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.PENDING:
      return '⏳';
    case TaskStatus.RUNNING:
      return '🔄';
    case TaskStatus.COMPLETED:
      return '✅';
    case TaskStatus.FAILED:
      return '❌';
    case TaskStatus.CANCELLED:
      return '🚫';
    default:
      throw new Error(`Invalid status: ${status}`);
  }
};

export const getPriorityIcon = (priority: TaskPriority): string => {
  switch (priority) {
    case TaskPriority.LOW:
      return '🔵';
    case TaskPriority.HIGH:
      return '🔴';
    default:
      throw new Error(`Invalid priority: ${priority}`);
  }
};
