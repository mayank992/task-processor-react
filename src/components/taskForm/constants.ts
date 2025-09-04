// constants
import { TaskPriority, TASK_PRIORITY_VS_LABEL } from '../../constants';

export const TASK_PRIORITY_OPTIONS = [
  {
    label: TASK_PRIORITY_VS_LABEL[TaskPriority.LOW],
    value: TaskPriority.LOW,
  },
  {
    label: TASK_PRIORITY_VS_LABEL[TaskPriority.HIGH],
    value: TaskPriority.HIGH,
  },
];
