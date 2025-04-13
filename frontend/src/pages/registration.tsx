import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Registration() {
    const [message, setMessage] = useState("");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [sex, setSex] = useState("");
    let navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
    
        if (password !== confirmPassword) {
            setMessage("Hasła nie są zgodne.");
            return;
        }
    
        try {
            const url = process.env.REACT_APP_REGISTRATION as string;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ login, password, sex })
            });
    
            const data = await response.json();
            if (response.ok) {
                setMessage("✅ Użytkownik utworzony!");
                setLogin("");
                setPassword("");
                setConfirmPassword("");
                setSex("");
                navigate("/login")
            } else {
                setMessage(data.error || "❌ Błąd rejestracji");
            }
        } catch (err) {
            if (err instanceof Error) {
                setMessage(`❌ Błąd serwera: ${err.message}`);
            } else {
                setMessage("❌ Wystąpił nieznany błąd");
            }
        }
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
                    <h1 className="text-3xl font-bold text-center text-white mb-6">Rejestracja</h1>

                    {message && (
                        <div className={`mb-4 p-3 rounded-md text-center font-medium ${message.startsWith("✅") ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-white text-lg mb-2" htmlFor="login">Login</label>
                            <input
                                id="login"
                                type="text"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                className="w-full p-3 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Wpisz swój login"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-white text-lg mb-2" htmlFor="password">Hasło</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Wpisz swoje hasło"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-white text-lg mb-2" htmlFor="confirm-password">Powtórz hasło</label>
                            <input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-3 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Powtórz hasło"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-white text-lg mb-2">Płeć</label>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    value="male"
                                    id="male"
                                    name="gender"
                                    checked={sex === "male"}
                                    onChange={(e) => setSex(e.target.value)}
                                    className="mr-2"
                                />
                                <label htmlFor="male" className="text-white mr-4">Mężczyzna</label>
                                <input
                                    type="radio"
                                    value="female"
                                    id="female"
                                    name="gender"
                                    checked={sex === "female"}
                                    onChange={(e) => setSex(e.target.value)}
                                    className="mr-2"
                                />
                                <label htmlFor="female" className="text-white">Kobieta</label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            Zarejestruj się
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <span className="text-white">Masz konto? </span>
                        <Link to="/login" className="text-blue-200 hover:underline">
                            Zaloguj się
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
