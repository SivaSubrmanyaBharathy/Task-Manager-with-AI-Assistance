import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Overview from './Overview';
import TaskList from './TaskList';

const Dashboard = () => {
  const location = useLocation();

  const renderContent = () => {
    switch (location.pathname) {
      case '/overview':
        return <Overview />;
      case '/tasks':
        return <TaskList showCompleted={false} />;
      case '/completed':
        return <TaskList showCompleted={true} />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;