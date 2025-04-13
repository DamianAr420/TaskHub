import React from 'react';
import WelcomeBanner from '../components/welcomeBanner';
import ProjectList from '../components/projectList';
import TaskList from '../components/taskList';
import CalendarView from '../components/calendarView';
import ActivityFeed from '../components/activityFeed';
import QuickActions from '../components/quickActions';

const Dashboard: React.FC = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <WelcomeBanner />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <ProjectList />
        <TaskList />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <CalendarView />
        <ActivityFeed />
      </div>

      <div className="mt-8">
        <QuickActions />
      </div>
    </div>
  );
};

export default Dashboard;
