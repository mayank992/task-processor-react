// constants
import { TaskPriority, TaskStatus } from './constants';

export type Task = {
  id: string;
  status: TaskStatus;
  priority: TaskPriority;
  dependencies: string[];
  execute: () => Promise<any>;
};
