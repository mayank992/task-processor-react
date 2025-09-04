// libs
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// components
import App from '../App';

// helpers
import { resetTaskCounter } from '../components/taskForm/helpers';
import { addTask, getTasksByStatus } from './utils';

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
    jest.spyOn(Math, 'random');
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('should enforce MAX_RUNNING_TASKS = 3 limit and queue extra tasks', async () => {
    render(<App />);

    // Create 5 tasks: first 3 running, last 2 pending
    for (let i = 0; i < 5; i++) {
      await addTask({ user });
    }

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 1', 'Task 2', 'Task 3']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual(['Task 4', 'Task 5']);
    });
  });

  test('should automatically start queued tasks when running tasks complete', async () => {
    render(<App />);

    for (let i = 0; i < 5; i++) await addTask({ user });

    // Complete first batch (Tasks 1,2,3)
    act(() => jest.advanceTimersByTime(5000));

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual(['Task 1', 'Task 2', 'Task 3']);
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 4', 'Task 5']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual([]);
    });

    // Complete remaining
    act(() => jest.advanceTimersByTime(5000));

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual(['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5']);
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual([]);
    });
  });

  test('should handle edge case of single task queued and completed', async () => {
    render(<App />);

    // Create 4 tasks: 3 running, 1 pending
    for (let i = 0; i < 4; i++) await addTask({ user });

    // Complete first 3
    act(() => jest.advanceTimersByTime(5000));

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual(['Task 1', 'Task 2', 'Task 3']);
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 4']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual([]);
    });

    // Complete last one
    act(() => jest.advanceTimersByTime(5000));

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual(['Task 1', 'Task 2', 'Task 3', 'Task 4']);
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual([]);
    });
  });

  test('should handle a failed task and maintain queue execution', async () => {
    render(<App />);

    // Create 4 tasks: fail Task 2
    await addTask({ user }); // Task 1
    await addTask({ user, fail: true }); // Task 2
    await addTask({ user }); // Task 3
    await addTask({ user }); // Task 4 queued

    // Complete first batch
    act(() => jest.advanceTimersByTime(5000));

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual(['Task 1', 'Task 3']);
      expect(getTasksByStatus(TaskStatus.FAILED)).toEqual(['Task 2']);
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 4']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual([]);
    });

    // Complete last task
    act(() => jest.advanceTimersByTime(5000));

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual(['Task 1', 'Task 3', 'Task 4']);
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual([]);
    });
  });
});
