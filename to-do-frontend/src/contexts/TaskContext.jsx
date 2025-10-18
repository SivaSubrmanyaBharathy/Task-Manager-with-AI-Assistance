import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const TaskContext = createContext(null);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const API_BASE_URL = 'http://localhost:5000/api';

  // Get authorization headers
  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user?.token}`
    };
  };

  // 📄 Get all tasks for the logged-in user
  const fetchTasks = async () => {
    if (!user) return;

    setLoading(true);
    try {
      console.log('🔵 FETCHING TASKS...');
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const tasksData = await response.json();
        console.log('🔵 TASKS FETCHED:', tasksData);

        // Convert API response to frontend format
        const formattedTasks = tasksData.map(task => ({
          id: task._id,
          title: task.title,
          description: task.description || '',
          completed: task.completed || false,
          priority: task.priority || 'medium',
          createdAt: new Date(task.createdAt),
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
          category: task.category || '',
          suggestion: task.suggestion || 'No suggestion available' // ✅ Add this
        }));

        setTasks(formattedTasks);
      } else {
        throw new Error('Failed to fetch tasks');
      }
    } catch (error) {
      console.error('🔵 FETCH TASKS ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  // ➕ Create a new task
  const addTask = async (taskData) => {
    if (!user) return;

    setLoading(true);
    try {
      console.log('🟢 CREATING TASK:', taskData);
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description,
          completed: taskData.completed,
          priority: taskData.priority,
          category: taskData.category
        }),
      });

      if (response.ok) {
        const newTask = await response.json();
        console.log('🟢 TASK CREATED:', newTask);

        // Convert API response to frontend format
        const formattedTask = {
          id: newTask._id,
          title: newTask.title,
          description: newTask.description || '',
          completed: newTask.completed || false,
          priority: newTask.priority || 'medium',
          createdAt: new Date(newTask.createdAt),
          completedAt: newTask.completedAt ? new Date(newTask.completedAt) : undefined,
          category: newTask.category || '',
          suggestion: newTask.suggestion || 'No suggestion available' // ✅ Add this
        };

        setTasks(prev => [formattedTask, ...prev]);
        return { success: true, task: formattedTask };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create task');
      }
    } catch (error) {
      console.error('🟢 CREATE TASK ERROR:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Update a task
  const updateTask = async (id, updates) => {
    if (!user) return;

    setLoading(true);
    try {
      console.log('🟡 UPDATING TASK:', id, updates);
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        console.log('🟡 TASK UPDATED:', updatedTask);

        // Convert API response to frontend format
        const formattedTask = {
          id: updatedTask._id,
          title: updatedTask.title,
          description: updatedTask.description || '',
          completed: updatedTask.completed || false,
          priority: updatedTask.priority || 'medium',
          createdAt: new Date(updatedTask.createdAt),
          completedAt: updatedTask.completedAt ? new Date(updatedTask.completedAt) : undefined,
          category: updatedTask.category || '',
          suggestion: updatedTask.suggestion || 'No suggestion available' // ✅ Add this
        };
        setTasks(prev => prev.map(task =>
          task.id === id ? formattedTask : task
        ));
        return { success: true, task: formattedTask };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update task');
      }
    } catch (error) {
      console.error('🟡 UPDATE TASK ERROR:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // ❌ Delete a task
  const deleteTask = async (id) => {
    if (!user) return;

    setLoading(true);
    try {
      console.log('🔴 DELETING TASK:', id);
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        console.log('🔴 TASK DELETED:', id);
        setTasks(prev => prev.filter(task => task.id !== id));
        return { success: true };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete task');
      }
    } catch (error) {
      console.error('🔴 DELETE TASK ERROR:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Toggle task completion
  const toggleComplete = async (id) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    if (!taskToUpdate) return;

    const updates = {
      completed: !taskToUpdate.completed,
      completedAt: !taskToUpdate.completed ? new Date() : undefined
    };

    return await updateTask(id, updates);
  };

// AI Suggestion function - Only called when user clicks AI button
const getAISuggestion = async (task) => {
  try {
    console.log('🤖 Getting AI suggestion for task:', task.title);
    
    const response = await fetch(`${API_BASE_URL}/tasks/ai-suggestion`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        priority: task.priority,
        category: task.category
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('🤖 AI Suggestion received:', data.suggestion);
      
      // Update the task with the new suggestion
      const updateResult = await updateTask(task.id, { suggestion: data.suggestion });
      
      if (updateResult.success) {
        return data.suggestion;
      } else {
        throw new Error('Failed to save suggestion to task');
      }
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get AI suggestion');
    }
  } catch (error) {
    console.error('🤖 AI Suggestion error:', error);
    
    // Fallback motivational messages
    const motivationalMessages = [
      "💪 You've got this! Break it down into smaller steps and tackle them one by one.",
      "🎯 Focus on the impact this task will have once completed. Your future self will thank you!",
      "⚡ Start with just 5 minutes on this task. Often, starting is the hardest part!",
      "🌟 This task is bringing you closer to your goals. Every step forward counts!",
      "🔥 Use the Pomodoro technique: 25 minutes of focused work, then a 5-minute break.",
      "🎨 Make it enjoyable! Put on your favorite music or work in a inspiring environment."
    ];

    const fallbackSuggestion = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    
    // Try to save fallback suggestion
    try {
      await updateTask(task.id, { suggestion: fallbackSuggestion });
    } catch (updateError) {
      console.error('Failed to save fallback suggestion:', updateError);
    }
    
    return fallbackSuggestion;
  }
};

  // Fetch tasks when user changes
  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [user]);

  return (
    <TaskContext.Provider value={{
      tasks,
      loading,
      addTask,
      updateTask,
      deleteTask,
      toggleComplete,
      getAISuggestion,
      fetchTasks, // Expose for manual refreshing
      refreshTasks: fetchTasks // Alias for better semantics
    }}>
      {children}
    </TaskContext.Provider>
  );
}