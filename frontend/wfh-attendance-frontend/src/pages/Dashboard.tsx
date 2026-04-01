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

      <div className="grid gap-6 md:grid-cols-3">
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

        {profile?.role === 'EMPLOYEE' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Attendance
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Submit your daily attendance and upload your work-from-home proof.
            </p>
            <div className="mt-4">
              <Link
                to="/check-in"
                className="inline-flex rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800"
              >
                Go to Check-In
              </Link>
            </div>
          </div>
        )}

        {profile?.role === 'ADMIN' && (
          <>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Employee Management
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Create, update, and deactivate employee records.
              </p>
              <div className="mt-4">
                <Link
                  to="/employees"
                  className="inline-flex rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Open Employees
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Attendance Monitoring
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Review attendance data submitted by employees.
              </p>
              <div className="mt-4">
                <Link
                  to="/attendance-monitoring"
                  className="inline-flex rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800"
                >
                  View Attendance
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}