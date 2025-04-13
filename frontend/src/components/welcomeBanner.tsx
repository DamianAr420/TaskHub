import React from 'react';

interface User {
  name: string;
  tasksToday: number;
}

const WelcomeBanner: React.FC = () => {
  const user: User = { name: "Janek", tasksToday: 3 };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h1 className="text-2xl font-semibold">Witaj, {user.name} 👋</h1>
      <p className="text-gray-600 mt-2">
        Masz dziś <strong>{user.tasksToday}</strong> zadania do wykonania.
      </p>
    </div>
  );
};

export default WelcomeBanner;
