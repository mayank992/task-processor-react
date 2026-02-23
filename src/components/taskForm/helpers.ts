// types
import type { Task } from '../../types';

// constants
import { TaskStatus, TaskPriority } from '../../constants';

let taskId = 1;

// Reset task ID counter (useful for tests)
export const resetTaskCounter = () => {
  taskId = 1;
};

const execute = () => {
  return new Promise(resolve => {
    const executionTime = 5000; // 5 seconds

    setTimeout(() => resolve(undefined), executionTime);
  });
};

export const createTask = ({ priority }: { priority: TaskPriority }): Task => ({
  id: `Task ${taskId++}`,
  priority,
  status: TaskStatus.PENDING,
  execute,
});
