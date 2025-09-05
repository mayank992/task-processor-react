// libs
import { ReactElement } from 'react';

// components
import { TaskForm } from './components/taskForm';
import { TaskTable } from './components/taskTable';

// hooks
import { useTaskManager } from './hooks/useTaskManager';

// styles
import './styles.css';

const App = (): ReactElement => {
  const { tasks, addTask, cancelTask } = useTaskManager();

  return (
    <div className="App">
      <h1>Task Processor</h1>
      <TaskForm tasks={tasks} onAddTask={addTask} />
      <TaskTable tasks={tasks} onCancelTask={cancelTask} />
    </div>
  );
};

export default App;
