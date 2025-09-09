// libs
import { render, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// components
import App from '../App';

// helpers
import { resetTaskCounter } from '../components/taskForm/helpers';
import { addTask, getTasksByStatus, advance } from './utils';

// constants
import { TaskPriority, TaskStatus } from '../constants';

/**
 * Milestone 3: Priority (25 marks)
 *
 * Handle task priority.
 *
 * Requirements:
 * - HIGH_PRIORITY tasks execute before NORMAL tasks.
 */

describe('Milestone 3: Task Priority', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    resetTaskCounter();
    jest.useFakeTimers();
    user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('should prioritize HIGH tasks over LOW tasks', async () => {
    render(<App />);

    // 3 LOW tasks running, 2 LOW tasks queued
    for (let i = 0; i < 5; i++) {
      await addTask({ user });
    }

    // 2 HIGH priority tasks queued
    await addTask({ user, priority: TaskPriority.HIGH });
    await addTask({ user, priority: TaskPriority.HIGH });

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 1', 'Task 2', 'Task 3']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual(['Task 4', 'Task 5', 'Task 6', 'Task 7']);
    });

    // Complete first batch of running tasks
    advance(5000);

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual(['Task 1', 'Task 2', 'Task 3']);
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 4', 'Task 6', 'Task 7']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual(['Task 5']);
    });
  });
});
