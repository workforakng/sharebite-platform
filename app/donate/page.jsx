"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Utensils, CalendarClock, MapPin, AlignLeft, Info } from 'lucide-react';

// Helper to calculate default expiry based on category
const calculateDefaultExpiry = (category) => {
  const now = new Date();
  let hoursToAdd = 2; // Default for Cooked Meals
  if (category === 'Raw Ingredients/Produce') hoursToAdd = 48;
  else if (category === 'Packaged Items') hoursToAdd = 168; // 1 week
  else if (category === 'Bakery/Bread') hoursToAdd = 24;

  now.setHours(now.getHours() + hoursToAdd);
  // Format to local datetime-local string (YYYY-MM-DDThh:mm)
  const tzOffset = (new Date()).getTimezoneOffset() * 60000;
  const localISOTime = (new Date(now - tzOffset)).toISOString().slice(0,16);
  return localISOTime;
};

export default function Donate() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [formData, setFormData] = useState({ 
    title: '', type: 'Cooked Meals', quantity: '', 
    expires: calculateDefaultExpiry('Cooked Meals'), pickupStart: '', pickupEnd: '', 
    location: '', notes: '' 
  });
  const [loading, setLoading] = useState(false);

  // Update default expiry when category changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      expires: calculateDefaultExpiry(prev.type)
    }));
  }, [formData.type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/donations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-[#ccc5b2] mt-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#4a6741] to-[#7dab6e]"></div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-[#27210f] mb-3 tracking-tight">List Surplus Food</h1>
        <p className="text-[#6b6248] font-medium text-lg">Help NGOs and volunteers rescue your surplus food efficiently.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <section className="space-y-5">
          <div className="flex items-center gap-2 text-[#4a6741] font-bold uppercase tracking-widest text-xs mb-2">
            <Utensils className="w-4 h-4" /> Food Details
          </div>
          <div>
            <label className="block text-sm font-bold text-[#27210f] mb-2">Donation Title</label>
            <input type="text" placeholder="e.g. 5 Trays of Buffet Sandwiches" required 
              className="w-full border border-[#ccc5b2] p-4 rounded-xl focus:border-[#4a6741] focus:ring-1 focus:ring-[#4a6741] outline-none transition" 
              onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-[#27210f] mb-2">Category</label>
              <select className="w-full border border-[#ccc5b2] p-4 rounded-xl focus:border-[#4a6741] focus:ring-1 focus:ring-[#4a6741] outline-none transition bg-white" 
                onChange={e => setFormData({...formData, type: e.target.value})} value={formData.type}>
                <option>Cooked Meals</option>
                <option>Raw Ingredients/Produce</option>
                <option>Packaged Items</option>
                <option>Bakery/Bread</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#27210f] mb-2">Quantity</label>
              <input type="text" placeholder="e.g. 50 servings, 10 kg" required 
                className="w-full border border-[#ccc5b2] p-4 rounded-xl focus:border-[#4a6741] focus:ring-1 focus:ring-[#4a6741] outline-none transition" 
                onChange={e => setFormData({...formData, quantity: e.target.value})} />
            </div>
          </div>
        </section>

        {/* Timing */}
        <section className="space-y-5 bg-[#faf9f5] p-6 rounded-2xl border border-[#ede9df]">
          <div className="flex items-center gap-2 text-[#4a6741] font-bold uppercase tracking-widest text-xs mb-2">
            <CalendarClock className="w-4 h-4" /> Scheduling (Auto-Calculated Expiry)
          </div>
          <div>
            <label className="block text-sm font-bold text-[#27210f] mb-2">Expiration Time</label>
            <input type="datetime-local" required value={formData.expires}
              className="w-full border border-[#ccc5b2] p-4 rounded-xl focus:border-[#4a6741] focus:ring-1 focus:ring-[#4a6741] outline-none transition bg-white" 
              onChange={e => setFormData({...formData, expires: e.target.value})} />
            <p className="text-xs text-[#6b6248] mt-2 flex items-center gap-1"><Info className="w-3 h-3"/> Estimated safe consumption limit based on category. Adjust if needed.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div>
              <label className="block text-sm font-bold text-[#27210f] mb-2">Pickup Window Start (Opt)</label>
              <input type="datetime-local" 
                className="w-full border border-[#ccc5b2] p-4 rounded-xl focus:border-[#4a6741] focus:ring-1 focus:ring-[#4a6741] outline-none transition bg-white" 
                onChange={e => setFormData({...formData, pickupStart: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#27210f] mb-2">Pickup Window End (Opt)</label>
              <input type="datetime-local" 
                className="w-full border border-[#ccc5b2] p-4 rounded-xl focus:border-[#4a6741] focus:ring-1 focus:ring-[#4a6741] outline-none transition bg-white" 
                onChange={e => setFormData({...formData, pickupEnd: e.target.value})} />
            </div>
          </div>
        </section>

        {/* Location & Extra */}
        <section className="space-y-5">
          <div className="flex items-center gap-2 text-[#4a6741] font-bold uppercase tracking-widest text-xs mb-2 mt-4">
            <MapPin className="w-4 h-4" /> Logistics
          </div>
          <div>
            <label className="block text-sm font-bold text-[#27210f] mb-2">Exact Pickup Address</label>
            <input type="text" placeholder="123 Main St, Back Alley Door" required 
              className="w-full border border-[#ccc5b2] p-4 rounded-xl focus:border-[#4a6741] focus:ring-1 focus:ring-[#4a6741] outline-none transition" 
              onChange={e => setFormData({...formData, location: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#27210f] mb-2">Instructions / Notes</label>
            <textarea placeholder="e.g. Ring the bell, bring your own containers, contains nuts..." 
              className="w-full border border-[#ccc5b2] p-4 rounded-xl focus:border-[#4a6741] focus:ring-1 focus:ring-[#4a6741] outline-none transition min-h-32" 
              onChange={e => setFormData({...formData, notes: e.target.value})} />
          </div>
        </section>

        <button disabled={loading} className="w-full bg-[#c07a13] text-white py-5 rounded-xl font-bold text-lg hover:bg-[#9b5e08] transition shadow-md disabled:opacity-60 disabled:transform-none mt-4">
          {loading ? 'Publishing to Network...' : 'Publish Food Donation'}
        </button>
      </form>
    </div>
  );
}