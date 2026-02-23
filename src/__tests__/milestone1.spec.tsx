// libs
import { render, screen, waitFor } from '@testing-library/react';
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
 * MILESTONE 1: Basic Task Management (25 marks)
 *
 * Task state and immediate execution (no concurrency limit).
 *
 * Requirements:
 * Store created tasks in state.
 * - Execute each created task with `task.execute()`.
 * - Update status: PENDING → RUNNING → COMPLETED.
 * - No concurrency limit: every new task starts immediately.
 */

describe('Milestone 1: Basic Task Management', () => {
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

  test('handles lifecycle and multiple waves of task creation', async () => {
    render(<App />);

    // Wave 1: add 2 tasks - should start immediately since no concurrency limit yet
    await addTask({ user });
    await addTask({ user });

    // Both tasks should transition from PENDING to RUNNING immediately
    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 1', 'Task 2']);
    });

    // Wave 2: add 1 more while others are still running - should also start immediately
    await addTask({ user });
    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 1', 'Task 2', 'Task 3']);
    });

    // Advance time by 5 seconds to complete all running tasks
    advance(5000);

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual(['Task 1', 'Task 2', 'Task 3']);
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual([]);
    });

    // Wave 3: add 2 more after previous batch completed - should start immediately
    await addTask({ user });
    await addTask({ user });

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 4', 'Task 5']);
    });

    // Complete the final batch
    advance(5000);

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual(['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5']);
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual([]);
    });
  });
});
