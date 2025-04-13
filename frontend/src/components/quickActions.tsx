import React from 'react';
import { Link } from 'react-router-dom';

const QuickActions: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Link to="/projekty/nowy" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full text-center w-full sm:w-auto">
        + Nowy projekt
      </Link>
      <Link to="/zadania/nowe" className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full text-center w-full sm:w-auto">
        + Nowe zadanie
      </Link>
    </div>
  );
};

export default QuickActions;
