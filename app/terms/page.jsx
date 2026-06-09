import { ShieldAlert, Scale, Info, CheckCircle2 } from "lucide-react";

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 font-sans text-[#27210f]">
      <div className="mb-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f8f6f0] text-[#4a6741] mb-6 border border-[#ede9df]">
          <Scale className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-extrabold tracking-tight mb-4">Terms & Conditions</h1>
        <p className="text-[#6b6248] font-medium uppercase tracking-widest text-xs">Effective Date: June 10, 2026 · India</p>
      </div>

      <div className="space-y-12 leading-relaxed">
        <section className="bg-white p-8 rounded-3xl border border-[#ede9df] shadow-sm">
           <div className="flex items-center gap-3 mb-6 text-[#c44a1a]">
              <ShieldAlert className="w-6 h-6" />
              <h2 className="text-2xl font-serif font-bold">1. Crucial Food Safety Disclaimer</h2>
           </div>
           <p className="text-[#27210f] font-bold mb-4 bg-red-50 p-4 rounded-xl border border-red-100">
             SHAREBITE IS A TECHNOLOGY PLATFORM FOR INFORMATION AND CONNECTION ONLY. WE DO NOT PRODUCE, STORE, OR HANDLE FOOD.
           </p>
           <ul className="space-y-4 text-[#6b6248]">
              <li className="flex gap-3">
                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#c44a1a] shrink-0"></div>
                <span><strong>User Responsibility:</strong> Any person or entity claiming a rescue (the "Rescuer") must **independently verify the quality, freshness, and safety** of the food at the time of collection.</span>
              </li>
              <li className="flex gap-3">
                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#c44a1a] shrink-0"></div>
                <span><strong>Platform Neutrality:</strong> ShareBite does not guarantee that the food listed by Donors is fit for human consumption. By using this platform, you agree that you consume or distribute rescued food at your own risk.</span>
              </li>
           </ul>
        </section>

        <section className="space-y-6">
           <h2 className="text-2xl font-serif font-bold border-b border-[#d5cfbf] pb-2">2. Intermediary Status (IT Act, 2000)</h2>
           <p className="text-[#6b6248]">
             ShareBite acts as an **"Intermediary"** as defined under Section 2(1)(w) of the Information Technology Act, 2000 (India). Our role is strictly limited to providing a platform for Donors and NGOs/Volunteers to interact. We do not exercise editorial control over the listings posted by users.
           </p>
        </section>

        <section className="space-y-6">
           <h2 className="text-2xl font-serif font-bold border-b border-[#d5cfbf] pb-2">3. Donor & NGO Obligations</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
              <div className="p-6 bg-[#fcfbf9] rounded-2xl border border-[#ede9df]">
                 <h4 className="font-bold text-[#4a6741] mb-2 uppercase tracking-tighter text-xs">For Donors</h4>
                 <p className="text-sm text-[#6b6248]">Donors must provide accurate information regarding food types and expiry. Donating contaminated or harmful food knowingly may lead to legal action under local municipal laws.</p>
              </div>
              <div className="p-6 bg-[#fcfbf9] rounded-2xl border border-[#ede9df]">
                 <h4 className="font-bold text-[#4a6741] mb-2 uppercase tracking-tighter text-xs">For Rescuers</h4>
                 <p className="text-sm text-[#6b6248]">NGOs and volunteers must use appropriate transport (e.g., insulated bags) to maintain food hygiene during the transit from donor to end-recipient.</p>
              </div>
           </div>
        </section>

        <section className="space-y-6">
           <h2 className="text-2xl font-serif font-bold border-b border-[#d5cfbf] pb-2">4. Limitation of Liability</h2>
           <p className="text-[#6b6248]">
             To the fullest extent permitted by Indian law, ShareBite (and its developers/owners) shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the consumption of food rescued via the platform, or for any disputes between users.
           </p>
        </section>

        <section className="bg-[#4a6741] text-white p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
           <h2 className="text-2xl font-serif font-bold mb-4">Acceptance of Terms</h2>
           <p className="opacity-90 mb-8 leading-relaxed">
             By registering on ShareBite, you acknowledge that you have read, understood, and agreed to these terms. Together, we can solve hunger safely and responsibly.
           </p>
           <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#daa520]">
              <CheckCircle2 className="w-4 h-4" /> Supporting SDG 2: Zero Hunger
           </div>
        </section>

        <footer className="text-center pt-10 border-t border-[#d5cfbf]">
           <p className="text-xs text-[#a89f88] font-bold uppercase tracking-widest">
             Made with ❤️ by AkNG · India
           </p>
        </footer>
      </div>
    </div>
  );
}
