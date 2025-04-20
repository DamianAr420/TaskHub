import React, { useState } from "react";
import { editGroup } from "../../../helpers/groupService";
import { Group } from "../../../interfaces/interfaces";

interface EditGroupProps {
  projectId: string;
  group: Group;
  onCancel: () => void;
  onGroupUpdated: (updatedGroup: Group) => void;
}

const EditGroup: React.FC<EditGroupProps> = ({
  projectId,
  group,
  onCancel,
  onGroupUpdated,
}) => {
  const [name, setName] = useState(group.name);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    const res = await editGroup(projectId, group._id, name);
    if (res.ok) {
      onGroupUpdated({ ...group, name });
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Edytuj Grupę</h3>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nazwa grupy"
          className="w-full px-3 py-2 border rounded mb-3 focus:ring-2 focus:ring-blue-500"
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
            className={`px-4 py-2 rounded text-white transition-colors ${
              saving
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saving ? "Zapisywanie…" : "Zapisz"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGroup;
