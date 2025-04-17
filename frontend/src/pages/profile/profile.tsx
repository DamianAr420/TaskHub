import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../../helpers/api';
import { getToken, removeToken } from '../../utils/auth';
import Header from '../header';

interface ProfileData {
    login: string;
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

    useEffect(() => {
        const fetchProfile = async () => {
            const token = getToken();
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const res = await apiRequest('/getProfile', {
                    method: 'GET',
                    token,
                });

                if (res.ok) {
                    setProfile(res.data.user);
                } else {
                    removeToken();
                    navigate('/login');
                }
            } catch (error) {
                console.error('Błąd połączenia z serwerem', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    if (loading) return <div className="text-center mt-20 text-lg">Ładowanie profilu...</div>;

    return (
        <div className="w-full h-screen bg-gray-100 overflow-hidden">
            <Header />

            <section className="flex justify-center items-center h-full bg-gray-200">
                <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Twój Profil</h1>
                    <div className="text-gray-700 space-y-2 mb-6">
                        <p>
                            <strong>Login:</strong> {profile?.login}
                        </p>
                        <p>
                            <strong>Imię i nazwisko:</strong> {profile?.firstName} {profile?.lastName}
                        </p>
                        <p>
                            <strong>Płeć:</strong> {profile?.sex}
                        </p>
                        <p>
                            <strong>Email:</strong> {profile?.email ?? 'Brak danych'}
                        </p>
                        <p>
                            <strong>O mnie:</strong> {profile?.bio ?? 'Brak danych'}
                        </p>
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
