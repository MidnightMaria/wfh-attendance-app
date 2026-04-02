import { useEffect, useMemo, useState } from 'react';
import AppLayout from '../layouts/AppLayout';
import API from '../services/api';

type Employee = {
  id: number;
  employee_code: string;
  full_name: string;
  email: string;
  phone?: string;
  department?: string;
  position?: string;
  hire_date?: string;
  is_active: boolean;
};

type EmployeeForm = {
  employee_code: string;
  full_name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  hire_date: string;
};

type AccountForm = {
  email: string;
  password: string;
  role: 'ADMIN' | 'EMPLOYEE';
};

const emptyForm: EmployeeForm = {
  employee_code: '',
  full_name: '',
  email: '',
  phone: '',
  department: '',
  position: '',
  hire_date: '',
};

const emptyAccountForm: AccountForm = {
  email: '',
  password: '',
  role: 'EMPLOYEE',
};

function extractErrorMessage(error: any): string {
  const message = error?.response?.data?.message;
  if (Array.isArray(message)) return message.join(', ');
  if (typeof message === 'string') return message;
  return 'Something went wrong.';
}

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState<EmployeeForm>(emptyForm);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [showAccountModal, setShowAccountModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [accountForm, setAccountForm] = useState<AccountForm>(emptyAccountForm);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const title = useMemo(
    () => (editingEmployee ? 'Update Employee' : 'Create Employee'),
    [editingEmployee],
  );

  const fetchEmployees = async () => {
    try {
      const res = await API.get('/employees');
      setEmployees(res.data);
    } catch (error) {
      setMessage(extractErrorMessage(error));
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (key: keyof EmployeeForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingEmployee(null);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setForm({
      employee_code: employee.employee_code ?? '',
      full_name: employee.full_name ?? '',
      email: employee.email ?? '',
      phone: employee.phone ?? '',
      department: employee.department ?? '',
      position: employee.position ?? '',
      hire_date: employee.hire_date ?? '',
    });
    setMessage('');
    setMessageType('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setMessage('');
      setMessageType('');

      const payload = {
        employee_code: form.employee_code,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone || undefined,
        department: form.department || undefined,
        position: form.position || undefined,
        hire_date: form.hire_date || undefined,
      };

      if (editingEmployee) {
        await API.patch(`/employees/${editingEmployee.id}`, payload);
        setMessage('Employee updated successfully.');
      } else {
        await API.post('/employees', payload);
        setMessage('Employee created successfully.');
      }

      setMessageType('success');
      resetForm();
      await fetchEmployees();
    } catch (error) {
      setMessage(extractErrorMessage(error));
      setMessageType('error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (id: number) => {
    try {
      setMessage('');
      setMessageType('');

      await API.patch(`/employees/${id}/deactivate`);

      setMessage('Employee deactivated successfully.');
      setMessageType('success');

      await fetchEmployees();
    } catch (error) {
      setMessage(extractErrorMessage(error));
      setMessageType('error');
    }
  };

  const handleActivate = async (id: number) => {
    try {
      setMessage('');
      setMessageType('');

      await API.patch(`/employees/${id}/activate`);

      setMessage('Employee activated successfully.');
      setMessageType('success');

      await fetchEmployees();
    } catch (error) {
      setMessage(extractErrorMessage(error));
      setMessageType('error');
    }
  };

  const openCreateAccountModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setAccountForm({
      email: employee.email,
      password: '',
      role: 'EMPLOYEE',
    });
    setShowAccountModal(true);
  };

  const closeCreateAccountModal = () => {
    setShowAccountModal(false);
    setSelectedEmployee(null);
    setAccountForm(emptyAccountForm);
  };

  const handleCreateAccount = async () => {
    if (!selectedEmployee) return;

    try {
      setSubmitting(true);
      setMessage('');
      setMessageType('');

      await API.post('/auth/register', {
        email: accountForm.email,
        password: accountForm.password,
        role: accountForm.role,
        employee_id: selectedEmployee.id,
      });

      setMessage('User account created successfully.');
      setMessageType('success');
      closeCreateAccountModal();
    } catch (error) {
      setMessage(extractErrorMessage(error));
      setMessageType('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
          <p className="mt-2 text-sm text-slate-500">
            Manage employee records used by the attendance system.
          </p>

          <div className="mt-6 space-y-4">
            <input
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              placeholder="Employee Code"
              value={form.employee_code}
              onChange={(e) => handleChange('employee_code', e.target.value)}
            />

            <input
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              placeholder="Full Name"
              value={form.full_name}
              onChange={(e) => handleChange('full_name', e.target.value)}
            />

            <input
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              placeholder="Email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />

            <input
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />

            <input
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              placeholder="Department"
              value={form.department}
              onChange={(e) => handleChange('department', e.target.value)}
            />

            <input
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              placeholder="Position"
              value={form.position}
              onChange={(e) => handleChange('position', e.target.value)}
            />

            <input
              type="date"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              value={form.hire_date}
              onChange={(e) => handleChange('hire_date', e.target.value)}
            />

            {message && (
              <div
                className={`rounded-xl px-4 py-3 text-sm ${
                  messageType === 'success'
                    ? 'border border-green-200 bg-green-50 text-green-700'
                    : 'border border-red-200 bg-red-50 text-red-600'
                }`}
              >
                {message}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {submitting
                  ? 'Submitting...'
                  : editingEmployee
                  ? 'Update Employee'
                  : 'Create Employee'}
              </button>

              {editingEmployee && (
                <button
                  onClick={resetForm}
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">
              Employee List
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Review and manage employee data.
            </p>
          </div>

          {loading ? (
            <p className="text-sm text-slate-500">Loading employees...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-600">
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Position</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id} className="border-b border-slate-100">
                      <td className="px-4 py-3">{employee.employee_code}</td>
                      <td className="px-4 py-3">{employee.full_name}</td>
                      <td className="px-4 py-3">{employee.email}</td>
                      <td className="px-4 py-3">{employee.department || '-'}</td>
                      <td className="px-4 py-3">{employee.position || '-'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            employee.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {employee.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleEdit(employee)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => openCreateAccountModal(employee)}
                            className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-50"
                          >
                            Create Account
                          </button>

                          {employee.is_active ? (
                            <button
                              onClick={() => handleDeactivate(employee.id)}
                              className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivate(employee.id)}
                              className="rounded-lg border border-green-200 px-3 py-2 text-xs font-medium text-green-600 hover:bg-green-50"
                            >
                              Activate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {employees.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-6 text-center text-slate-500"
                      >
                        No employee data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showAccountModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-slate-900">
              Create User Account
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Create login credentials for {selectedEmployee.full_name}.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Employee ID
                </label>
                <input
                  disabled
                  value={selectedEmployee.id}
                  className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-500 outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  value={accountForm.email}
                  onChange={(e) =>
                    setAccountForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  value={accountForm.password}
                  onChange={(e) =>
                    setAccountForm((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Role
                </label>
                <select
                  value={accountForm.role}
                  onChange={(e) =>
                    setAccountForm((prev) => ({
                      ...prev,
                      role: e.target.value as 'ADMIN' | 'EMPLOYEE',
                    }))
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
                >
                  <option value="EMPLOYEE">EMPLOYEE</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCreateAccount}
                  disabled={submitting}
                  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {submitting ? 'Submitting...' : 'Create Account'}
                </button>

                <button
                  onClick={closeCreateAccountModal}
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}