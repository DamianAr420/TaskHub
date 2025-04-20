import React, { useState } from "react";
import { addTaskToColumn } from "../../../helpers/groupService";

interface AddTaskProps {
  projectId: string;
  groupId: string;
  columnId: string;
  onCancel: () => void;
  onTaskAdded: (task: {
    _id: string;
    title: string;
    description?: string;
    createdAt?: string;
  }) => void;
}

const AddTask: React.FC<AddTaskProps> = ({
  projectId,
  groupId,
  columnId,
  onCancel,
  onTaskAdded,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!title.trim()) return;
    setLoading(true);
    const res = await addTaskToColumn(
      projectId,
      groupId,
      columnId,
      title,
      description
    );
    setLoading(false);
    if (res.ok && res.data.task) {
      const taskWithCreatedAt = {
        ...res.data.task,
        createdAt: res.data.task.createdAt ?? new Date().toISOString(),
      };
      onTaskAdded(taskWithCreatedAt);
      onCancel();
    } else {
      alert(res.data.error || "Błąd dodawania zadania");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Dodaj zadanie</h2>
        <input
          type="text"
          placeholder="Tytuł zadania"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-3 focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Opis (opcjonalnie)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-3 focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Anuluj
          </button>
          <button
            onClick={handleAdd}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Dodawanie..." : "Dodaj"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
