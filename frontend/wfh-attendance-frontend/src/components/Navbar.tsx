import { Link, useNavigate } from 'react-router-dom';
import { clearAuthData, getProfile } from '../utils/auth';
import { setAuthToken } from '../services/api';

export default function Navbar() {
  const navigate = useNavigate();
  const profile = getProfile();

  const handleLogout = () => {
    clearAuthData();
    setAuthToken(null);
    navigate('/');
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            WFH Attendance System
          </h1>
          <p className="text-sm text-slate-500">
            {profile?.email} {profile?.role ? `• ${profile.role}` : ''}
          </p>
        </div>

        <nav className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Dashboard
          </Link>

          {profile?.role === 'EMPLOYEE' && (
            <Link
              to="/check-in"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Check-In
            </Link>
          )}

          {profile?.role === 'ADMIN' && (
            <>
              <Link
                to="/employees"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Employees
              </Link>

              <Link
                to="/attendance-monitoring"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Attendance
              </Link>
            </>
          )}

          <button
            onClick={handleLogout}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}