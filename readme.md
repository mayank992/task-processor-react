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

- Pre-built UI components (`TaskForm`, `TaskTable`)
- TypeScript types and constants
- Mock task execution with 5 second delay
- Jest tests for each milestone (all failing initially)

## 🏆 Milestones (4 × 25 marks each)

### **Milestone 1: Basic Task Management (25 marks)**

Handle state, execute tasks immediately and sync task status.

**Requirements:**

- Create tasks through the form and add to state.
- Execute tasks immediately when created.
- Update task status: PENDING → RUNNING → COMPLETED.
- Display real-time status in the UI.

---

### **Milestone 2: Concurrency Control (25 marks)**

Handle max concurrent tasks.

**Requirements:**

- Implement `MAX_RUNNING_TASKS = 3` limit.
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

## 🏗️ Implementation Guide

**Core Implementation Location:**

- Implement your task management logic in `src/hooks/useTaskManager.ts`
- The hook should manage task state, execution queue, and status updates

**💡 Implementation Tips:**

- **Start simple**: Get basic functionality working before adding complexity.
- **Test frequently**: Use the test suite to validate your implementation.
- **Think incrementally**: Each milestone builds on the previous.

## 🧪 Running Tests

To run the test suite:

```bash
yarn test
```
