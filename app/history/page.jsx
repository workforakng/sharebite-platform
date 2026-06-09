"use client";
import { useEffect, useState } from 'react';
import { History, User, Package, CalendarCheck, ArrowRight } from 'lucide-react';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch('/api/history', { cache: 'no-store' });
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error("Failed to load history", err);
      }
      setLoading(false);
    };
    loadHistory();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-serif font-extrabold text-[#27210f] tracking-tight flex items-center gap-3">
          <History className="w-8 h-8 text-[#4a6741]" /> Rescue Hall of Fame
        </h1>
        <p className="text-[#6b6248] mt-2 font-medium">A transparent log of all completed food rescues on ShareBite.</p>
      </div>

      {loading ? (
        <div className="text-center py-32">
           <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#4a6741] border-r-transparent align-[-0.125em]" role="status"></div>
           <p className="mt-4 text-[#a89f88] font-serif italic">Loading rescue logs...</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-[#ccc5b2] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#faf9f5] border-b border-[#ede9df]">
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-[#a89f88]">Donation</th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-[#a89f88]">Rescue Flow</th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-[#a89f88]">Quantity</th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-[#a89f88]">Completed On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ede9df]">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-[#fcfbf9] transition-colors group">
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="font-serif font-bold text-[#27210f] text-lg">{item.title}</span>
                        <span className="text-[10px] bg-[#d0dcc9] text-[#4a6741] px-2 py-0.5 rounded-full font-bold w-fit mt-1">{item.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                           <span className="text-xs text-[#a89f88] font-bold uppercase tracking-tighter">Donor</span>
                           <span className="font-semibold text-[#27210f]">{item.donor?.name}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#ccc5b2]" />
                        <div className="flex flex-col">
                           <span className="text-xs text-[#a89f88] font-bold uppercase tracking-tighter">Rescued By</span>
                           <span className="font-semibold text-[#4a6741]">{item.claimer?.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                       <div className="flex items-center gap-2 text-[#27210f]">
                          <Package className="w-4 h-4 text-[#c07a13]" />
                          <span className="font-bold">{item.quantity}</span>
                       </div>
                    </td>
                    <td className="px-6 py-6">
                       <div className="flex items-center gap-2 text-[#6b6248] text-sm">
                          <CalendarCheck className="w-4 h-4" />
                          {new Date(item.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {history.length === 0 && (
            <div className="py-24 text-center">
              <div className="text-5xl mb-4">📜</div>
              <h3 className="text-xl font-serif font-bold text-[#27210f]">No rescues completed yet</h3>
              <p className="text-[#6b6248]">The first completed rescue will appear here!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
