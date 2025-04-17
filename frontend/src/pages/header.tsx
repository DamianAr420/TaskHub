import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { getUserInfoFromToken, removeToken } from '../utils/auth';

export default function Header() {
    const { login } = getUserInfoFromToken();
    const [menuOpen, setMenuOpen] = useState(false);

    const navigate = useNavigate();

    const handleLogout = () => {
      removeToken();
      navigate('/');
    };
  
    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);
  return (
    <header className="bg-gray-800 text-white p-4 relative z-40">
    <div className="container mx-auto flex justify-between items-center">
      <Link to="/" className="flex items-center text-2xl font-bold">
        <img className="w-10 mr-2" src={logo} alt="logo" />
        <p>TaskHub</p>
      </Link>

      {/* Hamburger button */}
      <button
        onClick={toggleMenu}
        className="md:hidden focus:outline-none z-50"
        aria-label="Toggle Menu"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Desktop nav */}
      <nav className="hidden md:flex space-x-6">
        <Link to={login ? "/dashboard" : "/login"} className="hover:text-blue-400">Dashboard</Link>
        <Link to={login ? "/projekty" : "/login"} className="hover:text-blue-400">Projekty</Link>
        <Link to={login ? "/zadania" : "/login"} className="hover:text-blue-400">Zadania</Link>
        <Link to={login ? "/profile" : "/login"} className="hover:text-blue-400">Profil</Link>
      </nav>

      {/* Auth Buttons - Desktop */}
      <div className="hidden md:flex items-center ml-6">
        {login ? (
          <>
            <Link to="/profile" className="bg-blue-400 px-4 py-2 rounded-full hover:bg-blue-500 mx-2">
              {login}
            </Link>
            <button onClick={handleLogout} className="bg-red-700 px-4 py-2 rounded-full hover:bg-red-600 mx-2">
              Wyloguj się
            </button>
          </>
        ) : (
          <Link to="/login" className="bg-blue-500 px-6 py-2 rounded-full hover:bg-blue-600">
            Zaloguj się
          </Link>
        )}
      </div>
    </div>

    {/* Mobile menu + overlay with animation */}
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
        menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={closeMenu}
    />

    <div
      className={`fixed top-0 right-0 w-3/5 max-w-sm h-full bg-gray-800 text-white p-6 z-50 shadow-lg transform transition-transform duration-300 ${
        menuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <ul className="flex flex-col space-y-4 text-center">
        <li>
          <Link to={login ? "/dashboard" : "/login"} onClick={closeMenu} className="hover:text-blue-400 hover:bg-slate-100 p-2 rounded-3xl">Dashboard</Link>
        </li>
        <li>
          <Link to={login ? "/projekty" : "/login"} onClick={closeMenu} className="hover:text-blue-400 hover:bg-slate-100 p-2 rounded-3xl">Projekty</Link>
        </li>
        <li>
          <Link to={login ? "/zadania" : "/login"} onClick={closeMenu} className="hover:text-blue-400 hover:bg-slate-100 p-2 rounded-3xl">Zadania</Link>
        </li>
        <li>
          <Link to={login ? "/profile" : "/login"} onClick={closeMenu} className="hover:text-blue-400 hover:bg-slate-100 p-2 rounded-3xl">Profil</Link>
        </li>
      </ul>

      <div className="mt-6">
        {login ? (
          <>
            <Link
              to="/profile"
              onClick={closeMenu}
              className="block text-center bg-blue-400 px-4 py-2 rounded-full hover:bg-blue-500 mb-2"
            >
              {login}
            </Link>
            <button
              onClick={() => {
                handleLogout();
                closeMenu();
              }}
              className="block w-full text-center bg-red-700 px-4 py-2 rounded-full hover:bg-red-600"
            >
              Wyloguj się
            </button>
          </>
        ) : (
          <Link
            to="/login"
            onClick={closeMenu}
            className="block text-center bg-blue-500 px-6 py-2 rounded-full hover:bg-blue-600"
          >
            Zaloguj się
          </Link>
        )}
      </div>
    </div>
  </header>
  )
}
