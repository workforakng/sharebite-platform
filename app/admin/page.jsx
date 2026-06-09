"use client";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ShieldAlert, Trash2, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetch('/api/donations').then(res => res.json()).then(setDonations);
    }
  }, [session]);

  if (status === 'loading') return <div className="p-10 text-center">Loading...</div>;
  if (session?.user?.role !== 'ADMIN') return <div className="p-10 text-center text-red-600 bg-red-50 rounded-lg max-w-xl mx-auto mt-10">Access Denied: Admins Only</div>;

  const handleStatus = async (id, newStatus) => {
    await fetch(`/api/donations/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    fetch('/api/donations').then(res => res.json()).then(setDonations);
  };

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-8">
        <ShieldAlert className="w-8 h-8 text-indigo-600" />
        <h1 className="text-3xl font-extrabold text-gray-900">Admin Panel</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b text-gray-900 font-bold uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Donor</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {donations.map(d => (
              <tr key={d.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-semibold text-gray-900">{d.title}</td>
                <td className="px-6 py-4">{d.donor?.name || 'Unknown'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    d.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                    d.status === 'CLAIMED' ? 'bg-orange-100 text-orange-800' :
                    d.status === 'COLLECTED' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                  }`}>{d.status}</span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button onClick={() => handleStatus(d.id, 'CANCELLED')} className="p-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100" title="Cancel">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleStatus(d.id, 'COLLECTED')} className="p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100" title="Mark Collected">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
