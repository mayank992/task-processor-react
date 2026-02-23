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
 * MILESTONE 2: Concurrency Limit = 1 (25 marks)
 *
 * Only one task may run at a time.
 *
 * Requirements:
 * - Queue tasks when one is already running
 * - When the running task completes, start the next from the queue
 * - Maintain proper status transitions
 */

describe('Milestone 2: Concurrency Limit = 1', () => {
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

  test('only one task runs at a time; others queue and start when slot frees', async () => {
    render(<App concurrencyLimit={1} />);

    // Add 3 tasks → only 1 can run (limit = 1)
    await addTask({ user });
    await addTask({ user });
    await addTask({ user });

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 1']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual(['Task 2', 'Task 3']);
    });

    // Complete Task 1 → Task 2 should start (still only 1 running)
    advance(5000);

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual(['Task 1']);
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 2']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual(['Task 3']);
    });

    // Complete Task 2 → Task 3 should start
    advance(5000);

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual(['Task 1', 'Task 2']);
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 3']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual([]);
    });

    // Complete Task 3 → all done
    advance(5000);

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual(['Task 1', 'Task 2', 'Task 3']);
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual([]);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual([]);
    });
  });
});
