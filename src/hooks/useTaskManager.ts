// libs
import { useCallback } from 'react';

// types
import { Task } from '../types';

// constants
import { TaskPriority, TaskStatus } from '../constants';

export const useTaskManager = ({ concurrencyLimit }: { concurrencyLimit: number }) => {
  const tasks: Task[] = [];

  const addTask = useCallback((task: Task) => {
    console.log('TODO: Implement addTask', task);
  }, []);

  const executeTask = useCallback(async (task: Task) => {
    console.log('TODO: Implement executeTask', task);
  }, []);

  return {
    tasks,
    addTask,
  };
};
