"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { HandPlatter } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="bg-[#f8f6f0]/90 backdrop-blur-md border-b border-[#d5cfbf] px-6 py-4 sticky top-0 z-50 shadow-sm transition-all">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-[#4a6741] text-white rounded-full h-10 w-10 flex items-center justify-center font-bold text-xl group-hover:bg-[#354d2e] transition-colors shadow-sm">S</div>
          <div>
            <h1 className="text-2xl font-serif font-extrabold tracking-tight text-[#27210f]">ShareBite</h1>
            <span className="text-[10px] bg-[#d0dcc9] text-[#4a6741] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">SDG 2</span>
          </div>
        </Link>
        
        <nav className="flex gap-4 md:gap-8 items-center">
          <Link href="/dashboard" className="text-[#6b6248] font-bold text-sm hover:text-[#4a6741] transition-colors uppercase tracking-widest animate-feed-glow">Feed</Link>
          <Link href="/history" className="text-[#6b6248] font-bold text-sm hover:text-[#4a6741] transition-colors uppercase tracking-widest">History</Link>
          
          {session ? (
            <>
              {session.user.role === 'DONOR' && (
                <Link href="/donate" className="text-[#6b6248] font-bold text-sm hover:text-[#4a6741] transition-colors uppercase tracking-widest">Donate</Link>
              )}
              {session.user.role === 'ADMIN' && (
                <Link href="/admin" className="text-[#4a6741] font-extrabold text-sm uppercase tracking-widest">Admin</Link>
              )}
              <button 
                onClick={() => signOut({ callbackUrl: '/' })} 
                className="text-xs font-bold bg-[#ede9df] text-[#27210f] border border-[#d5cfbf] px-5 py-2 rounded-full hover:bg-white transition-all shadow-sm uppercase tracking-widest">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-bold text-[#6b6248] hover:text-[#27210f] transition-colors uppercase tracking-widest">Log In</Link>
              <Link href="/register" className="text-sm font-bold bg-[#c07a13] text-white px-6 py-2.5 rounded-full hover:bg-[#9b5e08] transition-all shadow-md uppercase tracking-widest">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
