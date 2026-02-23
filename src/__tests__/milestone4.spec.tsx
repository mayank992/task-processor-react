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
import { TaskPriority, TaskStatus } from '../constants';

/**
 * MILESTONE 4: Priority (25 marks)
 *
 * Respect task priority when scheduling from the queue.
 *
 * Requirements:
 * - HIGH priority tasks execute before LOW priority tasks.
 * - When multiple tasks are queued, HIGH priority tasks should be promoted first.
 */

describe('Milestone 4: Task Priority', () => {
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
    render(<App concurrencyLimit={3} />);

    // Add 5 LOW priority tasks → first 3 run, last 2 queued
    for (let i = 0; i < 5; i++) {
      await addTask({ user }); // Default priority is LOW
    }

    // Add 2 HIGH priority tasks → should go to queue but with higher priority
    await addTask({ user, priority: TaskPriority.HIGH }); // Task 6
    await addTask({ user, priority: TaskPriority.HIGH }); // Task 7

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 1', 'Task 2', 'Task 3']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual(['Task 4', 'Task 5', 'Task 6', 'Task 7']);
    });

    // Complete first batch → HIGH priority tasks (6,7) should be promoted before LOW (4,5)
    advance(5000);

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual(['Task 1', 'Task 2', 'Task 3']);
      // Task 4 (LOW) gets one slot, but Tasks 6,7 (HIGH) get priority over Task 5 (LOW)
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 4', 'Task 6', 'Task 7']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual(['Task 5']); // Task 5 (LOW) remains queued
    });
  });
});
