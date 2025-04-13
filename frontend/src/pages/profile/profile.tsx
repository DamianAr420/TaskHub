import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../../utils/auth';

interface ProfileData {
  login: string;
  fullName?: string;
  email?: string;
  bio?: string;
  firstName: string;
  lastName: string;
  sex: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(process.env.REACT_APP_GET_PROFILE as string, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Dane profilu:', data);  // Sprawdź, jak wygląda struktura danych
        setProfile(data.user);  // Zmienione na 'data.user', ponieważ odpowiedź zawiera dane w takim formacie
      } else {
        console.error('Nie udało się pobrać profilu');
        removeToken();
        navigate('/login');
      }
    } catch (error) {
      console.error('Błąd połączenia z serwerem', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  if (loading) return <div className="text-center mt-20 text-lg">Ładowanie profilu...</div>;

  return (
    <div className="w-full h-screen bg-gray-100">
      <header className="bg-gray-800 p-4 text-white flex items-center justify-between">
        <Link to="/" className="text-lg hover:text-blue-400">
          &#8592; Strona główna
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-1 rounded hover:bg-red-700 text-sm"
        >
          Wyloguj się
        </button>
      </header>

      <section className="flex justify-center items-center h-full bg-gray-200">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Twój Profil</h1>
          <div className="text-gray-700 space-y-2 mb-6">
            <p><strong>Login:</strong> {profile?.login}</p>
            <p><strong>Imię i nazwisko:</strong> {profile?.firstName} {profile?.lastName}</p>
            <p><strong>Email:</strong> {profile?.email ?? 'Brak danych'}</p>
            <p><strong>O mnie:</strong> {profile?.bio ?? 'Brak danych'}</p>
          </div>
          <Link
            to="/profile/edit"
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Edytuj profil
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Profile;
