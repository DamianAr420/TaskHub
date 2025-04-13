import React from 'react';

interface Task {
  title: string;
  status: 'todo' | 'in progress' | 'done';
}

const tasks: Task[] = [
  { title: "Zadanie 1", status: "done" },
  { title: "Zadanie 2", status: "in progress" },
  { title: "Zadanie 3", status: "todo" },
];

const TaskList: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Moje zadania</h2>
      <ul className="space-y-2">
        {tasks.map((task, idx) => (
          <li key={idx} className="flex justify-between items-center">
            <span>{task.title}</span>
            <span className={`text-sm px-2 py-1 rounded-full ${
              task.status === 'done' ? 'bg-green-200 text-green-800' :
              task.status === 'in progress' ? 'bg-yellow-200 text-yellow-800' :
              'bg-gray-200 text-gray-800'
            }`}>
              {task.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
