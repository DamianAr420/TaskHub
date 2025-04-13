import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserInfoFromToken, removeToken } from '../utils/auth';

export default function Profile() {
  const { login, sex } = getUserInfoFromToken();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <div className="w-full h-screen bg-gray-100">
      <header className="bg-gray-800 p-4 text-white h-[5%] flex items-center">
                <Link to="/" className="text-lg hover:text-blue-400">
                    &#8592; Strona główna
                </Link>
            </header>
      <section className="w-full h-[95%] flex justify-center items-center bg-gray-200">
        <div className="bg-gray-400 p-8 rounded-lg shadow-xl w-96">
          <h1 className="text-3xl font-bold text-center text-white mb-6">Twój Profil</h1>
          <div className="text-white mb-4">
            <p><strong>Login:</strong> {login || 'Brak danych'}</p>
            <p><strong>Płeć:</strong> {sex || 'Brak danych'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 mt-4 bg-red-600 text-white font-bold rounded hover:bg-red-700"
          >
            Wyloguj się
          </button>
        </div>
      </section>
    </div>
  );
}
