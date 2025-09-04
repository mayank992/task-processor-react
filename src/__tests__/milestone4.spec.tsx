// libs
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// components
import App from '../App';

// helpers
import { resetTaskCounter } from '../components/taskForm/helpers';
import { getTasksByStatus, addTask } from './utils';

// constants
import { TaskPriority, TaskStatus } from '../constants';

/**
 * MILESTONE 4: Dependencies (25 marks)
 *
 * Handle task dependencies (you can assume there won't be circular dependencies)
 *
 * Requirements:
 * - A task starts only when all dependencies have completed successfully
 * - If a dependency is canceled, cancel all dependents
 * - If a dependency is failed, mark all dependents as failed
 */

describe('Milestone 4: Dependencies', () => {
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

  test('should wait for dependencies before starting dependent tasks', async () => {
    render(<App />);

    await addTask({ user }); // Task 1
    await addTask({ user, dependencies: ['Task 1'] }); // Task 2

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 1']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual(['Task 2']);
    });

    act(() => jest.advanceTimersByTime(5000));

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual(['Task 1']);
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 2']);
    });
  });

  test('should handle multiple dependencies correctly', async () => {
    render(<App />);

    await addTask({ user }); // Task 1
    await addTask({ user }); // Task 2
    await addTask({ user, dependencies: ['Task 1', 'Task 2'] }); // Task 3

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 1', 'Task 2']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual(['Task 3']);
    });

    act(() => jest.advanceTimersByTime(5000));

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual(['Task 1', 'Task 2']);
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 3']);
    });
  });

  test('should cancel dependent tasks when dependency is cancelled', async () => {
    render(<App />);

    await addTask({ user }); // Task 1
    await addTask({ user, dependencies: ['Task 1'] }); // Task 2
    await addTask({ user, dependencies: ['Task 2'] }); // Task 3

    const cancelButtons = screen.getAllByText('Cancel');
    await user.click(cancelButtons[0]); // Cancel Task 2

    act(() => jest.advanceTimersByTime(5000));

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual(['Task 1']);
      expect(getTasksByStatus(TaskStatus.CANCELLED)).toEqual(['Task 2', 'Task 3']);
    });
  });

  test('should fail dependent tasks when dependency fails', async () => {
    render(<App />);

    await addTask({ user, fail: true }); // Task 1
    await addTask({ user, dependencies: ['Task 1'] }); // Task 2
    await addTask({ user, dependencies: ['Task 2'] }); // Task 3

    act(() => jest.advanceTimersByTime(5000));

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.FAILED)).toEqual(['Task 1', 'Task 2', 'Task 3']);
    });
  });

  test('should handle complex dependency chains', async () => {
    render(<App />);

    await addTask({ user }); // Task 1
    await addTask({ user, dependencies: ['Task 1'] }); // Task 2
    await addTask({ user, dependencies: ['Task 2'] }); // Task 3

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 1']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual(['Task 2', 'Task 3']);
    });

    act(() => jest.advanceTimersByTime(5000));

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual(['Task 1']);
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 2']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual(['Task 3']);
    });

    act(() => jest.advanceTimersByTime(5000));

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual(['Task 1', 'Task 2']);
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 3']);
    });
  });

  test('should handle mixed priority with dependencies', async () => {
    render(<App />);

    await addTask({ user }); // Task 1, LOW
    await addTask({ user, priority: TaskPriority.LOW, dependencies: ['Task 1'] }); // Task 2, LOW
    await addTask({ user, priority: TaskPriority.LOW, dependencies: ['Task 1'] }); // Task 3, LOW
    await addTask({ user, priority: TaskPriority.LOW, dependencies: ['Task 1'] }); // Task 4, LOW
    await addTask({ user, priority: TaskPriority.LOW, dependencies: ['Task 1'] }); // Task 5, LOW
    await addTask({ user, priority: TaskPriority.HIGH, dependencies: ['Task 1'] }); // Task 6, HIGH

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(expect.arrayContaining(['Task 1']));
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual(['Task 2', 'Task 3', 'Task 4', 'Task 5', 'Task 6']);
    });

    act(() => jest.advanceTimersByTime(5000));

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual(['Task 1']);
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 2', 'Task 3', 'Task 6']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual(['Task 4', 'Task 5']);
    });
  });
});
