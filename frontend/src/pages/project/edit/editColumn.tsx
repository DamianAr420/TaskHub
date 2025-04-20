import React, { useState } from "react";
import { Column } from "../../../interfaces/interfaces";
import { editColumn } from "../../../helpers/groupService";

interface EditColumnProps {
  projectId: string;
  groupId: string;
  column: Column;
  onCancel: () => void;
  onColumnUpdated: (column: Column) => void;
}

const EditColumn: React.FC<EditColumnProps> = ({
  projectId,
  groupId,
  column,
  onCancel,
  onColumnUpdated,
}) => {
  const [name, setName] = useState(column.name);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    const res = await editColumn(projectId, groupId, column._id, name);
    if (res.ok) {
      onColumnUpdated({ ...column, name });
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Edytuj kolumnę</h3>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-3 focus:ring-2 focus:ring-blue-500"
          placeholder="Nazwa kolumny"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
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

export default EditColumn;
