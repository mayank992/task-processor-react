// types
import type { Task } from '../../types';

// helpers
import { getStatusIcon, getPriorityIcon } from '../../helpers';

// constants
import { TASK_PRIORITY_VS_LABEL, TASK_STATUS_VS_LABEL, TaskPriority, TaskStatus } from '../../constants';

type TaskTableProps = {
  tasks: Task[];
};

const StatusBadge = ({ status }: { status: TaskStatus }) => (
  <span className={`status-badge status-${status.toLowerCase()}`}>
    {getStatusIcon(status)} {TASK_STATUS_VS_LABEL[status]}
  </span>
);

const PriorityBadge = ({ priority }: { priority: TaskPriority }) => (
  <span className={`priority-badge priority-${priority.toLowerCase()}`}>
    {getPriorityIcon(priority)} {TASK_PRIORITY_VS_LABEL[priority]}
  </span>
);

export const TaskTable = ({ tasks }: TaskTableProps) => (
  <div className="task-table">
    <h2 className="task-table-title">
      Tasks {tasks.length > 0 && <span className="task-count">({tasks.length})</span>}
    </h2>

    {tasks.length === 0 ? (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <p>No tasks created yet.</p>
        <p className="empty-subtitle">Create your first task using the form above!</p>
      </div>
    ) : (
      <table>
        <thead>
          <tr>
            <th>Task ID</th>
            <th>Priority</th>
            <th>Dependencies</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(({ id, priority, dependencies, status }) => (
            <tr key={id}>
              <td className="task-id">{id}</td>
              <td>
                <PriorityBadge priority={priority} />
              </td>
              <td>
                {dependencies.length > 0 ? (
                  dependencies.map((dep, index) => (
                    <span key={dep}>
                      {dep}
                      {index < dependencies.length - 1 && ', '}
                    </span>
                  ))
                ) : (
                  <span className="no-dependencies">None</span>
                )}
              </td>
              <td>
                <StatusBadge status={status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);
