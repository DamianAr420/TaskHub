import React from 'react';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { getUserInfoFromToken } from '../utils/auth';
import Header from './header';

export default function Home() {
  const { login } = getUserInfoFromToken();
  return (
    <div>
      <Header />

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
