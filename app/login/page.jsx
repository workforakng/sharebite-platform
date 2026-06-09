"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border mt-10">
      <h1 className="text-3xl font-extrabold mb-6">Welcome Back</h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm font-medium">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
          <input type="email" required className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
          <input type="password" required className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" onChange={e => setPassword(e.target.value)} />
        </div>
        <button disabled={loading} className="w-full bg-orange-600 text-white p-3 rounded-lg font-bold hover:bg-orange-700 mt-2 transition">
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      <p className="text-center mt-6 text-gray-600 text-sm">
        Don't have an account? <Link href="/register" className="text-orange-600 font-bold hover:underline">Sign up</Link>
      </p>
    </div>
  );
}
