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
 * Handle state, execute tasks immediately and sync task status.
 *
 * Requirements:
 * - Create tasks through the form and add to state
 * - Execute tasks immediately when created
 * - Update task status: PENDING → RUNNING → COMPLETED
 * - Display real-time status in the UI
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

    test('shows empty state before first task is created', () => {
      render(<App />);
      expect(screen.getByText('No tasks created yet.')).toBeInTheDocument();
    });

    test('handles lifecycle and multiple waves of task creation', async () => {
      render(<App />);

      // Wave 1: add 2 tasks
      await addTask({ user });
      await addTask({ user });

      await waitFor(() => {
        expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 1', 'Task 2']);
      });

      // Wave 2: add 1 more while others are still running
      await addTask({ user });
      await waitFor(() => {
        expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 1', 'Task 2', 'Task 3']);
      });

      // Finish first 3
      advance(5000);

      await waitFor(() => {
        expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual(['Task 1', 'Task 2', 'Task 3']);
        expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual([]);
      });

      // Wave 3: add 2 more after batch completed
      await addTask({ user });
      await addTask({ user });

      await waitFor(() => {
        expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual(['Task 4', 'Task 5']);
      });

      advance(5000);

      await waitFor(() => {
        expect(getTasksByStatus(TaskStatus.COMPLETED)).toEqual(['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5']);
        expect(getTasksByStatus(TaskStatus.RUNNING)).toEqual([]);
      });
    });
  });
});
