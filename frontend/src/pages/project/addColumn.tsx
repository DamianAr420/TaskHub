import React, { useState } from 'react';
import { addColumnToGroup } from '../../helpers/groupService';

interface AddColumnProps {
  projectId: string;
  groupId: string;
  onCancel: () => void;
  onColumnAdded: (column: { _id: string; name: string }) => void;
}

const AddColumn: React.FC<AddColumnProps> = ({
  projectId, groupId, onCancel, onColumnAdded
}) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const res = await addColumnToGroup(projectId, groupId, name);
    setLoading(false);
    if (res.ok) {
      onColumnAdded(res.data.column);
      onCancel();
    } else {
      alert(res.data.error || 'Błąd dodawania kolumny');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Dodaj kolumnę</h2>
        <input
          type="text"
          placeholder="Nazwa kolumny"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
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
            {loading ? 'Dodawanie...' : 'Dodaj'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddColumn;
