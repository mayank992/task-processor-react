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
 * MILESTONE 3: Concurrency Limit > 1 (25 marks)
 *
 * Allow multiple tasks to run at once.
 *
 * Requirements:
 * - Queue tasks when all slots are occupied
 * - When a slot frees up, start the next task from the queue
 * - Maintain proper status transitions
 */

describe('Milestone 3: Concurrency Limit > 1', () => {
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
    render(<App concurrencyLimit={3} />);

    // Wave 1: Add 4 tasks → only first 3 can run due to concurrency limit = 3
    for (let i = 0; i < 4; i++) await addTask({ user });

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 1', 'Task 2', 'Task 3']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual(['Task 4']); // Task 4 queued
    });

    // Wave 2: Add 3 more while first ones are still running → all go to queue
    for (let i = 0; i < 3; i++) await addTask({ user });

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual(['Task 4', 'Task 5', 'Task 6', 'Task 7']);
    });

    // Step 1: First batch finishes → 3 slots become available → next 3 tasks promoted
    advance(5000);

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual(['Task 1', 'Task 2', 'Task 3']);
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 4', 'Task 5', 'Task 6']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual(['Task 7']); // Only Task 7 remains queued
    });

    // Step 2: Second batch finishes → last pending task promoted
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
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual([]); // Queue is empty
    });

    // Step 3: Last task finishes → all tasks completed
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
