import React from 'react';

interface Project {
  name: string;
  progress: number;
}

const projects: Project[] = [
  { name: "Projekt A", progress: 60 },
  { name: "Projekt B", progress: 20 },
  { name: "Projekt C", progress: 100 },
];

const ProjectList: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Moje projekty</h2>
      <ul className="space-y-3">
        {projects.map((proj, idx) => (
          <li key={idx}>
            <div className="flex justify-between mb-1">
              <span>{proj.name}</span>
              <span>{proj.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${proj.progress}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
