"use client";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { MapPin, Clock, Package, User, CheckCircle2, Navigation, Edit2, Trash2, X, ShieldAlert, Sparkles, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { data: session } = useSession();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, MY_CLAIMS, MY_DONATIONS
  const [editingDonation, setEditingDonation] = useState(null);
  const [updating, setUpdating] = useState(false);
  
  // Rescue confirmation state
  const [showRescueModal, setShowRescueModal] = useState(null); // stores donation ID
  const [qualityChecked, setQualityChecked] = useState(false);

  // AI Assist state
  const [aiPanelListing, setAiPanelListing] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");

  const isAdmin = session?.user?.role === 'ADMIN';

  const loadDonations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/donations', { cache: 'no-store' });
      const data = await res.json();
      setDonations(data);
    } catch (err) {
      console.error("Failed to load donations", err);
    }
    setLoading(false);
  };

  useEffect(() => { loadDonations(); }, []);

  const handleClaim = async () => {
    if (!qualityChecked) return alert('Please confirm you will verify the food quality.');
    const id = showRescueModal;
    
    const res = await fetch(`/api/donations/${id}/claim`, { method: 'POST' });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error);
    } else {
      setShowRescueModal(null);
      setQualityChecked(false);
      loadDonations();
    }
  };

  const handleStatus = async (id, newStatus) => {
    if (newStatus === 'CANCELLED' && !confirm('Are you sure you want to delete this listing?')) return;
    await fetch(`/api/donations/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    loadDonations();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const res = await fetch(`/api/donations/${editingDonation.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingDonation)
    });
    if (res.ok) {
      setEditingDonation(null);
      loadDonations();
    }
    setUpdating(false);
  };

  const handleAIAction = async (action, payload) => {
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload })
      });
      const data = await res.json();
      setAiResult(JSON.stringify(data, null, 2));
    } catch(err) {
      setAiResult(`Error: ${err.message}`);
    }
    setAiLoading(false);
  };

  const filtered = donations.filter(d => {
    if (filter === 'MY_CLAIMS') return d.claimerId === session?.user?.id;
    if (filter === 'MY_DONATIONS') return d.donorId === session?.user?.id;
    return d.status === 'AVAILABLE';
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-serif font-extrabold text-[#27210f] tracking-tight text-center md:text-left">Live Rescue Feed</h1>
          <p className="text-[#6b6248] mt-2 font-medium text-center md:text-left">Real-time surplus food availability supporting SDG 2: Zero Hunger.</p>
        </div>

        <div className="flex flex-wrap gap-2 bg-[#ede9df] p-1.5 rounded-2xl w-full md:w-auto shadow-inner border border-[#d5cfbf]">
          <button onClick={() => setFilter('ALL')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition flex-1 md:flex-none ${filter === 'ALL' ? 'bg-white shadow-md text-[#27210f]' : 'text-[#6b6248] hover:bg-white/50'}`}>Available</button>
          {session?.user?.role !== 'DONOR' && (
            <button onClick={() => setFilter('MY_CLAIMS')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition flex-1 md:flex-none ${filter === 'MY_CLAIMS' ? 'bg-white shadow-md text-[#27210f]' : 'text-[#6b6248] hover:bg-white/50'}`}>My Rescues</button>
          )}
          {session?.user?.role === 'DONOR' || isAdmin ? (
            <button onClick={() => setFilter('MY_DONATIONS')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition flex-1 md:flex-none ${filter === 'MY_DONATIONS' ? 'bg-white shadow-md text-[#27210f]' : 'text-[#6b6248] hover:bg-white/50'}`}>My Listings</button>
          ) : null}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-32">
           <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#4a6741] border-r-transparent align-[-0.125em]" role="status"></div>
           <p className="mt-4 text-[#a89f88] font-serif italic text-xl text-center">Scanning for available rescues...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filtered.map(d => (
            <div key={d.id} className="group bg-white rounded-[2rem] p-8 shadow-sm border border-[#ccc5b2] hover:border-[#4a6741] hover:shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden">
              {d.status === 'CLAIMED' && <div className="absolute top-0 right-0 bg-[#c07a13] text-white px-6 py-1.5 rounded-bl-2xl text-xs font-bold uppercase tracking-widest">Claimed</div>}
              
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <span className="px-4 py-1.5 bg-[#d0dcc9] text-[#4a6741] rounded-full text-xs font-bold uppercase tracking-wider">{d.type}</span>
                  {d.status === 'COLLECTED' && <span className="px-4 py-1.5 bg-[#f5f2eb] text-[#a89f88] rounded-full text-xs font-bold uppercase tracking-wider line-through">Collected</span>}
                </div>
                <span className="text-xs text-[#a89f88] font-semibold">{new Date(d.createdAt).toLocaleDateString()}</span>
              </div>

              <h3 className="text-3xl font-serif font-bold text-[#27210f] mb-6 leading-tight group-hover:text-[#4a6741] transition-colors">{d.title}</h3>

              <div className="space-y-4 mb-8 flex-grow">
                <div className="flex items-center gap-4 text-[#27210f] bg-[#faf9f5] p-3 rounded-xl border border-[#ede9df]">
                  <Package className="w-5 h-5 text-[#c07a13]" />
                  <span className="font-bold text-lg">{d.quantity}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="flex items-start gap-3 text-[#6b6248] text-sm">
                    <User className="w-5 h-5 text-[#a89f88] shrink-0" />
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-tighter opacity-70">Donor</p>
                        <span className="font-semibold">{d.donor?.name}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-[#6b6248] text-sm">
                    <Clock className="w-5 h-5 text-[#a89f88] shrink-0" />
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-tighter opacity-70">Expiry</p>
                        <span className="font-semibold text-[#c44a1a]">{new Date(d.expires).toLocaleString([], {weekday:'short', hour:'2-digit', minute:'2-digit'})}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 text-[#6b6248] text-sm pt-2">
                  <MapPin className="w-5 h-5 text-[#a89f88] shrink-0" />
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{d.location}</span>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.location)}`} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-[#4a6741] text-white rounded-lg hover:bg-[#354d2e] transition shadow-sm" title="Open in Map">
                      <Navigation className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {d.notes && (
                  <div className="text-sm text-[#a89f88] italic border-t border-[#ede9df] pt-4 mt-4">
                    "{d.notes}"
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-auto">
                {d.status === 'AVAILABLE' && (session?.user?.id !== d.donorId) && (
                  <button onClick={() => setShowRescueModal(d.id)} className="flex-grow flex items-center justify-center gap-2 bg-[#27210f] text-white py-4 rounded-2xl font-bold hover:bg-[#4a6741] transition-all transform active:scale-95 shadow-md">
                    <CheckCircle2 className="w-5 h-5" />
                    Commit to Rescue
                  </button>
                )}

                {d.status === 'CLAIMED' && (d.claimerId === session?.user?.id || d.donorId === session?.user?.id || isAdmin) && (
                  <button onClick={() => handleStatus(d.id, 'COLLECTED')} className="flex-grow flex items-center justify-center gap-2 bg-[#4a6741] text-white py-4 rounded-2xl font-bold hover:bg-[#354d2e] transition-all shadow-md">
                    Mark as Collected
                  </button>
                )}

                {(session?.user?.id === d.donorId || isAdmin) && d.status === 'AVAILABLE' && (
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex gap-2 w-full">
                      <button 
                        onClick={() => setEditingDonation({...d, expires: new Date(d.expires).toISOString().slice(0, 16)})} 
                        className="flex-grow flex items-center justify-center gap-2 bg-[#f5f2eb] text-[#27210f] border border-[#ccc5b2] py-4 rounded-2xl font-bold hover:bg-white transition-all shadow-sm">
                          <Edit2 className="w-5 h-5" /> Edit
                      </button>
                      <button onClick={() => handleStatus(d.id, 'CANCELLED')} className="p-4 rounded-2xl bg-white text-[#c44a1a] border border-[#f0d5c8] hover:bg-[#f0d5c8] transition-all">
                          <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <button 
                      onClick={() => setAiPanelListing(d)} 
                      className="flex items-center justify-center gap-2 bg-[#f0edff] text-[#553db0] py-3 rounded-2xl font-bold hover:bg-[#e0d9fc] transition-all shadow-sm w-full mt-1 border border-[#d1c8f8]">
                        <Sparkles className="w-5 h-5" /> AI Assist
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
             <div className="col-span-full py-32 text-center border-4 border-dashed border-[#ede9df] rounded-[3rem] bg-[#faf9f5]">
               <div className="text-6xl mb-6">🌏</div>
               <h3 className="text-2xl font-serif font-bold text-[#27210f] mb-3 text-center">No results matching your criteria</h3>
               <p className="text-[#6b6248] max-w-sm mx-auto text-center">Check back soon! Every listing on ShareBite brings us closer to a world with Zero Hunger.</p>
               {filter !== 'ALL' && <button onClick={() => setFilter('ALL')} className="mt-8 text-[#4a6741] font-bold underline">Show all available rescues</button>}
             </div>
          )}
        </div>
      )}

      {/* --- RESCUE CONFIRMATION MODAL --- */}
      {showRescueModal && (
         <div className="fixed inset-0 bg-[#1c1a16]/80 backdrop-blur-md z-[110] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 md:p-12 shadow-2xl border border-[#ede9df] animate-in zoom-in duration-200">
               <div className="flex justify-center mb-6">
                  <div className="bg-orange-50 text-[#c07a13] p-4 rounded-full">
                     <ShieldAlert className="w-12 h-12" />
                  </div>
               </div>
               <h3 className="text-3xl font-serif font-bold text-[#27210f] text-center mb-4">Safety Verification</h3>
               <p className="text-[#6b6248] text-center mb-8 leading-relaxed">
                  ShareBite is a connection platform only. By committing, you agree to <strong>verify the food quality, smell, and appearance yourself</strong> at the time of pickup. 
                  <br/><br/>
                  Rescued food is collected at your own risk.
               </p>
               
               <label className="flex items-start gap-3 bg-[#faf9f5] p-5 rounded-2xl border border-[#ede9df] mb-8 cursor-pointer group hover:border-[#c07a13] transition-colors">
                  <input type="checkbox" checked={qualityChecked} onChange={e => setQualityChecked(e.target.checked)} className="mt-1.5 h-5 w-5 rounded border-gray-300 text-[#c07a13] focus:ring-[#c07a13]" />
                  <span className="text-sm font-bold text-[#27210f] select-none">I understand and will verify the food quality myself.</span>
               </label>

               <div className="flex gap-3">
                  <button onClick={() => {setShowRescueModal(null); setQualityChecked(false);}} className="flex-1 py-4 font-bold text-[#a89f88] hover:text-[#27210f] transition-colors">Cancel</button>
                  <button onClick={handleClaim} disabled={!qualityChecked} className="flex-[2] bg-[#27210f] text-white py-4 rounded-2xl font-bold hover:bg-[#4a6741] transition-all disabled:opacity-30 shadow-lg">Confirm & Commit</button>
               </div>
            </div>
         </div>
      )}

      {/* --- EDIT MODAL --- */}
      {editingDonation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
           <div className="bg-white rounded-[2.5rem] w-full max-w-2xl p-8 md:p-12 relative animate-in fade-in zoom-in duration-200 shadow-2xl">
              <button onClick={() => setEditingDonation(null)} className="absolute top-8 right-8 p-2 hover:bg-[#f5f2eb] rounded-full transition-colors">
                <X className="w-6 h-6 text-[#a89f88]" />
              </button>
              
              <h2 className="text-3xl font-serif font-bold text-[#27210f] mb-8 text-center md:text-left">Edit Listing</h2>
              
              <form onSubmit={handleUpdate} className="space-y-6 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#a89f88] mb-2">Title</label>
                    <input type="text" value={editingDonation.title} required 
                      className="w-full border border-[#ccc5b2] p-4 rounded-xl focus:border-[#4a6741] outline-none"
                      onChange={e => setEditingDonation({...editingDonation, title: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#a89f88] mb-2">Quantity</label>
                    <input type="text" value={editingDonation.quantity} required 
                      className="w-full border border-[#ccc5b2] p-4 rounded-xl focus:border-[#4a6741] outline-none"
                      onChange={e => setEditingDonation({...editingDonation, quantity: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#a89f88] mb-2">Expires</label>
                    <input type="datetime-local" value={editingDonation.expires} required 
                      className="w-full border border-[#ccc5b2] p-4 rounded-xl focus:border-[#4a6741] outline-none"
                      onChange={e => setEditingDonation({...editingDonation, expires: e.target.value})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#a89f88] mb-2">Location</label>
                    <input type="text" value={editingDonation.location} required 
                      className="w-full border border-[#ccc5b2] p-4 rounded-xl focus:border-[#4a6741] outline-none"
                      onChange={e => setEditingDonation({...editingDonation, location: e.target.value})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#a89f88] mb-2">Notes</label>
                    <textarea value={editingDonation.notes || ''} 
                      className="w-full border border-[#ccc5b2] p-4 rounded-xl focus:border-[#4a6741] outline-none min-h-24"
                      onChange={e => setEditingDonation({...editingDonation, notes: e.target.value})} />
                  </div>
                </div>

                <button disabled={updating} className="w-full bg-[#4a6741] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#354d2e] transition shadow-lg disabled:opacity-50 mt-4">
                  {updating ? 'Saving changes...' : 'Save Updates'}
                </button>
              </form>
           </div>
        </div>
      )}

      {/* --- AI ASSIST MODAL --- */}
      {aiPanelListing && (
         <div className="fixed inset-0 bg-[#1c1a16]/80 backdrop-blur-md z-[120] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl p-8 shadow-2xl border border-[#ede9df] animate-in zoom-in duration-200 relative max-h-[90vh] overflow-y-auto">
               <button onClick={() => {setAiPanelListing(null); setAiResult(null); setAiQuestion("");}} className="absolute top-6 right-6 p-2 hover:bg-[#f5f2eb] rounded-full transition-colors">
                  <X className="w-6 h-6 text-[#a89f88]" />
               </button>
               <h3 className="text-3xl font-serif font-bold text-[#27210f] mb-2 flex items-center gap-3">
                  <Sparkles className="text-[#6d51c7]" /> AI Rescue Assistant
               </h3>
               <p className="text-[#6b6248] mb-6">Target Listing: <strong>{aiPanelListing.title}</strong></p>

               <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                  <button onClick={() => handleAIAction('classify', aiPanelListing)} className="bg-[#f0edff] text-[#553db0] font-semibold py-2 px-4 rounded-xl hover:bg-[#e0d9fc] text-sm transition-colors">Classify Listing</button>
                  <button onClick={() => handleAIAction('suggest_expiry', aiPanelListing)} className="bg-[#f0edff] text-[#553db0] font-semibold py-2 px-4 rounded-xl hover:bg-[#e0d9fc] text-sm transition-colors">Suggest Expiry</button>
                  <button onClick={() => handleAIAction('find_match', aiPanelListing)} className="bg-[#f0edff] text-[#553db0] font-semibold py-2 px-4 rounded-xl hover:bg-[#e0d9fc] text-sm transition-colors">Find Best Rescuer</button>
                  <button onClick={() => handleAIAction('generate_summary', { ...aiPanelListing, donorName: session?.user?.name })} className="bg-[#f0edff] text-[#553db0] font-semibold py-2 px-4 rounded-xl hover:bg-[#e0d9fc] text-sm transition-colors">Rescue Summary</button>
                  {isAdmin && (
                    <button onClick={() => handleAIAction('admin_flagging', aiPanelListing)} className="bg-[#ffe8e8] text-[#c92a2a] font-semibold py-2 px-4 rounded-xl hover:bg-[#ffc9c9] text-sm transition-colors">Admin Flagging</button>
                  )}
                  {isAdmin && (
                    <button onClick={() => handleAIAction('alert_automation', aiPanelListing)} className="bg-[#fff3e0] text-[#e67700] font-semibold py-2 px-4 rounded-xl hover:bg-[#ffe8cc] text-sm transition-colors">Alert Automation</button>
                  )}
               </div>

               <div className="mb-6 flex gap-2">
                 <input type="text" placeholder="Ask ShareBite AI a question..." value={aiQuestion} onChange={(e) => setAiQuestion(e.target.value)} className="flex-1 border border-[#ccc5b2] p-3 rounded-xl focus:border-[#6d51c7] outline-none" />
                 <button onClick={() => handleAIAction('ask_assistant', { question: aiQuestion })} className="bg-[#27210f] text-white px-5 rounded-xl font-bold hover:bg-[#6d51c7] transition-colors flex items-center justify-center"><MessageSquare className="w-5 h-5" /></button>
               </div>
               
               {isAdmin && (
                 <div className="mb-6">
                   <button onClick={() => handleAIAction('analytics_helper', { data: `Listings: ${donations.length}, Claims: ${donations.filter(d => d.status === 'CLAIMED').length}` })} className="w-full bg-[#f8f9fa] border border-[#e9ecef] text-[#495057] font-semibold py-2 rounded-xl hover:bg-[#e9ecef] transition-colors">View Analytics Helper (Admin)</button>
                 </div>
               )}

               <div className="bg-[#1c1a16] rounded-2xl p-6 min-h-[150px] relative overflow-hidden">
                  {aiLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#1c1a16]">
                      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-[#6d51c7] border-r-transparent"></div>
                    </div>
                  ) : aiResult ? (
                    <pre className="text-[#a5d8ff] font-mono text-sm whitespace-pre-wrap">{aiResult}</pre>
                  ) : (
                    <p className="text-[#868e96] italic text-center mt-8">Select an action above to see AI output.</p>
                  )}
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
