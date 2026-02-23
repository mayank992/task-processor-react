// libs
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// components
import App from '../App';

// helpers
import { resetTaskCounter } from '../components/taskForm/helpers';
import { getTasksByStatus, addTask, advance } from './utils';

// constants
import { TaskPriority, TaskStatus } from '../constants';

/**
 * MILESTONE 4: Dependencies (25 marks)
 *
 * Handle task dependencies (you can assume there won't be circular dependencies)
 *
 * Requirements:
 * - A task starts only when all dependencies have completed successfully
 */

describe('Milestone 4: Task Dependencies', () => {
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

  test('should wait for dependencies before starting dependent tasks', async () => {
    render(<App />);

    await addTask({ user }); // Task 1 - no dependencies, should start immediately
    await addTask({ user, dependencies: ['Task 1'] }); // Task 2 - depends on Task 1, should wait

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 1']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual(['Task 2']); // Task 2 waits for Task 1
    });

    // Complete Task 1 → Task 2 should now be able to start
    advance(5000);

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual(['Task 1']);
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 2']); // Task 2 starts after Task 1 completes
    });
  });

  test('should handle multiple dependencies correctly', async () => {
    render(<App />);

    await addTask({ user }); // Task 1 - no dependencies
    await addTask({ user }); // Task 2 - no dependencies
    await addTask({ user, dependencies: ['Task 1', 'Task 2'] }); // Task 3 - depends on BOTH Task 1 AND Task 2

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 1', 'Task 2']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual(['Task 3']); // Task 3 waits for both dependencies
    });

    // Complete both dependencies → Task 3 can now start
    advance(5000);

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual(['Task 1', 'Task 2']);
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 3']); // Task 3 starts only after BOTH dependencies complete
    });
  });

  test('should handle complex dependency chains', async () => {
    render(<App />);

    await addTask({ user }); // Task 1 - no dependencies
    await addTask({ user, dependencies: ['Task 1'] }); // Task 2 - depends on Task 1
    await addTask({ user, dependencies: ['Task 2'] }); // Task 3 - depends on Task 2 (chain: 1→2→3)

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 1']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual(['Task 2', 'Task 3']); // Both wait in chain
    });

    // Complete Task 1 → Task 2 can start, Task 3 still waits
    advance(5000);

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual(['Task 1']);
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 2']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual(['Task 3']); // Task 3 still waits for Task 2
    });

    // Complete Task 2 → Task 3 can finally start
    advance(5000);

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual(['Task 1', 'Task 2']);
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 3']); // Task 3 starts last in the chain
    });
  });

  test('should handle mixed priority with dependencies', async () => {
    render(<App />);

    await addTask({ user }); // Task 1, LOW - no dependencies, starts immediately
    await addTask({ user, priority: TaskPriority.LOW, dependencies: ['Task 1'] }); // Task 2, LOW - depends on Task 1
    await addTask({ user, priority: TaskPriority.LOW, dependencies: ['Task 1'] }); // Task 3, LOW - depends on Task 1
    await addTask({ user, priority: TaskPriority.LOW, dependencies: ['Task 1'] }); // Task 4, LOW - depends on Task 1
    await addTask({ user, priority: TaskPriority.LOW, dependencies: ['Task 1'] }); // Task 5, LOW - depends on Task 1
    await addTask({ user, priority: TaskPriority.HIGH, dependencies: ['Task 1'] }); // Task 6, HIGH - depends on Task 1

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(expect.arrayContaining(['Task 1']));
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual(['Task 2', 'Task 3', 'Task 4', 'Task 5', 'Task 6']); // All wait for Task 1
    });

    // Complete Task 1 → HIGH priority Task 6 should be promoted first, along with 2 LOW priority tasks
    advance(5000);

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual(['Task 1']);
      // Task 6 (HIGH) gets priority over Tasks 4,5 (LOW) despite being created later
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 2', 'Task 3', 'Task 6']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual(['Task 4', 'Task 5']); // Lower priority tasks remain queued
    });
  });
});
