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
 * MILESTONE 1: Basic Task Management (25 marks)
 *
 * Handle state, execute tasks immediately and sync task status.
 *
 * Requirements:
 * - Create tasks through the form and add to state
 * - Execute tasks immediately when created
 * - Update task status: PENDING → RUNNING → COMPLETED/FAILED
 * - Display real-time status in the UI
 */

describe('Milestone 1: Basic Task Management', () => {
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

  test('should create and add tasks to state with correct initial properties', async () => {
    render(<App />);

    // Initial state - no tasks
    expect(screen.getByText('No tasks created yet.')).toBeInTheDocument();

    // Create first task
    await addTask({ user });

    await waitFor(() => expect(screen.queryByText('No tasks created yet.')).not.toBeInTheDocument());

    // Task 1 should be running
    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 1']);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual([]);
      expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual([]);
    });
  });

  test('should follow complete status transition: PENDING → RUNNING → COMPLETED', async () => {
    render(<App />);

    await addTask({ user });

    // Complete execution: RUNNING → COMPLETED
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual(['Task 1']);
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual([]);
      expect(getTasksByStatus(TaskStatus.PENDING)).toEqual([]);
    });
  });

  test('should handle multiple tasks with independent execution and failure case', async () => {
    render(<App />);

    // Create 3 tasks, with one forced to fail
    await addTask({ user });
    await addTask({ user });
    await addTask({ user, fail: true });

    // Complete all tasks
    act(() => {
      jest.advanceTimersByTime(20000);
    });

    await waitFor(() => {
      expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual(['Task 1', 'Task 2']);
      expect(getTasksByStatus(TaskStatus.FAILED)).toEqual(['Task 3']);
      expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual([]);
    });
  });
});
