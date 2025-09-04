// libs
import { useState, useMemo, useCallback } from 'react';
import Select from 'react-select';

// utils
import { createTask, getDependencyOptions } from './helpers';

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
  const [selectedDepsIds, setSelectedDepsIds] = useState<string[]>([]);

  const dependencyOptions = useMemo(() => getDependencyOptions(tasks), [tasks]);

  const selectedPriorityOption = useMemo(
    () => TASK_PRIORITY_OPTIONS.find(opt => opt.value === taskPriority),
    [taskPriority]
  );

  const selectedDeps = useMemo(
    () => selectedDepsIds.map(depId => dependencyOptions.find(opt => opt.value === depId)).filter(Boolean),
    [selectedDepsIds, dependencyOptions]
  );

  const handleCreateTask = useCallback(() => {
    const task = createTask({
      priority: taskPriority,
      dependencies: selectedDepsIds,
    });

    // Reset state
    setTaskPriority(TaskPriority.LOW);
    setSelectedDepsIds([]);

    onAddTask(task);
  }, [taskPriority, selectedDepsIds, onAddTask]);

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

      {/* Dependencies Select */}
      <div className="form-group">
        <label htmlFor="task-dependencies">Task Dependencies</label>
        <Select
          inputId="task-dependencies"
          isMulti
          options={dependencyOptions}
          value={selectedDeps}
          onChange={deps => setSelectedDepsIds(deps.map(dep => dep!.value))}
          placeholder="Select dependencies"
          noOptionsMessage={() => (dependencyOptions.length === 0 ? 'No tasks available to select' : 'Type to search')}
          classNamePrefix="select"
        />
      </div>

      <button onClick={handleCreateTask}>Add Task</button>
    </div>
  );
};
