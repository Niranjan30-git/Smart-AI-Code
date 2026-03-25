
import React from 'react';
import { User, UserRole } from '../types';
import { Button } from './Button';

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <nav className="glass border-b border-slate-100 sticky top-0 z-[100] px-4 py-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100 transform group-hover:rotate-12 transition-all">
            <span className="text-white font-black text-2xl tracking-tighter">CF</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 leading-none tracking-tighter">Codeflix</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
              {user.role === UserRole.ADMIN ? 'Enterprise Command' : 'Developer Console'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-end gap-0.5">
            <p className="text-sm font-black text-slate-900 tracking-tight">{user.name}</p>
            <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.1em]">{user.category}</p>
            </div>
          </div>
          <div className="h-10 w-[1px] bg-slate-100 hidden sm:block"></div>
          <Button variant="ghost" size="sm" onClick={onLogout} className="rounded-2xl border border-slate-100 px-6 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all">
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
};
