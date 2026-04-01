import { useEffect, useState } from 'react';
import AppLayout from '../layouts/AppLayout';
import API from '../services/api';

type Attendance = {
  id: number;
  employee_id: number;
  attendance_date: string;
  check_in_time: string;
  photo_path?: string;
  note?: string;
};

function extractErrorMessage(error: any): string {
  const message = error?.response?.data?.message;
  if (Array.isArray(message)) return message.join(', ');
  if (typeof message === 'string') return message;
  return 'Failed to fetch attendance data.';
}

export default function AttendanceMonitoring() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [employeeId, setEmployeeId] = useState('');
  const [attendanceDate, setAttendanceDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchAttendances = async () => {
    try {
      setLoading(true);
      setMessage('');

      const res = await API.get('/attendances', {
        params: {
          employee_id: employeeId || undefined,
          attendance_date: attendanceDate || undefined,
        },
      });

      setAttendances(res.data);
    } catch (error) {
      setMessage(extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendances();
  }, []);

  return (
    <AppLayout>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-900">
            Attendance Monitoring
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Review attendance records submitted by employees.
          </p>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-[200px_220px_auto]">
          <input
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
            placeholder="Employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
          />

          <input
            type="date"
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
          />

          <button
            onClick={fetchAttendances}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
          >
            Apply Filter
          </button>
        </div>

        {message && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {message}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-slate-500">Loading attendance...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Employee ID</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Check-In Time</th>
                  <th className="px-4 py-3">Note</th>
                  <th className="px-4 py-3">Photo</th>
                </tr>
              </thead>
              <tbody>
                {attendances.map((attendance) => (
                  <tr key={attendance.id} className="border-b border-slate-100">
                    <td className="px-4 py-3">{attendance.id}</td>
                    <td className="px-4 py-3">{attendance.employee_id}</td>
                    <td className="px-4 py-3">{attendance.attendance_date}</td>
                    <td className="px-4 py-3">
                      {new Date(attendance.check_in_time).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">{attendance.note || '-'}</td>
                    <td className="px-4 py-3">
                      {attendance.photo_path ? (
                        <a
                          href={`http://localhost:3003/${attendance.photo_path}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-900 underline"
                        >
                          View Photo
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}

                {attendances.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-slate-500"
                    >
                      No attendance data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}