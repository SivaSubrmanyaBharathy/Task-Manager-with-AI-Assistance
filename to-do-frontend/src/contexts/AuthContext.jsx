import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:5000/api/auth';

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === 'object' && parsedUser.email) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

const login = async (email, password) => {
  setLoading(true);
  try {
    console.log('🔵 LOGIN API CALL:', { email, password });
    
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('🔵 LOGIN RESPONSE STATUS:', response.status);
    const data = await response.json();
    console.log('🔵 LOGIN RESPONSE DATA:', data);

    if (response.ok) {
      const userData = {
        id: data._id || data.id,
        email: data.email,
        name: data.name,
        token: data.token
      };
      
      console.log('🔵 LOGIN SUCCESS - User data:', userData);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setLoading(false);
      return { success: true };
    } else {
      const errorMessage = data.message || data.error || 'Login failed';
      console.log('🔵 LOGIN ERROR:', errorMessage);
      setLoading(false);
      // DON'T setUser(null) here - that's what causes the re-mount
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  } catch (error) {
    console.error('🔵 LOGIN NETWORK ERROR:', error);
    setLoading(false);
    return { 
      success: false, 
      error: 'Network error. Please try again.' 
    };
  }
};

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      console.log('🟢 REGISTER API CALL:', { name, email });
      
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      console.log('🟢 REGISTER RESPONSE STATUS:', response.status);
      const data = await response.json();
      console.log('🟢 REGISTER RESPONSE DATA:', data);

      if (response.ok) {
        console.log('🟢 REGISTER SUCCESS');
        setLoading(false);
        return { 
          success: true, 
          message: 'User created successfully! Please login to continue.' 
        };
      } else {
        // Handle different error response structures
        const errorMessage = data.message || data.error || 'Registration failed';
        console.log('🟢 REGISTER ERROR:', errorMessage);
        setLoading(false);
        return {
          success: false,
          error: errorMessage
        };
      }
    } catch (error) {
      console.error('🟢 REGISTER NETWORK ERROR:', error);
      setLoading(false);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};