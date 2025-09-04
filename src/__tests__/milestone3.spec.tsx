// libs
import { render, screen, waitFor, act, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// components
import App from '../App';

// helpers
import { resetTaskCounter } from '../components/taskForm/helpers';
import { addTask, getTasksByStatus } from './utils';

// constants
import { TaskPriority, TaskStatus } from '../constants';

/**
 * Milestone 3: Priority, Cancellation & Failure (25 marks)
 *
 * Handle task priority, failure and cancellation.
 *
 * Requirements:
 * - HIGH_PRIORITY tasks execute before NORMAL tasks.
 * - Implement cancel functionality for PENDING tasks.
 * - Handle task failure.
 */

describe('Milestone 3: Priority, Cancellation & Failure', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    resetTaskCounter();
    jest.useFakeTimers();
    user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    jest.spyOn(Math, 'random');
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
    act(() => jest.advanceTimersByTime(5000));

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual(['Task 1', 'Task 2', 'Task 3']);
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 4', 'Task 6', 'Task 7']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual(['Task 5']);
    });
  });

  test('should handle cancellation of pending tasks', async () => {
    render(<App />);

    for (let i = 0; i < 5; i++) {
      await addTask({ user }); // 3 running, 2 pending
    }

    const taskTable = screen.getByRole('table');

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 1', 'Task 2', 'Task 3']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual(['Task 4', 'Task 5']);
    });

    const cancelButtons = screen.getAllByText('Cancel');
    expect(cancelButtons).toHaveLength(2);

    await user.click(cancelButtons[0]);

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 1', 'Task 2', 'Task 3']);
      expect(getTasksByStatus(TaskStatus.CANCELLED)).toEqual(['Task 4']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual(['Task 5']);
    });
  });

  test('should handle mixed priority queue with cancellations', async () => {
    render(<App />);

    // 4 LOW priority tasks
    for (let i = 0; i < 4; i++) {
      await addTask({ user });
    }

    // 2 HIGH priority tasks
    await addTask({ user, priority: TaskPriority.HIGH });
    await addTask({ user, priority: TaskPriority.HIGH });

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 1', 'Task 2', 'Task 3']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual(['Task 4', 'Task 5', 'Task 6']);
    });

    // Cancel one pending task
    const cancelButtons = screen.getAllByText('Cancel');
    await user.click(cancelButtons[0]);

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.CANCELLED)).toEqual(['Task 4']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual(['Task 5', 'Task 6']);
    });

    // Complete running tasks
    act(() => jest.advanceTimersByTime(5000));

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 1', 'Task 2', 'Task 3']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual(['Task 5', 'Task 6']);
      expect(getTasksByStatus(TaskStatus.CANCELLED)).toEqual(['Task 4']);
    });
  });
});
