import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CheckIn from './pages/CheckIn';
import Employees from './pages/Employees';
import AttendanceMonitoring from './pages/AttendanceMonitoring';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/check-in"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <CheckIn />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Employees />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance-monitoring"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AttendanceMonitoring />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;