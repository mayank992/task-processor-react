## 📦 Task Processor

### 🧠 Overview

Build a **Task Processor** that manages asynchronous tasks with incremental complexity: basic execution, concurrency limit, and priority.

### 🎯 Core Features

- **Basic Task Management**: Task state and immediate execution (no concurrency limit).
- **Concurrency Limit = 1**: Only one task runs at a time; others queue.
- **Concurrency Limit > 1**: Up to N tasks run at once; queue when full.
- **Priority**: High-priority tasks run before low-priority when choosing from the queue.

### 📋 Project Setup

The project includes:

- **Pre-built UI components** (`TaskForm`, `TaskTable`) – no changes required
- **Hook structure** (`useTaskManager`) – implement the logic here
- TypeScript types and constants
- Mock task execution with 5 second delay
- Jest tests for each milestone (all failing initially)

## 🏗️ Implementation Guide

**Core implementation:** `src/hooks/useTaskManager.ts`

**Key points:**

- Use status transitions: `TaskStatus.PENDING → RUNNING → COMPLETED`
- `task.execute()` is async and takes 5 seconds to complete

## 💡 Implementation Tips

- Start with basic behaviour, then add concurrency, then priority.
- Run tests often: `yarn test`
- Each milestone builds on the previous.

## 🏆 Milestones (4 × 25 marks each)

### **Milestone 1: Basic Task Management (25 marks)**

Basic task management: state and immediate execution.

**Requirements:**

- Store created tasks in state.
- Execute each created task with `task.execute()`.
- Update status: PENDING → RUNNING → COMPLETED.
- No concurrency limit: every new task starts immediately.

---

### **Milestone 2: Concurrency Limit = 1 (25 marks)**

Only one task may run at a time.

**Requirements:**

- When one task is already running, new tasks stay PENDING (queued).
- When the running task completes, start the next queued task.
- Maintain proper status transitions.

---

### **Milestone 3: Concurrency Limit > 1 (25 marks)**

Allow multiple tasks to run at once.

**Requirements:**

- Queue tasks when all slots are occupied.
- When a slot frees up, start the next task from the queue.
- Maintain proper status transitions.

---

### **Milestone 4: Priority (25 marks)**

Respect task priority when scheduling from the queue.

**Requirements:**

- HIGH priority tasks run before LOW priority tasks.
- When multiple tasks are queued, promote HIGH priority tasks first (within the concurrency limit).

---

## 🧪 Running Tests

To run the test suite:

```bash
yarn test
```
