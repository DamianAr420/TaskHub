import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../../helpers/api";
import { getToken } from "../../utils/auth";
import Header from "../header";
import AddGroup from "./add/addGroup";
import AddColumn from "./add/addColumn";
import AddTask from "./add/addTask";
import {
  deleteGroup,
  deleteColumn,
  deleteTask,
} from "../../helpers/groupService";
import Confirmation from "../../components/confirmation";
import EditGroup from "./edit/editGroup";
import EditColumn from "./edit/editColumn";
import EditTask from "./edit/editTask";
import { Task, Column, Group } from "../../interfaces/interfaces";

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
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState<() => void>(
    () => () => {}
  );

  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [editingColumn, setEditingColumn] = useState<Column | null>(null);

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

  const confirmAction = (message: string, action: () => void) => {
    setConfirmMessage(message);
    setOnConfirmAction(() => () => {
      action();
      setShowConfirmDialog(false);
    });
    setShowConfirmDialog(true);
  };

  const onDeleteGroup = (groupId: string) => {
    const group = project?.groups.find((g) => g._id === groupId);
    const name = group?.name || "";
    confirmAction(`Na pewno usunąć grupę "${name}"?`, async () => {
      const res = await deleteGroup(projectId!, groupId);
      if (res.ok && project) {
        setProject({
          ...project,
          groups: project.groups.filter((g) => g._id !== groupId),
        });
        if (selectedGroup === groupId) setSelectedGroup("");
      }
    });
  };

  const onDeleteColumn = (columnId: string) => {
    const group = project?.groups.find((g) => g._id === selectedGroup);
    const column = group?.columns.find((c) => c._id === columnId);
    const name = column?.name || "";
    confirmAction(`Na pewno usunąć kolumnę "${name}"?`, async () => {
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
  };

  const onDeleteTask = (columnId: string, taskId: string) => {
    const group = project?.groups.find((g) => g._id === selectedGroup);
    const column = group?.columns.find((c) => c._id === columnId);
    const task = column?.tasks.find((t) => t._id === taskId);
    const title = task?.title || "";
    confirmAction(`Na pewno usunąć zadanie "${title}"?`, async () => {
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
  };

  const findLogin = (userId: string) => {
    if (!project) return userId;
    const member = project.members?.find((u) => u._id === userId);
    if (member) return member.login;
    return project.createdBy._id === userId ? project.createdBy.login : userId;
  };

  if (loading)
    return <p className="text-center mt-10">⏳ Ładowanie projektu…</p>;
  if (!project)
    return (
      <p className="text-center mt-10 text-red-600">
        ❌ Nie znaleziono projektu.
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <Confirmation
        isOpen={showConfirmDialog}
        message={confirmMessage}
        onConfirm={onConfirmAction}
        onCancel={() => setShowConfirmDialog(false)}
      />

      {addGroup && (
        <AddGroup
          projectId={projectId!}
          onCancel={() => setAddGroup(false)}
          onGroupAdded={() => setAddGroup(false)}
        />
      )}

      {editingGroup && (
        <EditGroup
          projectId={projectId!}
          group={editingGroup}
          onCancel={() => setEditingGroup(null)}
          onGroupUpdated={(updatedGroup) => {
            setProject((prev) =>
              prev
                ? {
                    ...prev,
                    groups: prev.groups.map((g) =>
                      g._id === updatedGroup._id ? updatedGroup : g
                    ),
                  }
                : null
            );
            setEditingGroup(null);
          }}
        />
      )}

      {editingColumn && (
        <EditColumn
          projectId={projectId!}
          groupId={selectedGroup}
          column={editingColumn}
          onCancel={() => setEditingColumn(null)}
          onColumnUpdated={(updatedColumn) => {
            setProject((prev) =>
              prev
                ? {
                    ...prev,
                    groups: prev.groups.map((g) =>
                      g._id !== selectedGroup
                        ? g
                        : {
                            ...g,
                            columns: g.columns.map((c) =>
                              c._id === updatedColumn._id ? updatedColumn : c
                            ),
                          }
                    ),
                  }
                : null
            );
            setEditingColumn(null);
          }}
        />
      )}

      {selectedTask && selectedColumn && (
        <EditTask
          projectId={projectId!}
          groupId={selectedGroup}
          columnId={selectedColumn}
          task={selectedTask}
          onCancel={() => setSelectedTask(null)}
          onTaskUpdated={(updatedTask) => {
            setProject((prev) =>
              prev
                ? {
                    ...prev,
                    groups: prev.groups.map((g) =>
                      g._id !== selectedGroup
                        ? g
                        : {
                            ...g,
                            columns: g.columns.map((col) =>
                              col._id !== selectedColumn
                                ? col
                                : {
                                    ...col,
                                    tasks: col.tasks.map((t) =>
                                      t._id === updatedTask._id
                                        ? updatedTask
                                        : t
                                    ),
                                  }
                            ),
                          }
                    ),
                  }
                : null
            );
            setSelectedTask(null);
          }}
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
                    className={`
                      relative bg-white p-2 rounded shadow hover:bg-gray-100 cursor-pointer
                      ${g._id === selectedGroup ? "ring-2 ring-blue-500" : ""}
                    `}
                    onClick={() => setSelectedGroup(g._id)}
                  >
                    {g.name}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingGroup(g);
                      }}
                      className="absolute right-7 top-2 text-blue-500"
                    >
                      ✏️
                    </button>
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
                          onClick={() => setEditingColumn(col)}
                          className="text-blue-500 text-xs"
                        >
                          ✏️
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
                          <div className="flex flex-col items-end space-y-1">
                            <button
                              onClick={() => {
                                setSelectedColumn(col._id);
                                setSelectedTask(task);
                              }}
                              className="text-blue-500 text-xs"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => onDeleteTask(col._id, task._id)}
                              className="text-red-500 text-xs"
                            >
                              🗑️
                            </button>
                          </div>
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
