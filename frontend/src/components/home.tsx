import React, { useState } from 'react';
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { getUserInfoFromToken, removeToken } from '../utils/auth';

export default function Home() {
  const { login } = getUserInfoFromToken();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    removeToken();
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div>
      {/* header */}
      <header className="bg-gray-800 text-white p-4 relative z-40">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center text-2xl font-bold">
            <img className="w-10 mr-2" src={logo} alt="logo" />
            <p>TaskHub</p>
          </Link>

          {/* Hamburger Button (Mobile) */}
          <button
            onClick={toggleMenu}
            className="md:hidden focus:outline-none z-50"
            aria-label="Toggle Menu"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6">
            <Link to={login ? "/dashboard" : "/login"} className="hover:text-blue-400">Dashboard</Link>
            <Link to={login ? "/projekty" : "/login"} className="hover:text-blue-400">Projekty</Link>
            <Link to={login ? "/zadania" : "/login"} className="hover:text-blue-400">Zadania</Link>
            <Link to={login ? "/profil" : "/login"} className="hover:text-blue-400">Profil</Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center ml-6">
            {login ? (
              <>
                <Link to="/profil" className="bg-blue-400 px-4 py-2 rounded-full hover:bg-blue-500 mx-2">
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

        {/* Mobile Menu */}
        {menuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={closeMenu}
            ></div>
            <div className="fixed top-0 right-0 w-3/4 max-w-sm h-full bg-gray-800 text-white p-6 z-50 shadow-lg transition-transform transform translate-x-0">
              <ul className="flex flex-col space-y-4 text-center">
                <li>
                  <Link to={login ? "/dashboard" : "/login"} onClick={closeMenu} className="hover:text-blue-400">Dashboard</Link>
                </li>
                <li>
                  <Link to={login ? "/projekty" : "/login"} onClick={closeMenu} className="hover:text-blue-400">Projekty</Link>
                </li>
                <li>
                  <Link to={login ? "/zadania" : "/login"} onClick={closeMenu} className="hover:text-blue-400">Zadania</Link>
                </li>
                <li>
                  <Link to={login ? "/profil" : "/login"} onClick={closeMenu} className="hover:text-blue-400">Profil</Link>
                </li>
              </ul>

              <div className="mt-6">
                {login ? (
                  <>
                    <Link
                      to="/profil"
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
          </>
        )}
      </header>

      {/* main */}
      <section className="bg-cover bg-center relative">
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50"></div>
        <div className="container mx-auto text-center text-white relative z-10 p-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Zarządzaj projektami i zadaniami w prosty sposób</h1>
          <p className="text-lg md:text-xl mb-6">Współpracuj z zespołem, przypisuj zadania, ustawiaj terminy i śledź postępy.</p>
          {login ? (
            <Link to="/dashboard" className="cursor-pointer text-white bg-blue-400 px-6 py-2 rounded-full hover:bg-blue-500">
              Przejdź do dashboard
            </Link>
          ) : (
            <Link to="/registration" className="cursor-pointer bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600">
              Dołącz teraz
            </Link>
          )}
          <img className="mx-auto my-[10%] md:my-[5%]" src={logo} alt="logo" />
        </div>
      </section>

      {/* functions */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Funkcje</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 shadow-lg rounded-lg max-w-xs mx-auto">
              <h3 className="text-2xl font-semibold mb-4">Zarządzanie zadaniami</h3>
              <p>Twórz zadania, przypisuj je do członków zespołu i śledź postępy.</p>
            </div>
            <div className="bg-white p-6 shadow-lg rounded-lg max-w-xs mx-auto">
              <h3 className="text-2xl font-semibold mb-4">Współpraca w zespole</h3>
              <p>Komentuj zadania, komunikuj się z członkami zespołu i bądź na bieżąco.</p>
            </div>
            <div className="bg-white p-6 shadow-lg rounded-lg max-w-xs mx-auto">
              <h3 className="text-2xl font-semibold mb-4">Terminy i powiadomienia</h3>
              <p>Zarządzaj deadline'ami i otrzymuj powiadomienia o zbliżających się zadaniach.</p>
            </div>
            <div className="bg-white p-6 shadow-lg rounded-lg max-w-xs mx-auto">
              <h3 className="text-2xl font-semibold mb-4">Integracja z kalendarzem</h3>
              <p>Podgląd zadań w kalendarzu, aby nigdy nie przegapić ważnej daty.</p>
            </div>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto text-center">
          <div className="space-x-8">
            <Link to="/about" className="cursor-pointer hover:text-blue-400">O nas</Link>
            <Link to="/privacy" className="cursor-pointer hover:text-blue-400">Polityka prywatności</Link>
            <Link to="/contact" className="cursor-pointer hover:text-blue-400">Kontakt</Link>
          </div>
          <div className="mt-4">
            <Link to="/" className="text-xl px-4 hover:text-blue-400">FB</Link>
            <Link to="/" className="text-xl px-4 hover:text-blue-400">TW</Link>
            <Link to="/" className="text-xl px-4 hover:text-blue-400">IG</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
