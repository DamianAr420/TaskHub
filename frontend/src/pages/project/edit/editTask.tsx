import React, { useState } from "react";
import { Task } from "../../../interfaces/interfaces";
import { editTask } from "../../../helpers/groupService";

interface EditTaskProps {
  projectId: string;
  groupId: string;
  columnId: string;
  task: Task;
  onCancel: () => void;
  onTaskUpdated: (task: Task) => void;
}

const EditTask: React.FC<EditTaskProps> = ({
  projectId,
  groupId,
  columnId,
  task,
  onCancel,
  onTaskUpdated,
}) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    const res = await editTask(
      projectId,
      groupId,
      columnId,
      task._id,
      title,
      description
    );

    if (res.ok) {
      onTaskUpdated({ ...task, title, description });
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Edytuj zadanie</h3>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-3 focus:ring-2 focus:ring-blue-500"
          placeholder="Tytuł"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-3 focus:ring-2 focus:ring-blue-500"
          placeholder="Opis"
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
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Zapisywanie…" : "Zapisz"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTask;
