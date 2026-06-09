"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") || "DONOR";

  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: defaultRole });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    if (res.ok) router.push("/login");
    else {
      setError("Registration failed. Email might already be in use.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border mt-10">
      <h1 className="text-3xl font-extrabold mb-2">Create Account</h1>
      <p className="text-gray-600 mb-6 text-sm">Join the fight against food waste today.</p>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm font-medium">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
          <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none bg-gray-50">
            <option value="DONOR">Food Donor (Restaurant, Event, Household)</option>
            <option value="NGO">NGO / Shelter / Charity</option>
            <option value="VOLUNTEER">Individual Volunteer</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Organization / Your Name</label>
          <input type="text" required className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
          <input type="email" required className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" onChange={e => setFormData({...formData, email: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
          <input type="password" required className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" onChange={e => setFormData({...formData, password: e.target.value})} />
        </div>
        <button disabled={loading} className="w-full bg-orange-600 text-white p-3 rounded-lg font-bold hover:bg-orange-700 mt-2 transition">
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
      <p className="text-center mt-6 text-gray-600 text-sm">
        Already have an account? <Link href="/login" className="text-orange-600 font-bold hover:underline">Log in</Link>
      </p>
    </div>
  );
}

export default function Register() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading registration...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
