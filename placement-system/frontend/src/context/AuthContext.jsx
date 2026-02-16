// import { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [token, setToken] = useState(localStorage.getItem('access_token'));

//   useEffect(() => {
//     if (token) {
//       fetchUserData();
//     } else {
//       setLoading(false);
//     }
//   }, [token]);

//   const fetchUserData = async () => {
//     try {
//       const response = await fetch('http://localhost:8000/api/me/', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         // backend returns a flat user/profile object (not {user, profile})
//         if (data.user) {
//           setUser(data.user);
//           setProfile(data.profile || null);
//         } else {
//           // map flat response into user and profile
//           const { id, username, email, role, department, profile_photo, resume, cgpa, skills } = data;
//           setUser({ id, username, email, role, department });
//           setProfile(
//             cgpa || skills || profile_photo || resume
//               ? { cgpa: cgpa || null, skills: skills || [], profile_photo: profile_photo || null, resume: resume || null }
//               : null
//           );
//         }
//       } else {
//         logout();
//       }
//     } catch (error) {
//       console.error('Failed to fetch user data:', error);
//       logout();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (username, password) => {
//     try {
//       const response = await fetch('http://localhost:8000/api/login/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username, password }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         localStorage.setItem('access_token', data.access);
//         setToken(data.access);
//         // backend returns role inside data.user.role
//         const role = data.user?.role || data.role || 'student';
//         return { success: true, role };
//       } else {
//         return { success: false, error: 'Invalid credentials' };
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       return { success: false, error: 'Login failed' };
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('access_token');
//     setUser(null);
//     setProfile(null);
//     setToken(null);
//   };

//   const isStudent = user?.groups?.some((g) => g.name === 'Student') || user?.role === 'student' || false;
//   const isOfficer = user?.groups?.some((g) => g.name === 'Officer') || user?.role === 'officer' || false;
//   const isAuthenticated = !!token && !!user;

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         profile,
//         token,
//         loading,
//         login,
//         logout,
//         isStudent,
//         isOfficer,
//         isAuthenticated,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
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
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Set user data
        setUser({
          id: data.id,
          username: data.username,
          email: data.email,
          role: data.role,
          department: data.department,
        });
        
        // Set profile data if it exists
        if (data.cgpa || data.skills || data.profile_photo || data.resume) {
          setProfile({
            cgpa: data.cgpa || null,
            skills: data.skills || [],
            profile_photo: data.profile_photo || null,
            resume: data.resume || null,
            resume_filename: data.resume_filename || null,
          });
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

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        setToken(data.access);
        
        // Set user immediately from login response
        setUser({
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          role: data.user.role,
        });
        
        return { 
          success: true, 
          role: data.user.role 
        };
      } else {
        return { 
          success: false, 
          error: data.error || 'Invalid credentials' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'Network error. Please try again.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setProfile(null);
    setToken(null);
  };

  // Determine user role
  const isStudent = user?.role === 'student';
  const isOfficer = user?.role === 'officer';
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