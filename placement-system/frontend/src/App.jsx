import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import CompanyDrives from './pages/student/CompanyDrives';
import MyApplications from './pages/student/MyApplications';

// Officer Pages
import OfficerDashboard from './pages/officer/Dashboard';
import ManageDrives from './pages/officer/ManageDrives';
import ManageStudents from './pages/officer/ManageStudents';

// Common Pages
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Toaster position="top-right" />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Student Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/drives"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <CompanyDrives />
                </ProtectedRoute>
              }
            />
            <Route
              path="/drives/:id"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <CompanyDrives />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applications"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <MyApplications />
                </ProtectedRoute>
              }
            />

            {/* Officer Routes */}
            <Route
              path="/officer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['officer']}>
                  <OfficerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/drives"
              element={
                <ProtectedRoute allowedRoles={['officer']}>
                  <ManageDrives />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/students"
              element={
                <ProtectedRoute allowedRoles={['officer']}>
                  <ManageStudents />
                </ProtectedRoute>
              }
            />

            {/* Default Route */}
            <Route path="/" element={<Login />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;