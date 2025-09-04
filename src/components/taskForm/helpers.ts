// types
import type { Task } from '../../types';

// constants
import { TaskStatus, TaskPriority, TASK_PRIORITY_VS_LABEL } from '../../constants';

let taskId = 1;

// Reset task ID counter (useful for tests)
export const resetTaskCounter = () => {
  taskId = 1;
};

const execute = () => {
  return new Promise((resolve, reject) => {
    const executionTime = 5000; // 5 seconds

    setTimeout(() => {
      // Simulate some tasks failing (10% failure rate)
      if (Math.random() > 0.9) {
        reject(new Error('Task execution failed'));
      } else {
        resolve(undefined);
      }
    }, executionTime);
  });
};

export const createTask = ({ priority, dependencies }: { priority: TaskPriority; dependencies: string[] }): Task => ({
  id: `Task ${taskId++}`,
  priority,
  dependencies,
  status: TaskStatus.PENDING,
  execute,
});

export const getDependencyOptions = (tasks: Task[]) =>
  tasks
    .filter(task => task.status === TaskStatus.PENDING || task.status === TaskStatus.RUNNING)
    .map(task => ({ value: task.id, label: task.id }));
