import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../helpers/api';
import { getToken, removeToken, getUserInfoFromToken } from '../../utils/auth';

const EditProfile: React.FC = () => {
    const navigate = useNavigate();
    const token = getToken();
    const { id } = getUserInfoFromToken();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        bio: '',
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
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
                    setFormData(res.data.user);
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

        fetchProfile();
    }, [navigate, token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            console.error('Brak tokena');
            return;
        }

        setLoading(true);

        try {
            const res = await apiRequest(`/editProfile/:${id}`, {
                method: 'POST',
                body: formData,
                token,
            });

            if (res.ok) {
                navigate('/profile');
            } else {
                console.error('Błąd aktualizacji:', res.data.error);
            }
        } catch (err) {
            console.error('Błąd połączenia z serwerem:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-screen bg-gray-100 flex items-center justify-center">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Edytuj Profil
                </h2>

                <input
                    type="text"
                    name="firstName"
                    placeholder="Imię"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full mb-4 p-2 border rounded"
                />

                <input
                    type="text"
                    name="lastName"
                    placeholder="Nazwisko"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full mb-4 p-2 border rounded"
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Adres e-mail"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full mb-4 p-2 border rounded"
                />

                <textarea
                    name="bio"
                    placeholder="Krótki opis o sobie"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    className="w-full mb-4 p-2 border rounded resize-none"
                />

                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={() => navigate('/profile')}
                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                        disabled={loading}
                    >
                        Anuluj
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? 'Zapisywanie...' : 'Zapisz'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;
