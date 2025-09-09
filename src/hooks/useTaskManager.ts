// libs
import { useCallback } from 'react';

// types
import { Task } from '../types';

// constants
import { TaskPriority, TaskStatus, MAX_RUNNING_TASKS } from '../constants';

export const useTaskManager = () => {
  const tasks: Task[] = [];

  const addTask = useCallback((task: Task) => {
    console.log('TODO: Implement addTask', task);
  }, []);

  return {
    tasks,
    addTask,
  };
};
