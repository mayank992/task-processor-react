// constants
import { TaskPriority, TaskStatus } from './constants';

export type Task = {
  id: string;
  status: TaskStatus;
  priority: TaskPriority;
  execute: () => Promise<any>;
};
