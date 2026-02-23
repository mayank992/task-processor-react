## 📦 Task Processor

### 🧠 Overview

Build a **Task Processor** system that manages asynchronous tasks with intelligent scheduling, priority management, and dependency resolution.

### 🎯 Core Features

Your Task Processor will progressively implement:

- **Task State Management**: Store and handle created tasks with real-time status updates.
- **Concurrency Control**: Limit the maximum number of concurrent running tasks.
- **Priority Scheduling**: High-priority tasks execute first.
- **Dependency Resolution**: Handle task dependencies.

### 📋 Project Setup

The project includes:

- **Pre-built UI components** (`TaskForm`, `TaskTable`) - **No changes required**
- **Hook structure** (`useTaskManager`) - **Implement the logic**
- TypeScript types and constants
- Mock task execution with 5 second delay
- Jest tests for each milestone (all failing initially)

## 🏗️ Implementation Guide

**Core Implementation Location:**

- Implement your task management logic in `src/hooks/useTaskManager.ts`

**Key Considerations:**

- Use `TaskStatus.PENDING → RUNNING → COMPLETED` transitions
- **The `task.execute` function is async and takes 5 seconds to complete**

## 💡 Implementation Tips

- **Start simple**: Get basic functionality working before adding complexity.
- **Test frequently**: Use the test suite to validate your implementation.
- **Think incrementally**: Each milestone builds on the previous.

## 🏆 Milestones (4 × 25 marks each)

### **Milestone 1: Basic Task Management (25 marks)**

Handle state, execute tasks immediately and sync task status.

**Requirements:**

- Create tasks through the form and add to state.
- Execute created tasks using `task.execute()`.
- Update task status: PENDING → RUNNING → COMPLETED.

---

### **Milestone 2: Concurrency Control (25 marks)**

Handle max concurrent tasks.

**Requirements:**

- Implement `CONCURRENCY_LIMIT = 3` limit.
- Queue tasks when all slots are occupied.
- Automatically start queued tasks when slots become available.
- Maintain proper status transitions.

---

### **Milestone 3: Priority (25 marks)**

Handle task priority.

**Requirements:**

- HIGH priority tasks execute before LOW priority tasks.
- When multiple tasks are queued, HIGH priority tasks should be promoted first.

---

### **Milestone 4: Dependencies (25 marks)**

Handle task dependencies

**Requirements:**

- A task starts only when all dependencies have completed.

## 🧪 Running Tests

To run the test suite:

```bash
yarn test
```
