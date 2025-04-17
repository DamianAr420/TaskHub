import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../helpers/api';
import { getToken, removeToken } from '../../utils/auth';
import Header from '../header';

interface UserShort {
  _id: string;
  login: string;
  firstName?: string;
  lastName?: string;
}

interface Project {
  _id: string;
  name: string;
  description?: string;
  createdBy: UserShort;
  createdAt: Date;
  updatedAt?: Date;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await apiRequest('/projects', { token });

        if (response.ok) {
          setProjects(response.data.projects);
        } else {
          removeToken();
          navigate('/login');
        }
      } catch (error) {
        console.error('❌ Błąd pobierania projektów:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [navigate]);

  const handleAddProject = () => {
    navigate('/projekty/nowy');
  };

  const handleShowProject = (projectId: string) => {
    navigate(`/projekt/${projectId}`)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-4xl mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Twoje Projekty</h1>
          <button
            onClick={handleAddProject}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Dodaj projekt
          </button>
        </div>

        {loading ? (
          <p className="text-center">⏳ Ładowanie projektów...</p>
        ) : projects.length === 0 ? (
          <p className="text-center text-gray-600">Brak projektów do wyświetlenia.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                onClick={() => handleShowProject(project._id)}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {project.name}
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  {project.description || 'Brak opisu'}
                </p>
                <p className="text-xs text-gray-400">
                  Utworzone przez: {project.createdBy.login}
                  {project.createdBy.firstName && project.createdBy.lastName
                    ? ` (${project.createdBy.firstName} ${project.createdBy.lastName})`
                    : ''}
                </p>
                <p className="text-xs text-gray-400">
                  Utworzono: {new Date(project.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-400">
                  Zaktualizowano: {project.updatedAt
                    ? new Date(project.updatedAt).toLocaleDateString() + ' ' + new Date(project.updatedAt).toLocaleTimeString()
                    : 'Brak danych'}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Projects;
