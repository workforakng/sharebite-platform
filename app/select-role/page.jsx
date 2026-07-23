"use client";
import { useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Utensils, Users, HeartHandshake, ShieldCheck, ArrowRight } from "lucide-react";

function SelectRoleContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roles = [
    { value: "DONOR", label: "Food Donor", desc: "Restaurant, Event, Household", icon: Utensils, color: "bg-orange-100 text-orange-700" },
    { value: "NGO", label: "NGO / Shelter / Charity", desc: "Food bank, Community kitchen", icon: Users, color: "bg-green-100 text-green-700" },
    { value: "VOLUNTEER", label: "Individual Volunteer", desc: "Pickup & deliver food locally", icon: HeartHandshake, color: "bg-blue-100 text-blue-700" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      setError("Please select a role to continue");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole })
      });

      if (res.ok) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update profile");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f2eb]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#4a6741] border-r-transparent"></div>
          <p className="mt-4 text-[#6b6248] font-serif italic">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!session?.user?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f2eb]">
        <div className="text-center p-8">
          <p className="text-[#c44a1a] font-bold mb-4">Please sign in first</p>
          <a href="/login" className="text-[#4a6741] font-bold underline">Go to Login</a>
        </div>
      </div>
    );
  }

  // If user already has a role, redirect to dashboard
  if (session.user.role) {
    router.push(callbackUrl);
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f5f2eb] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-[#ccc5b2]">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f0edff] text-[#553db0] mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-extrabold text-[#27210f] mb-3">
              Welcome to ShareBite, {session.user.name?.split(" ")[0] || "there"}!
            </h1>
            <p className="text-[#6b6248] text-lg">
              To help us connect you with the right community, please tell us who you are.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {roles.map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => setSelectedRole(role.value)}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all flex items-center gap-5 ${
                  selectedRole === role.value
                    ? `border-[#4a6741] bg-[#f0fdf4] shadow-lg shadow-[#4a6741]/10`
                    : "border-[#ede9df] hover:border-[#c07a13] hover:bg-[#faf9f5]"
                }`}
              >
                <div className={`p-4 rounded-xl ${role.color} flex-shrink-0`}>
                  <role.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#27210f]">{role.label}</h3>
                  <p className="text-sm text-[#6b6248] mt-1">{role.desc}</p>
                </div>
                {selectedRole === role.value && (
                  <div className="bg-[#4a6741] text-white p-3 rounded-full">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </button>
            ))}

            <button
              disabled={loading || !selectedRole}
              className="w-full mt-8 bg-[#c07a13] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#9b5e08] transition shadow-md disabled:opacity-50 disabled:hover:bg-[#c07a13] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  Continue <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-[#a89f88]">
            By continuing, you agree to our{" "}
            <a href="/terms" className="text-[#4a6741] font-bold hover:underline">Terms & Conditions</a>
            {" and acknowledge the food safety disclaimer."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SelectRole() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#f5f2eb]"><div className="text-center"><div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#4a6741] border-r-transparent"></div><p className="mt-4 text-[#6b6248] font-serif italic">Loading...</p></div></div>}>
      <SelectRoleContent />
    </Suspense>
  );
}