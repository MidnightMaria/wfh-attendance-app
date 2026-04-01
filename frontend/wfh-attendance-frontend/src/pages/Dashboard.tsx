import AppLayout from '../layouts/AppLayout';
import { getProfile } from '../utils/auth';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const profile = getProfile();

  return (
    <AppLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-slate-900">Dashboard</h2>
        <p className="mt-2 text-slate-500">
          Welcome back. You are logged in as {profile?.role}.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            Account Overview
          </h3>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p>Email: {profile?.email}</p>
            <p>Role: {profile?.role}</p>
            <p>Employee ID: {profile?.employee_id ?? '-'}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Quick Access</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {profile?.role === 'EMPLOYEE' && (
              <Link
                to="/check-in"
                className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800"
              >
                Go to Check-In
              </Link>
            )}

            {profile?.role === 'ADMIN' && (
              <Link
                to="/employees"
                className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800"
              >
                Manage Employees
              </Link>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}