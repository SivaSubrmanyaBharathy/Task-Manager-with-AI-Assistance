// import React from 'react';
// import { CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
// import { useTask } from '../../contexts/TaskContext';

import React from 'react';
import { CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { useTask } from '../contexts/TaskContext';

const Overview = () => {
  const { tasks } = useTask();

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  const highPriorityTasks = tasks.filter(task => task.priority === 'high' && !task.completed);
  
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const stats = [
    {
      label: 'Total Tasks',
      value: tasks.length,
      icon: CheckCircle,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      label: 'Completed',
      value: completedTasks.length,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      label: 'Pending',
      value: pendingTasks.length,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700'
    },
    {
      label: 'High Priority',
      value: highPriorityTasks.length,
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    }
  ];

  const recentTasks = tasks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
          <p className="text-gray-600 mt-1">Track your productivity and task progress</p>
        </div>
        <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl">
          <TrendingUp className="w-5 h-5" />
          <span className="font-semibold">{completionRate}% Complete</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${stat.bgColor} ${stat.textColor}`}>
                  {stat.label}
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {tasks.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 overflow-hidden">
          <div className="p-6 border-b border-gray-200/50">
            <h2 className="text-xl font-semibold text-gray-900">Recent Tasks</h2>
            <p className="text-gray-600 text-sm">Your latest task activity</p>
          </div>
          <div className="divide-y divide-gray-200/50">
            {recentTasks.map((task) => (
              <div key={task.id} className="p-6 hover:bg-gray-50/50 transition-colors duration-200">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    task.completed 
                      ? 'bg-green-500' 
                      : task.priority === 'high'
                      ? 'bg-red-500'
                      : task.priority === 'medium'
                      ? 'bg-yellow-500'
                      : 'bg-gray-400'
                  }`} />
                  <div className="flex-1">
                    <h3 className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-12 text-center">
          <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks yet</h3>
          <p className="text-gray-600 mb-6">Create your first task to get started with your productivity journey!</p>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" style={{ width: '0%' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;