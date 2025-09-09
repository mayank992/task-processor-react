export const MAX_RUNNING_TASKS = 3;

export enum TaskPriority {
  LOW = 'LOW',
  HIGH = 'HIGH',
}

export enum TaskStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
}

export const TASK_PRIORITY_VS_LABEL: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: 'Low',
  [TaskPriority.HIGH]: 'High',
};

export const TASK_STATUS_VS_LABEL: Record<TaskStatus, string> = {
  [TaskStatus.PENDING]: 'Pending',
  [TaskStatus.RUNNING]: 'Running',
  [TaskStatus.COMPLETED]: 'Completed',
};
