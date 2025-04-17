import React, { useState } from "react";
import { apiRequest } from "../../helpers/api";
import { getToken, getUserInfoFromToken } from "../../utils/auth";

interface AddGroupProps {
  projectId: string;
  onCancel: () => void;
  onGroupAdded?: () => void;
}

const AddGroup: React.FC<AddGroupProps> = ({
  projectId,
  onCancel,
  onGroupAdded,
}) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!name.trim()) return;
    setLoading(true);

    const token = getToken() ?? undefined;
    const user = getUserInfoFromToken() ?? undefined;
    const userId = user.id;
    try {
      const res = await apiRequest(`/project/${projectId}/groups`, {
        method: "POST",
        token,
        body: { name, userId },
      });

      if (res.ok) {
        onCancel();
        onGroupAdded?.();
      } else {
        console.error("Błąd dodawania grupy");
      }
    } catch (err) {
      console.error(err);
      console.error("Coś poszło nie tak");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col gap-4 items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dodaj grupę</h1>
        <div className="w-full">
          <label
            htmlFor="groupName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nazwa grupy
          </label>
          <input
            id="groupName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-4 mt-2">
          <button
            onClick={handleAdd}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Dodawanie..." : "Dodaj"}
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Anuluj
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddGroup;
