// libs
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// components
import App from '../App';

// helpers
import { resetTaskCounter } from '../components/taskForm/helpers';
import { addTask, getTasksByStatus, advance } from './utils';

// constants
import { TaskStatus } from '../constants';

/**
 * MILESTONE 2: Concurrency Control (25 marks)
 *
 * Handle max concurrent tasks.
 *
 * Requirements:
 * - Implement MAX_RUNNING_TASKS = 3 limit
 * - Queue tasks when all slots are occupied
 * - Automatically start queued tasks when slots become available
 * - Maintain proper status transitions
 */

describe('Milestone 2: Concurrency Control', () => {
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

  test('handles concurrency with tasks added in multiple waves', async () => {
    render(<App />);

    // Wave 1: Add 4 tasks → 3 running, 1 pending
    for (let i = 0; i < 4; i++) await addTask({ user });

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 1', 'Task 2', 'Task 3']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual(['Task 4']);
    });

    // Wave 2: Add 3 more while first ones are still running
    for (let i = 0; i < 3; i++) await addTask({ user });

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual(['Task 4', 'Task 5', 'Task 6', 'Task 7']);
    });

    // Step 1: First batch finishes → slots free → 3 tasks promoted
    advance(5000);

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual(['Task 1', 'Task 2', 'Task 3']);
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 4', 'Task 5', 'Task 6']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual(['Task 7']);
    });

    // Step 2: Second batch finishes → pending promoted
    advance(5000);

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual([
        'Task 1',
        'Task 2',
        'Task 3',
        'Task 4',
        'Task 5',
        'Task 6',
      ]);
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 7']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual([]);
    });

    // Step 3: Last task finishes
    advance(5000);

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual([
        'Task 1',
        'Task 2',
        'Task 3',
        'Task 4',
        'Task 5',
        'Task 6',
        'Task 7',
      ]);
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual([]);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual([]);
    });
  });
});
