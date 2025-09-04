// libs
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// constants
import { TaskPriority, TaskStatus, TASK_PRIORITY_VS_LABEL, TASK_STATUS_VS_LABEL } from '../constants';

const selectPriority = async (user: ReturnType<typeof userEvent.setup>, priority: TaskPriority) => {
  // Open dropdown
  const prioritySelect = screen.getByLabelText('Task Priority');
  await user.click(prioritySelect);

  // Query the option within the React Select menu
  const option = within(screen.getByRole('listbox')).getByText(TASK_PRIORITY_VS_LABEL[priority]);
  await user.click(option);
};

export const addTask = async ({
  user,
  fail,
  dependencies,
  priority = TaskPriority.LOW,
}: {
  fail?: boolean;
  priority?: TaskPriority;
  dependencies?: string[];
  user: ReturnType<typeof userEvent.setup>;
}) => {
  // select priority
  await selectPriority(user, priority);

  // mock failure chance
  (Math.random as jest.Mock).mockReturnValueOnce(fail ? 0.95 : 0.5);

  // Select dependencies if any
  if (dependencies?.length) {
    for (const dep of dependencies) {
      const dependencySelect = screen.getByLabelText('Task Dependencies');
      await user.click(dependencySelect);

      const depOption = within(screen.getByRole('listbox')).getByText(new RegExp(dep, 'i'));
      await user.click(depOption);
    }
  }

  // click add task button
  await user.click(screen.getByText('Add Task'));
};

/**
 * Extracts the names of tasks currently in status state
 */
export const getTasksByStatus = (status: TaskStatus) => {
  const taskTable = screen.getByRole('table');
  const tasksByStatus = within(taskTable).queryAllByText(new RegExp(TASK_STATUS_VS_LABEL[status], 'i'));

  return tasksByStatus.map(cell => {
    const row = cell.closest('tr'); // get the row
    return row?.querySelector('.task-id')?.textContent?.trim() || '';
  });
};
