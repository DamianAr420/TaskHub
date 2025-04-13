import React from 'react';

interface Activity {
  user: string;
  action: string;
  time: string;
}

const activity: Activity[] = [
  { user: "Anna", action: "dodała zadanie", time: "5 minut temu" },
  { user: "Bartek", action: "ukończył projekt", time: "2 godziny temu" },
];

const ActivityFeed: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md h-full">
      <h2 className="text-xl font-semibold mb-4">Aktywność zespołu</h2>
      <ul className="space-y-2">
        {activity.map((item, idx) => (
          <li key={idx} className="text-gray-700">
            <strong>{item.user}</strong> {item.action} <span className="text-sm text-gray-500">({item.time})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityFeed;
