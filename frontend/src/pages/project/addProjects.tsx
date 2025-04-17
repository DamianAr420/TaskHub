import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiRequest } from '../../helpers/api';
import { getToken } from '../../utils/auth';

const AddProject: React.FC = () => {
  const navigate = useNavigate();
  const token = getToken();

  const [name, setname] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (!token) {
      setMessage('❌ Brak autoryzacji.');
      return;
    }

    const response = await apiRequest('/projects', {
      method: 'POST',
      body: { name, description },
      token,
    });

    if (response.ok) {
      navigate('/projekty');
    } else {
      setMessage(response.data.error || '❌ Nie udało się dodać projektu');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Dodaj nowy projekt
        </h2>

        {message && (
          <div
            className={`mb-4 p-3 rounded text-center font-medium ${
              message.startsWith('❌')
                ? 'bg-red-200 text-red-800'
                : 'bg-green-200 text-green-800'
            }`}
          >
            {message}
          </div>
        )}

        <input
          type="text"
          placeholder="Tytuł projektu"
          value={name}
          onChange={(e) => setname(e.target.value)}
          required
          className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <textarea
          placeholder="Opis (opcjonalnie)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full mb-4 p-3 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex justify-between">
          <Link
            to="/projekty"
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm"
          >
            Anuluj
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            {loading ? 'Dodawanie...' : 'Dodaj projekt'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProject;
