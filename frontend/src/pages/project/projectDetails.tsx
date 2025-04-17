import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../../helpers/api";
import { getToken } from "../../utils/auth";
import Header from "../header";
import AddGroup from "./addGroup";
import AddColumn from "./addColumn";
import AddTask from "./addTask";

interface UserShort {
  _id: string;
  login: string;
  firstName?: string;
  lastName?: string;
}

interface Task {
  _id: string;
  title: string;
  description?: string;
  createdAt: string;
}

interface Column {
  _id: string;
  name: string;
  tasks: Task[];
}

interface Group {
  _id: string;
  name: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  columns: Column[];
}

interface Project {
  _id: string;
  name: string;
  description?: string;
  createdBy: UserShort;
  createdAt: Date;
  updatedAt?: Date;
  members?: UserShort[];
  groups: Group[];
}

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [addGroup, setAddGroup] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await apiRequest(`/project/${projectId}`, { token });

        if (response.ok) {
          setProject(response.data.project);
        } else {
          navigate("/projekty");
        }
      } catch (error) {
        console.error("❌ Błąd pobierania szczegółów projektu:", error);
        navigate("/projekty");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, navigate]);

  const handleColumnAdded = (column: { _id: string; name: string }) => {
    setProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        groups: prev.groups.map((group) => {
          if (group._id === selectedGroup) {
            return {
              ...group,
              columns: [...group.columns, { ...column, tasks: [] }],
            };
          }
          return group;
        }),
      };
    });
  };

  const handleTaskAdded = (task: {
    _id: string;
    title: string;
    description?: string;
    createdAt?: string;
  }) => {
    const taskWithCreatedAt: Task = {
      _id: task._id,
      title: task.title,
      description: task.description,
      createdAt: task.createdAt || new Date().toISOString(),
    };

    setProject((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        groups: prev.groups.map((group) => {
          if (group._id !== selectedGroup) return group;

          return {
            ...group,
            columns: group.columns.map((col) => {
              if (col._id !== selectedColumn) return col;
              return {
                ...col,
                tasks: [...col.tasks, taskWithCreatedAt],
              };
            }),
          };
        }),
      };
    });
  };

  if (loading) {
    return <p className="text-center mt-10">⏳ Ładowanie projektu...</p>;
  }

  if (!project) {
    return (
      <p className="text-center mt-10 text-red-600">
        ❌ Nie znaleziono projektu.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      {addGroup && (
        <AddGroup
          projectId={projectId!}
          onCancel={() => setAddGroup(false)}
          onGroupAdded={() => setAddGroup(false)}
        />
      )}
      {showAddColumn && selectedGroup && (
        <AddColumn
          projectId={projectId!}
          groupId={selectedGroup}
          onCancel={() => setShowAddColumn(false)}
          onColumnAdded={(col) => {
            handleColumnAdded(col);
            setShowAddColumn(false);
          }}
        />
      )}
      {showAddTask && selectedGroup && selectedColumn && (
        <AddTask
          projectId={projectId!}
          groupId={selectedGroup}
          columnId={selectedColumn}
          onCancel={() => setShowAddTask(false)}
          onTaskAdded={(task) => {
            handleTaskAdded(task);
            setShowAddTask(false);
          }}
        />
      )}

      <div className="flex flex-1">
        <aside className="w-64 bg-gray-200 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{project.name}</h2>
              <button
                className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded-xl ml-4"
                onClick={() => setAddGroup(true)}
              >
                ➕ Dodaj Grupę
              </button>
            </div>

            <ul className="space-y-2 mt-4">
              {project.groups && project.groups.length > 0 ? (
                project.groups.map((group) => (
                  <li
                    onClick={() => setSelectedGroup(group._id)}
                    key={group._id}
                    className={`bg-white p-2 rounded shadow hover:bg-gray-100 transition cursor-pointer ${
                      group._id === selectedGroup ? "ring-2 ring-blue-500" : ""
                    }`}
                  >
                    {group.name}
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500">Brak grup w projekcie</li>
              )}
            </ul>
          </div>
          <div className="text-xs text-gray-600">info o projekcie / grupie</div>
        </aside>

        {/* Główna część: kolumny z zadaniami */}
        <main className="flex-1 bg-blue-600 text-white p-6 overflow-auto relative">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">
              {selectedGroup
                ? project.groups.find((g) => g._id === selectedGroup)?.name
                : "Wybierz grupę"}
            </h3>
            {selectedGroup && (
              <button
                className="bg-white text-black px-4 py-1 rounded hover:bg-gray-300"
                onClick={() => setShowAddColumn(true)}
              >
                ➕ Kolumna
              </button>
            )}
          </div>

          <div className="flex space-x-4 overflow-x-auto pb-24">
            {project.groups
              .find((g) => g._id === selectedGroup)
              ?.columns.map((col) => (
                <div
                  key={col._id}
                  className="bg-white text-black w-1/4 min-w-[250px] rounded shadow p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold">{col.name}</h4>
                    <button
                      onClick={() => {
                        setSelectedColumn(col._id);
                        setShowAddTask(true);
                      }}
                      className="bg-gray-300 p-1 rounded-md hover:bg-gray-400 text-sm text-black"
                    >
                      ➕ Zadanie
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {col.tasks.map((task) => (
                      <li
                        key={task._id}
                        className="bg-gray-100 p-2 rounded text-sm"
                      >
                        <div className="font-semibold">{task.title}</div>
                        {task.description && (
                          <div className="text-xs text-gray-600">
                            {task.description}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>

          {/* Dolny pasek info */}
          <div className="absolute bottom-0 left-0 w-full text-sm bg-gray-900 text-white text-center py-2">
            informacje o wybranej grupie:{" "}
            {project.groups.map((info) =>
              info._id === selectedGroup ? (
                <p key={info._id}>
                  Utworzona przez: {info.createdBy}, Utworzona:{" "}
                  {new Date(info.createdAt).toLocaleDateString()},
                  Aktualizowana: {new Date(info.updatedAt).toLocaleDateString()}
                </p>
              ) : null
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectDetails;
