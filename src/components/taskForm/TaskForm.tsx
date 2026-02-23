// libs
import { useState, useMemo, useCallback } from 'react';
import Select from 'react-select';

// utils
import { createTask } from './helpers';

// types
import type { Task } from '../../types';

// constants
import { TaskPriority } from '../../constants';
import { TASK_PRIORITY_OPTIONS } from './constants';

type TaskFormProps = {
  tasks: Task[];
  onAddTask: (task: Task) => void;
};

export const TaskForm = ({ tasks, onAddTask }: TaskFormProps) => {
  const [taskPriority, setTaskPriority] = useState(TaskPriority.LOW);

  const selectedPriorityOption = useMemo(
    () => TASK_PRIORITY_OPTIONS.find(opt => opt.value === taskPriority),
    [taskPriority]
  );

  const handleCreateTask = useCallback(() => {
    const task = createTask({ priority: taskPriority });

    // Reset state
    setTaskPriority(TaskPriority.LOW);

    onAddTask(task);
  }, [taskPriority, onAddTask]);

  return (
    <div className="task-creation">
      <h2>Create a New Task</h2>

      {/* Priority Select */}
      <div className="form-group">
        <label htmlFor="task-priority">Task Priority</label>
        <Select
          inputId="task-priority"
          value={selectedPriorityOption}
          options={TASK_PRIORITY_OPTIONS}
          onChange={selected => setTaskPriority(selected!.value)}
          placeholder="Select priority"
          classNamePrefix="select"
        />
      </div>

      <button onClick={handleCreateTask}>Add Task</button>
    </div>
  );
};
