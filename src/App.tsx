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
  const { tasks, addTask } = useTaskManager();

  return (
    <div className="App">
      <h1>Task Processor</h1>
      <TaskForm tasks={tasks} onAddTask={addTask} />
      <TaskTable tasks={tasks} />
    </div>
  );
};

export default App;
