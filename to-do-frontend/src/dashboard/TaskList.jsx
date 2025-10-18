import React, { useState } from 'react';
import { Plus, Search, Filter, Sparkles, Trash2, CheckCircle, Circle, AlertTriangle } from 'lucide-react';
import { useTask } from '../contexts/TaskContext';

const TaskList = ({ showCompleted = false }) => {
  const { tasks, addTask, deleteTask, toggleComplete, getAISuggestion } = useTask();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [loadingAI, setLoadingAI] = useState(null);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    completed: false
  });

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    addTask(newTask);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      category: '',
      completed: false
    });
    setShowAddForm(false);
  };

  const handleAISuggestion = async (task) => {
    setLoadingAI(task.id);
    try {
      const suggestion = await getAISuggestion(task);
      setAiSuggestion({ taskId: task.id, suggestion });
    } catch (error) {
      console.error('Failed to get AI suggestion:', error);
    } finally {
      setLoadingAI(null);
    }
  };

  const filteredTasks = tasks
    .filter(task => task.completed === showCompleted)
    .filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(task => filterPriority === 'all' || task.priority === filterPriority)
    .sort((a, b) => {
      if (showCompleted) {
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    if (priority === 'high') return <AlertTriangle className="w-4 h-4" />;
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {showCompleted ? 'Completed Tasks' : 'Tasks'}
          </h1>
          <p className="text-gray-600 mt-1">
            {showCompleted
              ? `${filteredTasks.length} completed tasks`
              : `${filteredTasks.length} active tasks`
            }
          </p>
        </div>

        {!showCompleted && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Add Task</span>
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="pl-12 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm appearance-none"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6">
          <form onSubmit={handleAddTask} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Task title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  value={newTask.category}
                  onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Work, Personal"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Task description"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div key={task.id} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-start space-x-4">
              <button
                onClick={() => toggleComplete(task.id)}
                className="mt-1 flex-shrink-0"
              >
                {task.completed ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400 hover:text-green-500 transition-colors duration-200" />
                )}
              </button>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`text-lg font-semibold ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className={`text-sm mt-1 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center space-x-3 mt-3">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                        {getPriorityIcon(task.priority)}
                        <span className="capitalize">{task.priority}</span>
                      </span>

                      {task.category && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                          {task.category}
                        </span>
                      )}

                      <span className="text-xs text-gray-400">
                        {showCompleted && task.completedAt
                          ? `Completed ${new Date(task.completedAt).toLocaleDateString()}`
                          : `Created ${new Date(task.createdAt).toLocaleDateString()}`
                        }
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {!showCompleted && (
                      <button
                        onClick={() => handleAISuggestion(task)}
                        disabled={loadingAI === task.id}
                        className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 text-sm font-medium disabled:opacity-50"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>{loadingAI === task.id ? 'Getting AI...' : 'AI'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {task.suggestion && task.suggestion !== 'Click the AI button to get a suggestion!' && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-blue-700">
                      <Sparkles className="w-4 h-4" />
                      <span className="font-medium text-sm">AI Suggestion:</span>
                    </div>
                    <p className="text-blue-600 text-sm mt-1">{task.suggestion}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-12 text-center">
          <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {showCompleted ? 'No completed tasks yet' : 'No tasks found'}
          </h3>
          <p className="text-gray-600">
            {showCompleted
              ? 'Complete some tasks to see them here!'
              : searchTerm || filterPriority !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Create your first task to get started!'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskList;