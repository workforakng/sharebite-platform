import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import AuthProvider from "./components/AuthProvider";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const instrument = Instrument_Serif({ 
  subsets: ["latin"], 
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument" 
});

export const metadata = {
  title: "ShareBite — Zero Food Waste. Zero Hunger.",
  description: "Connect surplus food from donors to NGOs and volunteers. Supporting SDG 2: Zero Hunger.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${instrument.variable} font-sans bg-[#f5f2eb]`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <footer className="bg-[#1c1a16] text-[#e8e0d0] py-16 px-6">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-[#4a6741] text-white rounded-full h-8 w-8 flex items-center justify-center font-bold">S</div>
                      <h4 className="text-xl font-serif font-bold tracking-tight text-white">ShareBite</h4>
                    </div>
                    <p className="text-[#877d68] text-sm leading-relaxed">
                      ShareBite is a food rescue platform dedicated to achieving Sustainable Development Goal 2: Zero Hunger by connecting surplus food with those who need it most.
                    </p>
                  </div>
                  <div>
                    <h5 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">Quick Links</h5>
                    <ul className="space-y-2 text-sm text-[#877d68]">
                      <li><a href="/dashboard" className="hover:text-[#7dab6e] transition">Rescue Feed</a></li>
                      <li><a href="/donate" className="hover:text-[#7dab6e] transition">List Food</a></li>
                      <li><a href="/register" className="hover:text-[#7dab6e] transition">Join Movement</a></li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">Impact</h5>
                    <p className="text-[#877d68] text-sm">Every rescue counts. Reducing food waste is the most immediate way to combat hunger and environmental impact.</p>
                  </div>
                </div>
                <div className="border-t border-[#38352e] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#5e5748]">
                  <p>© 2026 ShareBite Platform. All rights reserved.</p>
                  <p className="font-medium tracking-wide">
                    Made with ❤️ by <span className="text-[#7dab6e]">AkNG</span> · 
                    GitHub <a href="https://github.com/workforakng" className="text-white hover:underline">@workforakng</a>
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
