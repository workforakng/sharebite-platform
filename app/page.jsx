import Link from "next/link";
import { 
  ArrowRight, 
  TrendingUp, 
  Target, 
  AlertTriangle, 
  Globe, 
  Users, 
  Leaf, 
  ShieldCheck, 
  ShoppingBag,
  Info
} from "lucide-react";

export default function Home() {
  return (
    <div className="bg-[#f5f2eb] min-h-screen text-[#27210f] font-sans selection:bg-[#d0dcc9] selection:text-[#1a2e14]">
      <main>
        {/* --- HERO SECTION --- */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1a2e14] via-[#2d4a22] to-[#4a6741] py-32 px-6 text-center shadow-inner">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')]"></div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <span className="inline-block border border-white/20 bg-white/10 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-6 animate-fade-in">
              UN Sustainable Development Goal 2 · 2030 Agenda
            </span>
            <h2 className="text-5xl md:text-8xl font-serif text-[#f5f0e8] mb-8 leading-tight animate-slide-up">
              End Hunger. <br/><em className="text-[#daa520] not-italic">Feed the World.</em>
            </h2>
            <p className="text-xl md:text-2xl text-[#d0dcc9] max-w-2xl mx-auto leading-relaxed mb-12">
              Hunger is the world's most solvable problem. ShareBite bridges the gap between surplus and need to help achieve Zero Hunger by 2030.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link href="/register?role=DONOR" className="bg-[#c07a13] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#9b5e08] shadow-lg transition transform hover:-translate-y-1 flex items-center gap-2">
                Take Action <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#explore" className="bg-transparent border border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition">
                Explore the Goal
              </Link>
            </div>
          </div>
        </section>

        {/* --- QUICK STATS --- */}
        <div className="bg-[#1c1a16] text-[#e8e0d0] py-12 border-y border-white/5">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-serif font-bold text-[#daa520]">673M</p>
              <p className="text-xs uppercase tracking-widest mt-2 opacity-70">Experienced hunger in 2024</p>
            </div>
            <div>
              <p className="text-4xl font-serif font-bold text-[#daa520]">8.2%</p>
              <p className="text-xs uppercase tracking-widest mt-2 opacity-70">World population undernourished</p>
            </div>
            <div>
              <p className="text-4xl font-serif font-bold text-[#daa520]">2030</p>
              <p className="text-xs uppercase tracking-widest mt-2 opacity-70">Target deadline for Zero Hunger</p>
            </div>
          </div>
        </div>

        {/* --- MISSION STATEMENT --- */}
        <section id="explore" className="py-24 px-6 max-w-4xl mx-auto text-center">
           <div className="inline-flex items-center gap-2 bg-[#f0d5c8] text-[#c44a1a] px-4 py-1.5 rounded-full text-xs font-bold mb-8">
              <AlertTriangle className="w-4 h-4" /> OFF TRACK
           </div>
           <p className="text-2xl md:text-3xl font-serif leading-relaxed text-[#6b6248]">
            "Global hunger has been rising since 2015. At the current pace, nearly <span className="text-[#27210f] font-bold">600 million people</span> will still face hunger by 2030 — nearly double the SDG 2 target of zero."
           </p>
        </section>

        {/* --- HUNGER BY THE NUMBERS --- */}
        <section className="py-24 bg-[#ede9df] px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-4xl md:text-5xl font-serif font-bold mb-4">Hunger By the Numbers</h3>
              <p className="text-[#6b6248] max-w-2xl mx-auto">Data reveals the scale of the challenge from the 2025 SOFI Report.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <StatCard icon="🌍" val="673M" label="People experiencing hunger globally" source="FAO, 2025" />
              <StatCard icon="👶" val="148M" label="Children under 5 affected by stunting" source="UNICEF / WHO, 2024" />
              <StatCard icon="🍽️" val="2.8B" label="People unable to afford a healthy diet" source="UN SDG Report, 2024" />
              <StatCard icon="🌾" val="28%" label="Global population faces food insecurity" source="FAO Hunger Map 2025" />
              <StatCard icon="♻️" val="1/3" label="Of all food produced is lost or wasted" source="UN SDG Factsheet 2024" />
              <StatCard icon="📉" val="8.2%" label="Undernourishment rate in 2024" source="FAO SOFI 2025" />
            </div>
          </div>
        </section>

        {/* --- WHAT IS SDG 2? --- */}
        <section className="py-32 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div>
                <span className="text-[#4a6741] font-bold uppercase tracking-widest text-sm mb-2 block">The Framework</span>
                <h3 className="text-4xl md:text-6xl font-serif font-bold leading-tight">End Hunger. Nourish People. Sustain the Planet.</h3>
              </div>
              <p className="text-lg text-[#6b6248] leading-relaxed">
                SDG 2 — Zero Hunger — is part of the 2030 Agenda for Sustainable Development. It calls for an end to hunger and all forms of malnutrition by 2030. 
                <br/><br/>
                The goal addresses not only hunger but also the broader challenge of ensuring everyone has access to safe, nutritious, and sufficient food year-round. It links food security tightly to sustainable agriculture.
              </p>
              <div className="grid grid-cols-2 gap-4">
                 {['Food Security', 'Nutrition', 'Anti-Hunger', 'Sustainable Ag', 'Smallholders', 'Biodiversity'].map(t => (
                   <div key={t} className="flex items-center gap-2 text-sm font-bold text-[#4a6741]">
                     <div className="h-1.5 w-1.5 rounded-full bg-[#daa520]"></div> {t}
                   </div>
                 ))}
              </div>
            </div>
            <div className="relative">
               <div className="bg-[#4a6741] rounded-[3rem] p-12 text-white shadow-2xl transform rotate-2">
                  <div className="text-8xl font-serif mb-6">2</div>
                  <h4 className="text-3xl font-bold mb-4 tracking-tighter">SDG ZERO HUNGER</h4>
                  <p className="opacity-80">United Nations · 2030 Agenda</p>
               </div>
               <div className="absolute -bottom-6 -left-6 bg-[#c07a13] w-24 h-24 rounded-2xl -z-10 animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* --- 8 TARGETS --- */}
        <section className="py-24 bg-white px-6">
           <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div className="max-w-xl">
                   <h3 className="text-4xl font-serif font-bold mb-4">8 Targets to End Hunger</h3>
                   <p className="text-[#6b6248]">Each target addresses a distinct dimension of food insecurity.</p>
                </div>
                <div className="text-sm font-bold text-[#4a6741] border-b-2 border-[#4a6741] pb-1">LEARN THE TARGETS</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <TargetItem num="2.1" title="Universal Access" desc="End hunger and ensure access to safe, nutritious food all year round." />
                <TargetItem num="2.2" title="End Malnutrition" desc="Address stunting and wasting in children and needs of vulnerable groups." />
                <TargetItem num="2.3" title="Double Productivity" desc="Double agricultural productivity and incomes of small-scale producers." />
                <TargetItem num="2.4" title="Sustainable Systems" desc="Ensure resilient agricultural practices that maintain ecosystems." />
                <TargetItem num="2.5" title="Genetic Diversity" desc="Maintain diversity of seeds, plants, and farmed animals globally." />
                <TargetItem num="2.A" title="Rural Investment" desc="Increase research and tech development in least developed countries." />
                <TargetItem num="2.B" title="Fair Trade" desc="Correct and prevent trade restrictions in world agricultural markets." />
                <TargetItem num="2.C" title="Stable Markets" desc="Ensure proper functioning of food commodity markets to limit volatility." />
              </div>
           </div>
        </section>

        {/* --- WHY DOES HUNGER PERSIST? --- */}
        <section className="py-24 px-6 bg-[#faf9f5]">
           <div className="max-w-6xl mx-auto">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-1">
                   <h3 className="text-4xl font-serif font-bold mb-6">Why Does Hunger Persist?</h3>
                   <p className="text-[#6b6248] leading-relaxed mb-8">
                    Despite enough food production to feed every person on Earth, 673 million people go hungry. The problem is systemic.
                   </p>
                   <div className="bg-[#ede9df] p-6 rounded-2xl border border-[#d5cfbf]">
                      <h5 className="font-bold text-xs uppercase tracking-widest mb-4 opacity-70 text-[#27210f]">Regional Undernourishment</h5>
                      <div className="space-y-3">
                         <ProgressLine label="Sub-Saharan Africa" val="21.3%" />
                         <ProgressLine label="Southern Asia" val="15.0%" />
                         <ProgressLine label="Caribbean" val="16.7%" />
                         <ProgressLine label="Southeast Asia" val="8.5%" />
                      </div>
                   </div>
                </div>
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                   <ReasonCard icon="⚔️" title="Conflict & Fragility" desc="More than 70% of the world's hungry live in conflict-affected areas." />
                   <ReasonCard icon="🌡️" title="Climate Change" desc="Rising temperatures disrupt harvests. Shocks are the #1 driver of spikes." />
                   <ReasonCard icon="💸" title="Poverty & Inequality" desc="2.8 billion people cannot afford a healthy diet." />
                   <ReasonCard icon="📦" title="Food Waste" desc="One third of all food produced is lost or wasted before it reaches people." />
                </div>
             </div>
           </div>
        </section>

        {/* --- PATHWAYS FORWARD --- */}
        <section className="py-32 px-6">
           <div className="max-w-6xl mx-auto text-center mb-20">
              <span className="text-[#c07a13] font-bold uppercase tracking-widest text-sm mb-4 block">Solutions</span>
              <h3 className="text-4xl md:text-6xl font-serif font-bold">Pathways Forward</h3>
           </div>
           <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
              <PathwayCard icon={<Leaf className="w-8 h-8"/>} title="Sustainable Farming" desc="Agroecological practices and climate-smart agriculture to increase yields while protecting ecosystems." />
              <PathwayCard icon={<TrendingUp className="w-8 h-8"/>} title="Ag-Innovation" desc="Drought-resistant crops and digital services to radically improve production in vulnerable regions." />
              <PathwayCard icon={<Users className="w-8 h-8"/>} title="Social Protection" desc="School meal programs and cash transfers to break intergenerational hunger cycles." />
              <PathwayCard icon={<Globe className="w-8 h-8"/>} title="Fair Trade" desc="Removing subsidies and strengthening land rights for women and smallholders globally." />
              <PathwayCard icon={<ShoppingBag className="w-8 h-8"/>} title="Reducing Waste" desc="Cutting the 1/3 of food lost could feed an additional 2 billion people. ShareBite is part of this path." />
              <PathwayCard icon={<ShieldCheck className="w-8 h-8"/>} title="Rural Infrastructure" desc="Investing in roads and cold-chain storage reduces post-harvest loss and connects markets." />
           </div>
        </section>

        {/* --- FINAL CTA --- */}
        <section className="bg-[#1a2e14] py-32 px-6 text-center text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-[#4a6741] rounded-full blur-3xl opacity-20 -mr-48 -mt-48"></div>
           <div className="relative z-10 max-w-3xl mx-auto">
             <h3 className="text-5xl md:text-7xl font-serif mb-8">Every Action Counts.</h3>
             <p className="text-xl text-[#d0dcc9] mb-12 leading-relaxed">
              Hunger is Solvable. Join individuals, communities, and governments in the global movement to end hunger.
             </p>
             <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link href="/register" className="bg-white text-[#1a2e14] px-12 py-5 rounded-full font-bold text-xl hover:bg-[#f5f2eb] transition shadow-xl">
                   Join the Movement
                </Link>
                <a href="https://www.wfp.org/" target="_blank" className="bg-transparent border-2 border-white/20 px-12 py-5 rounded-full font-bold text-xl hover:bg-white/5 transition">
                   Support WFP
                </a>
             </div>
             <p className="mt-16 text-xs font-bold uppercase tracking-[0.3em] opacity-40">
                UN SDGs · FAO · WFP · UNICEF
             </p>
           </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ icon, val, label, source }) {
  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-[#ccc5b2] hover:shadow-xl transition-all duration-500 group">
      <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform">{icon}</div>
      <p className="text-5xl font-serif font-bold text-[#27210f] mb-2">{val}</p>
      <p className="text-[#6b6248] font-medium leading-tight mb-4">{label}</p>
      <div className="pt-4 border-t border-[#ede9df] text-[10px] font-bold uppercase tracking-widest text-[#a89f88]">{source}</div>
    </div>
  );
}

function TargetItem({ num, title, desc }) {
  return (
    <div className="bg-[#faf9f5] p-8 rounded-3xl border border-[#ede9df] hover:border-[#4a6741] transition-colors group">
      <div className="text-[#daa520] font-bold text-sm mb-4 tracking-tighter">TARGET {num}</div>
      <h5 className="text-xl font-bold text-[#27210f] mb-3 group-hover:text-[#4a6741] transition-colors">{title}</h5>
      <p className="text-sm text-[#6b6248] leading-relaxed">{desc}</p>
    </div>
  );
}

function ReasonCard({ icon, title, desc }) {
  return (
    <div className="flex gap-6 p-8 bg-white rounded-3xl border border-[#ede9df] hover:shadow-md transition-shadow">
       <div className="text-4xl shrink-0">{icon}</div>
       <div>
          <h5 className="font-bold text-lg text-[#27210f] mb-2">{title}</h5>
          <p className="text-sm text-[#6b6248] leading-relaxed">{desc}</p>
       </div>
    </div>
  );
}

function PathwayCard({ icon, title, desc }) {
  return (
    <div className="text-center group">
       <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#f8f6f0] text-[#4a6741] mb-6 border border-[#ede9df] group-hover:bg-[#4a6741] group-hover:text-white transition-all duration-300 shadow-sm">
          {icon}
       </div>
       <h5 className="text-xl font-bold text-[#27210f] mb-4">{title}</h5>
       <p className="text-[#6b6248] leading-relaxed">{desc}</p>
    </div>
  );
}

function ProgressLine({ label, val }) {
  return (
    <div>
       <div className="flex justify-between text-[11px] font-bold mb-1 opacity-80 uppercase tracking-tighter">
          <span>{label}</span>
          <span>{val}</span>
       </div>
       <div className="h-1.5 w-full bg-[#d5cfbf] rounded-full overflow-hidden">
          <div className="h-full bg-[#4a6741] rounded-full" style={{ width: val }}></div>
       </div>
    </div>
  );
}
