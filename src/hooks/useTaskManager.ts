// libs
import { useState, useCallback, useEffect } from 'react';

// types
import { Task } from '../types';

// constants
import { TaskPriority, TaskStatus } from '../constants';

export const useTaskManager = ({ concurrencyLimit }: { concurrencyLimit?: number }) => {
  const limit = concurrencyLimit ?? Infinity;

  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = useCallback((task: Task) => setTasks(currentTasks => [...currentTasks, task]), []);

  const updateTaskStatus = useCallback((taskId: string, status: TaskStatus) => {
    setTasks(tasks => tasks.map(task => (task.id === taskId ? { ...task, status } : task)));
  }, []);

  const executeTask = useCallback(
    async (task: Task) => {
      if (task.status === TaskStatus.RUNNING) return;

      // Set task to running
      updateTaskStatus(task.id, TaskStatus.RUNNING);

      await task.execute();

      // Set task to completed
      updateTaskStatus(task.id, TaskStatus.COMPLETED);
    },
    [updateTaskStatus]
  );

  useEffect(() => {
    // Count currently running tasks
    const runningTasks = tasks.filter(task => task.status === TaskStatus.RUNNING);
    const runningCount = runningTasks.length;

    // Respect concurrency limit
    if (runningCount >= limit) {
      return;
    }

    // Get tasks eligible for execution
    const eligibleTasks = tasks.filter(task => task.status === TaskStatus.PENDING);

    if (eligibleTasks.length === 0) return;

    // Sort by priority (HIGH first, then by creation time)
    const sortedTasks = eligibleTasks.sort((a, b) => {
      // High priority tasks first
      if (a.priority === TaskPriority.HIGH && b.priority === TaskPriority.LOW) return -1;
      if (a.priority === TaskPriority.LOW && b.priority === TaskPriority.HIGH) return 1;
      return 0;
    });

    // Execute tasks up to the concurrency limit
    const tasksToExecute = sortedTasks.slice(0, limit - runningCount);

    // Execute tasks (fire and forget - don't await to allow concurrent execution)
    tasksToExecute.forEach(executeTask);
  }, [tasks, executeTask, limit]);

  return {
    tasks,
    addTask,
  };
};
