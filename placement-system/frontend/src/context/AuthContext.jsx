import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('access_token'));

  useEffect(() => {
    if (token) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/me/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // backend returns a flat user/profile object (not {user, profile})
        if (data.user) {
          setUser(data.user);
          setProfile(data.profile || null);
        } else {
          // map flat response into user and profile
          const { id, username, email, role, department, profile_photo, resume, cgpa, skills } = data;
          setUser({ id, username, email, role, department });
          setProfile(
            cgpa || skills || profile_photo || resume
              ? { cgpa: cgpa || null, skills: skills || [], profile_photo: profile_photo || null, resume: resume || null }
              : null
          );
        }
      } else {
        logout();
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        setToken(data.access);
        // backend returns role inside data.user.role
        const role = data.user?.role || data.role || 'student';
        return { success: true, role };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    setProfile(null);
    setToken(null);
  };

  const isStudent = user?.groups?.some((g) => g.name === 'Student') || user?.role === 'student' || false;
  const isOfficer = user?.groups?.some((g) => g.name === 'Officer') || user?.role === 'officer' || false;
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        login,
        logout,
        isStudent,
        isOfficer,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
