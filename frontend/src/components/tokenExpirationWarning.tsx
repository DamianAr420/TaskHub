import React, { useEffect, useState } from 'react';
import { getUserInfoFromToken, refreshToken } from '../utils/auth';

const TokenExpirationWarning: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const { exp } = getUserInfoFromToken();

    if (!exp) return;

    const expirationTime = exp * 1000;
    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = expirationTime - now;
      const secondsLeft = Math.floor(remaining / 1000);

      setTimeLeft(secondsLeft);

      if (secondsLeft <= 300 && secondsLeft > 0) {
        setShowWarning(true);
      }

      if (secondsLeft <= 0) {
        setShowWarning(false);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRefreshToken = async () => {
    const success = await refreshToken();
    if (success) {
      setShowWarning(false);
      window.location.reload();
    } else {
      alert("Nie udało się odświeżyć tokena. Zaloguj się ponownie.");
    }
  };

  if (!showWarning || timeLeft === null) return null;

  return (
    <div className="fixed bottom-5 right-5 bg-yellow-400 text-black p-4 rounded shadow-lg z-50">
      <p className="mb-2">
        Uwaga! Twoja sesja wygaśnie za {Math.floor(timeLeft / 60)} minut i {timeLeft % 60} sekund.
      </p>
      <button
        onClick={handleRefreshToken}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Przedłuż sesję
      </button>
    </div>
  );
};

export default TokenExpirationWarning;
