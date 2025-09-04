// libs
import { useCallback } from 'react';

// types
import { Task } from '../types';

/**
 * Custom hook for managing tasks
 */
export const useTaskManager = () => {
  const tasks: Task[] = [];

  const addTask = useCallback((task: Task) => {
    console.log('TODO: Implement addTask', task);
  }, []);

  const cancelTask = useCallback((taskId: string) => {
    console.log('TODO: Implement cancelTask', taskId);
  }, []);

  const executeTask = useCallback(async (task: Task) => {
    console.log('TODO: Implement executeTask', task);
  }, []);

  return {
    tasks,
    addTask,
    cancelTask,
    executeTask,
  };
};
