import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../../helpers/api";
import { getToken } from "../../utils/auth";
import Header from "../header";
import AddGroup from "./addGroup";
import AddColumn from "./addColumn";
import AddTask from "./addTask";
import {
  deleteGroup,
  deleteColumn,
  deleteTask,
} from "../../helpers/groupService";
import Confirmation from "../../components/confirmation";

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
  createdBy: string; // userId
  createdAt: Date;
  updatedAt: Date;
  columns: Column[];
}

interface Project {
  _id: string;
  name: string;
  description?: string;
  createdBy: UserShort; // object with login
  createdAt: Date;
  updatedAt?: Date;
  members?: UserShort[];
  groups: Group[];
}

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const [addGroup, setAddGroup] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);

  // Confirmation dialog
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState<() => void>(
    () => () => {}
  );

  // Fetch project
  useEffect(() => {
    const fetchProject = async () => {
      const token = getToken();
      if (!token) return navigate("/login");
      try {
        const res = await apiRequest(`/project/${projectId}`, { token });
        if (res.ok) setProject(res.data.project);
        else navigate("/projekty");
      } catch {
        navigate("/projekty");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId, navigate]);

  // Local add handlers
  const handleColumnAdded = (column: { _id: string; name: string }) => {
    if (!project) return;
    setProject({
      ...project,
      groups: project.groups.map((g) =>
        g._id === selectedGroup
          ? { ...g, columns: [...g.columns, { ...column, tasks: [] }] }
          : g
      ),
    });
  };
  const handleTaskAdded = (task: {
    _id: string;
    title: string;
    description?: string;
    createdAt?: string;
  }) => {
    if (!project) return;
    const t: Task = {
      _id: task._id,
      title: task.title,
      description: task.description,
      createdAt: task.createdAt || new Date().toISOString(),
    };
    setProject({
      ...project,
      groups: project.groups.map((g) =>
        g._id !== selectedGroup
          ? g
          : {
              ...g,
              columns: g.columns.map((col) =>
                col._id !== selectedColumn
                  ? col
                  : { ...col, tasks: [...col.tasks, t] }
              ),
            }
      ),
    });
  };

  // Confirmation helper
  const confirmAction = (message: string, action: () => void) => {
    setConfirmMessage(message);
    setOnConfirmAction(() => () => {
      action();
      setShowConfirmDialog(false);
    });
    setShowConfirmDialog(true);
  };

  // Delete handlers
  const onDeleteGroup = (groupId: string) =>
    confirmAction("Na pewno usunąć grupę?", async () => {
      const res = await deleteGroup(projectId!, groupId);
      if (res.ok && project) {
        setProject({
          ...project,
          groups: project.groups.filter((g) => g._id !== groupId),
        });
        if (selectedGroup === groupId) setSelectedGroup("");
      }
    });

  const onDeleteColumn = (columnId: string) =>
    confirmAction("Na pewno usunąć kolumnę?", async () => {
      const res = await deleteColumn(projectId!, selectedGroup, columnId);
      if (res.ok && project) {
        setProject({
          ...project,
          groups: project.groups.map((g) =>
            g._id !== selectedGroup
              ? g
              : { ...g, columns: g.columns.filter((c) => c._id !== columnId) }
          ),
        });
      }
    });

  const onDeleteTask = (columnId: string, taskId: string) =>
    confirmAction("Na pewno usunąć zadanie?", async () => {
      const res = await deleteTask(projectId!, selectedGroup, columnId, taskId);
      if (res.ok && project) {
        setProject({
          ...project,
          groups: project.groups.map((g) =>
            g._id !== selectedGroup
              ? g
              : {
                  ...g,
                  columns: g.columns.map((col) =>
                    col._id !== columnId
                      ? col
                      : {
                          ...col,
                          tasks: col.tasks.filter((t) => t._id !== taskId),
                        }
                  ),
                }
          ),
        });
      }
    });

  if (loading)
    return <p className="text-center mt-10">⏳ Ładowanie projektu…</p>;
  if (!project)
    return (
      <p className="text-center mt-10 text-red-600">
        ❌ Nie znaleziono projektu.
      </p>
    );

  // helper: find login by ID
  const findLogin = (userId: string) =>
    project.members?.find((u) => u._id === userId)?.login ||
    (project.createdBy._id === userId ? project.createdBy.login : userId);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      {/* Confirmation */}
      <Confirmation
        isOpen={showConfirmDialog}
        message={confirmMessage}
        onConfirm={onConfirmAction}
        onCancel={() => setShowConfirmDialog(false)}
      />

      {/* Add modals */}
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
        {/* Sidebar */}
        <aside className="w-64 bg-gray-200 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              {/* click clears selection */}
              <h2
                className="text-lg font-bold cursor-pointer hover:underline"
                onClick={() => setSelectedGroup("")}
              >
                {project.name}
              </h2>
              <button
                className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded-xl"
                onClick={() => setAddGroup(true)}
              >
                ➕ Dodaj Grupę
              </button>
            </div>
            <ul className="space-y-2">
              {project.groups.length > 0 ? (
                project.groups.map((g) => (
                  <li
                    key={g._id}
                    className={`relative bg-white p-2 rounded shadow hover:bg-gray-100 cursor-pointer ${
                      g._id === selectedGroup ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setSelectedGroup(g._id)}
                  >
                    {g.name}
                    <button
                      onClick={() => onDeleteGroup(g._id)}
                      className="absolute right-2 top-2 text-red-500"
                    >
                      🗑️
                    </button>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500">Brak grup w projekcie</li>
              )}
            </ul>
          </div>
        </aside>

        {/* Main area */}
        <main className="flex-1 bg-blue-600 text-white p-6 overflow-auto relative">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">
              {selectedGroup
                ? project.groups.find((g) => g._id === selectedGroup)?.name
                : "Szczegóły projektu"}
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

          {selectedGroup ? (
            <div className="flex space-x-4 overflow-x-auto pb-24">
              {project.groups
                .find((g) => g._id === selectedGroup)!
                .columns.map((col) => (
                  <div
                    key={col._id}
                    className="bg-white text-black w-1/4 min-w-[250px] rounded shadow p-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold">{col.name}</h4>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => {
                            setSelectedColumn(col._id);
                            setShowAddTask(true);
                          }}
                          className="bg-gray-300 p-1 rounded-md hover:bg-gray-400 text-sm text-black"
                        >
                          ➕ Zadanie
                        </button>
                        <button
                          onClick={() => onDeleteColumn(col._id)}
                          className="text-red-500 text-xs"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {col.tasks.map((task) => (
                        <li
                          key={task._id}
                          className="bg-gray-100 p-2 rounded text-sm flex justify-between"
                        >
                          <div>
                            <div className="font-semibold">{task.title}</div>
                            {task.description && (
                              <div className="text-xs text-gray-600">
                                {task.description}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => onDeleteTask(col._id, task._id)}
                            className="text-red-500 text-xs"
                          >
                            🗑️
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded shadow text-black">
              <h4 className="font-bold text-lg mb-2">Opis projektu</h4>
              <p className="mb-4">
                {project.description || "Brak opisu projektu."}
              </p>
              <ul className="text-sm space-y-1">
                <li>
                  <strong>Utworzony przez:</strong> {project.createdBy.login}
                </li>
                <li>
                  <strong>Data utworzenia:</strong>{" "}
                  {new Date(project.createdAt).toLocaleDateString()}
                </li>
                {project.updatedAt && (
                  <li>
                    <strong>Ostatnia aktualizacja:</strong>{" "}
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Footer info */}
          <div className="absolute bottom-0 left-0 w-full text-sm bg-gray-900 text-white text-center py-2">
            {selectedGroup
              ? project.groups.map((info) =>
                  info._id === selectedGroup ? (
                    <p key={info._id}>
                      Utworzona przez: {findLogin(info.createdBy)},&nbsp;
                      Utworzona: {new Date(info.createdAt).toLocaleDateString()}
                      ,&nbsp; Aktualizowana:{" "}
                      {new Date(info.updatedAt).toLocaleDateString()}{" "}
                      {new Date(info.updatedAt).toLocaleTimeString()}
                    </p>
                  ) : null
                )
              : "Wybierz grupę, by zobaczyć szczegóły"}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectDetails;
