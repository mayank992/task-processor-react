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
- Mock task execution with random delays (2-10 seconds)
- Jest tests for each milestone (all failing initially)

## 🏆 Milestones (4 × 25 marks each)

### **Milestone 1: Basic Task Management (25 marks)**

Handle state, execute tasks immediately and sync task status.

**Requirements:**

- Create tasks through the form and add to state.
- Execute tasks immediately when created.
- Update task status: PENDING → RUNNING → COMPLETED/FAILED.
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

### **Milestone 3: Priority, Cancellation (25 marks)**

Handle task priority, failure and cancellation.

**Requirements:**

- HIGH_PRIORITY tasks execute before NORMAL tasks.
- Implement cancel functionality for PENDING tasks.

---

### **Milestone 4: Dependencies (25 marks)**

Handle task dependencies (you can assume there won't be circular dependencies)

**Requirements:**

- A task starts only when all dependencies have completed successfully.
- If a dependency is canceled, cancel all dependents.
- If a dependency is failed, mark all dependents as failed.

## 💡 Implementation Tips

- **Start simple**: Get basic functionality working before adding complexity.
- **Test frequently**: Use the test suite to validate your implementation.
- **Think incrementally**: Each milestone builds on the previous.
