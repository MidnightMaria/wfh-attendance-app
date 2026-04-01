import { useState } from 'react';
import AppLayout from '../layouts/AppLayout';
import API from '../services/api';

function extractErrorMessage(error: any): string {
  const message = error?.response?.data?.message;

  if (Array.isArray(message)) {
    return message.join(', ');
  }

  if (typeof message === 'string') {
    return message;
  }

  return 'Failed to submit attendance.';
}

export default function CheckIn() {
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async () => {
    try {
      setLoading(true);
      setMessage('');
      setMessageType('');

      if (photo) {
        const formData = new FormData();
        formData.append('note', note);
        formData.append('photo', photo);

        await API.post('/attendances/check-in-with-photo', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await API.post('/attendances/check-in', { note });
      }

      setMessage('Check-in submitted successfully.');
      setMessageType('success');
      setNote('');
      setPhoto(null);
    } catch (error: any) {
      setMessage(extractErrorMessage(error));
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Employee Check-In</h2>
        <p className="mt-2 text-sm text-slate-500">
          Submit your attendance and upload a photo if needed.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Note
            </label>
            <textarea
              className="min-h-32 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
              placeholder="Working from home today"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              className="block w-full text-sm text-slate-600"
            />
          </div>

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

          <button
            onClick={handleCheckIn}
            disabled={loading}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? 'Submitting...' : 'Submit Check-In'}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}